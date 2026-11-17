/**
 * Todos os cálculos da calculadora. Funções puras: nada de React, nada de localStorage.
 * Valores monetários em reais (number). Percentuais como 0–100 (ex.: 30 = 30%).
 * Entradas vazias/inválidas viram 0 ou `null` — nunca NaN/Infinity.
 */

export type Unidade = "g" | "kg" | "ml" | "L" | "un";
export type UnidadeBase = "g" | "ml" | "un";

const FATOR: Record<Unidade, { base: UnidadeBase; fator: number }> = {
  g: { base: "g", fator: 1 },
  kg: { base: "g", fator: 1000 },
  ml: { base: "ml", fator: 1 },
  L: { base: "ml", fator: 1000 },
  un: { base: "un", fator: 1 },
};

/** Número "seguro": finito e ≥ 0; qualquer outra coisa vira 0. */
export function n(v: number | null | undefined): number {
  return typeof v === "number" && Number.isFinite(v) && v > 0 ? v : 0;
}

export function unidadeBase(u: Unidade): UnidadeBase {
  return FATOR[u].base;
}

export function compativeis(a: Unidade, b: Unidade): boolean {
  return FATOR[a].base === FATOR[b].base;
}

/** Converte `qtd` de uma unidade para outra (g↔kg, ml↔L). Unidades incompatíveis → null. */
export function converter(qtd: number, de: Unidade, para: Unidade): number | null {
  if (!compativeis(de, para)) return null;
  return (n(qtd) * FATOR[de].fator) / FATOR[para].fator;
}

/* ---------------- Ingredientes e embalagens ---------------- */

export interface IngredienteCalc {
  preco: number | null; // preço pago na embalagem
  qtdEmbalagem: number | null; // quanto vem na embalagem
  unidade: Unidade; // unidade da embalagem
}

/** Custo por g, ml ou unidade. Sem preço ou sem quantidade → null ("falta preencher"). */
export function custoPorBase(ing: IngredienteCalc): number | null {
  const preco = n(ing.preco);
  const qtdBase = converter(n(ing.qtdEmbalagem), ing.unidade, unidadeBase(ing.unidade)) ?? 0;
  if (!preco || !qtdBase) return null;
  return preco / qtdBase;
}

export interface EmbalagemCalc {
  preco: number | null; // preço do pacote
  qtdPacote: number | null; // unidades no pacote (vazio = 1)
}

export function custoEmbalagemUnit(e: EmbalagemCalc): number | null {
  const preco = n(e.preco);
  if (!preco) return null;
  return preco / (n(e.qtdPacote) || 1);
}

/* ---------------- Perfil (onboarding) ---------------- */

/** Valor da hora = quanto quer ganhar ÷ horas trabalhadas. */
export function valorHora(proLabore: number | null, horasMes: number | null): number {
  const h = n(horasMes);
  return h ? n(proLabore) / h : 0;
}

export function somaFixos(fixos: Record<string, number | null>): number {
  return Object.values(fixos).reduce<number>((s, v) => s + n(v), 0);
}

/** Custo fixo mensal rateado por unidade produzida. */
export function custoFixoPorUnidade(totalFixos: number, unidadesMes: number | null): number {
  const u = n(unidadesMes);
  return u ? n(totalFixos) / u : 0;
}

/** Mão de obra de um lote: minutos × valor da hora. */
export function maoDeObra(minutos: number | null, vHora: number): number {
  return (n(minutos) / 60) * n(vHora);
}

/* ---------------- Receita ---------------- */

export interface ItemCalc {
  nome: string;
  qtd: number | null;
  unidade: Unidade;
  ingrediente: IngredienteCalc | null; // null = ingrediente apagado
}

export interface EmbalagemItemCalc {
  nome: string;
  qtd: number | null; // por unidade vendida
  embalagem: EmbalagemCalc | null;
}

export interface ReceitaCalc {
  rendimento: number | null;
  itens: ItemCalc[];
  embalagens: EmbalagemItemCalc[];
  tempoMin: number | null; // tempo do lote inteiro
}

export interface PerfilCalc {
  valorHora: number;
  fixoPorUnidade: number;
}

export interface Custos {
  ingredientes: number;
  embalagem: number;
  maoDeObra: number;
  fixo: number;
  total: number;
}

export interface ResultadoCusto {
  porUnidade: Custos;
  lote: Custos;
  rendimento: number;
  /** avisos amigáveis: ingrediente sem preço, unidade incompatível etc. */
  pendencias: string[];
}

