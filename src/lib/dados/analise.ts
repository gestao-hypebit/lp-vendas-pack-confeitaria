import {
  custoFixoPorUnidade,
  custoReceita,
  diagnostico,
  precificar,
  somaFixos,
  valorHora,
  type Diagnostico,
  type ResultadoCusto,
} from "@/lib/calc";
import type { Dados, Perfil, Receita } from "./tipos";

export function resumoPerfil(p: Perfil) {
  const totalFixos = somaFixos({ ...p.fixos });
  return {
    valorHora: valorHora(p.proLabore, p.horasMes),
    totalFixos,
    fixoPorUnidade: custoFixoPorUnidade(totalFixos, p.unidadesMes),
  };
}

export interface Analise {
  custo: ResultadoCusto;
  balcao: number | null;
  app: number | null;
  lucroBalcao: number | null;
  lucroApp: number | null;
  /** diagnóstico do preço atual vendendo no balcão/WhatsApp */
  diagBalcao: Diagnostico | null;
  /** o mesmo preço atual, se vendido no app de delivery */
  diagApp: Diagnostico | null;
  /** margem + taxa ≥ 100%: não existe preço possível */
  margemImpossivel: boolean;
}

/** Junta os dados guardados com as funções puras de cálculo. */
export function analisarReceita(d: Dados, r: Receita): Analise {
  const perfil = resumoPerfil(d.perfil);
  const ingMap = new Map(d.ingredientes.map((i) => [i.id, i]));
  const embMap = new Map(d.embalagens.map((e) => [e.id, e]));

  const custo = custoReceita(
    {
      rendimento: r.rendimento,
      tempoMin: r.tempoMin,
      itens: r.itens.map((it) => {
        const ing = ingMap.get(it.ingredienteId) ?? null;
        return { nome: ing?.nome ?? "Ingrediente", qtd: it.qtd, unidade: it.unidade, ingrediente: ing };
      }),
      embalagens: r.embalagens.map((e) => {
        const emb = embMap.get(e.embalagemId) ?? null;
        return { nome: emb?.nome ?? "Embalagem", qtd: e.qtd, embalagem: emb };
      }),
    },
    perfil,
  );

  const { margem, taxaCartao, taxaApp, arredondar } = d.perfil;
  const precos = precificar(custo.porUnidade.total, { margem, taxaCartao, taxaApp, modo: arredondar });
  const total = custo.porUnidade.total;
  const atual = r.precoAtual && r.precoAtual > 0 ? r.precoAtual : null;

  return {
    custo,
    ...precos,
    diagBalcao: atual !== null ? diagnostico(atual, total, taxaCartao, precos.balcao) : null,
    diagApp: atual !== null && (taxaApp ?? 0) > 0 ? diagnostico(atual, total, taxaApp, precos.app) : null,
    margemImpossivel: precos.balcao === null || precos.app === null,
  };
}