export function custoReceita(r: ReceitaCalc, p: PerfilCalc): ResultadoCusto {
  const pendencias: string[] = [];
  const rend = n(r.rendimento) || 1;
  if (!n(r.rendimento)) pendencias.push("Informe quantas unidades a receita rende.");

  let ingLote = 0;
  for (const it of r.itens) {
    if (!n(it.qtd)) continue;
    if (!it.ingrediente) {
      pendencias.push(`“${it.nome}” foi apagado da sua lista.`);
      continue;
    }
    const cb = custoPorBase(it.ingrediente);
    if (cb === null) {
      pendencias.push(`Falta o preço de “${it.nome}”.`);
      continue;
    }
    const qtdBase = converter(n(it.qtd), it.unidade, unidadeBase(it.ingrediente.unidade));
    if (qtdBase === null) {
      pendencias.push(`A unidade de “${it.nome}” não combina com a do cadastro.`);
      continue;
    }
    ingLote += qtdBase * cb;
  }

  let embUnit = 0;
  for (const e of r.embalagens) {
    if (!n(e.qtd)) continue;
    const cu = e.embalagem ? custoEmbalagemUnit(e.embalagem) : null;
    if (cu === null) {
      pendencias.push(`Falta o preço da embalagem “${e.nome}”.`);
      continue;
    }
    embUnit += n(e.qtd) * cu;
  }

  const moLote = maoDeObra(r.tempoMin, p.valorHora);
  const porUnidade: Custos = {
    ingredientes: ingLote / rend,
    embalagem: embUnit,
    maoDeObra: moLote / rend,
    fixo: n(p.fixoPorUnidade),
    total: 0,
  };
  porUnidade.total = porUnidade.ingredientes + porUnidade.embalagem + porUnidade.maoDeObra + porUnidade.fixo;

  const lote: Custos = {
    ingredientes: ingLote,
    embalagem: embUnit * rend,
    maoDeObra: moLote,
    fixo: porUnidade.fixo * rend,
    total: porUnidade.total * rend,
  };

  return { porUnidade, lote, rendimento: rend, pendencias };
}

/* ---------------- Preço ---------------- */

/**
 * preço = custo ÷ (1 − (margem% + taxa%)).
 * Se margem + taxa ≥ 100% não existe preço possível → null.
 */
export function precoSugerido(custo: number, margemPct: number | null, taxaPct: number | null): number | null {
  const d = 1 - (n(margemPct) + n(taxaPct)) / 100;
  if (d <= 0) return null;
  return n(custo) / d;
}

export type ModoArredondar = "centavos" | "cima50";

/** Centavos (padrão) ou "para cima" no próximo R$ 0,50 (4,37 → 4,50; 4,50 → 4,50). */
export function arredondarPreco(v: number, modo: ModoArredondar = "centavos"): number {
  const cent = Math.round(n(v) * 100);
  if (modo === "cima50") return (Math.ceil(cent / 50) * 50) / 100;
  return cent / 100;
}

/** Quanto sobra no bolso por unidade, depois de pagar custos (incl. sua hora) e a taxa. */
export function lucroLiquido(preco: number, custo: number, taxaPct: number | null): number {
  return n(preco) * (1 - n(taxaPct) / 100) - n(custo);
}

export type Status = "perdendo" | "abaixo" | "saudavel";

export interface Diagnostico {
  status: Status;
  /** perdendo: quanto perde por unidade · abaixo: quanto ganha a menos · saudável: lucro por unidade */
  valor: number;
  lucroAtual: number;
}

const TOL = 0.005; // meio centavo

export function diagnostico(
  precoAtual: number,
  custo: number,
  taxaPct: number | null,
  sugerido: number | null,
): Diagnostico {
  const lucroAtual = lucroLiquido(precoAtual, custo, taxaPct);
  if (lucroAtual < -TOL) return { status: "perdendo", valor: -lucroAtual, lucroAtual };
  if (sugerido !== null && precoAtual < sugerido - TOL) {
    const lucroIdeal = lucroLiquido(sugerido, custo, taxaPct);
    return { status: "abaixo", valor: lucroIdeal - lucroAtual, lucroAtual };
  }
  return { status: "saudavel", valor: lucroAtual, lucroAtual };
}

/** Pacote completo de preços de uma receita, já arredondados. */
export function precificar(
  custoUnit: number,
  cfg: { margem: number | null; taxaCartao: number | null; taxaApp: number | null; modo: ModoArredondar },
) {
  const bruto = {
    balcao: precoSugerido(custoUnit, cfg.margem, cfg.taxaCartao),
    app: precoSugerido(custoUnit, cfg.margem, cfg.taxaApp),
  };
  const balcao = bruto.balcao === null ? null : arredondarPreco(bruto.balcao, cfg.modo);
  const app = bruto.app === null ? null : arredondarPreco(bruto.app, cfg.modo);
  return {
    balcao,
    app,
    lucroBalcao: balcao === null ? null : lucroLiquido(balcao, custoUnit, cfg.taxaCartao),
    lucroApp: app === null ? null : lucroLiquido(app, custoUnit, cfg.taxaApp),
  };
}
