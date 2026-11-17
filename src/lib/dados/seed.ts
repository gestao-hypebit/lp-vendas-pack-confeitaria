import type { Unidade } from "@/lib/calc";
import { VERSAO_DADOS, type Dados, type Embalagem, type Ingrediente, type Perfil, type Receita } from "./tipos";

export function novoId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

export const PERFIL_VAZIO: Perfil = {
  nome: "",
  proLabore: null,
  horasMes: null,
  fixos: { gas: null, energia: null, internet: null, mei: null, aluguel: null, outros: null },
  unidadesMes: null,
  taxaCartao: null,
  taxaApp: null,
  margem: 30,
  arredondar: "centavos",
};

/** Ingredientes comuns, com a embalagem mais vendida já preenchida. Sem preço. */
const INGREDIENTES: [string, number, Unidade][] = [
  ["Leite condensado", 395, "g"],
  ["Creme de leite", 200, "g"],
  ["Chocolate nobre (barra)", 1, "kg"],
  ["Chocolate em pó", 200, "g"],
  ["Cacau em pó", 100, "g"],
  ["Manteiga", 200, "g"],
  ["Granulado de chocolate", 400, "g"],
  ["Farinha de trigo", 1, "kg"],
  ["Açúcar", 1, "kg"],
  ["Açúcar de confeiteiro", 500, "g"],
  ["Ovos", 12, "un"],
  ["Leite", 1, "L"],
  ["Leite em pó", 400, "g"],
  ["Óleo", 900, "ml"],
  ["Fermento em pó", 100, "g"],
  ["Coco ralado", 100, "g"],
  ["Essência de baunilha", 30, "ml"],
  ["Morango", 250, "g"],
  ["Doce de leite", 400, "g"],
  ["Creme de avelã", 650, "g"],
];

const EMBALAGENS: [string, number][] = [
  ["Forminha", 100],
  ["Caixinha", 10],
  ["Pote com tampa", 25],
  ["Colherzinha", 50],
  ["Fita (pedaço)", 1],
  ["Sacola", 10],
  ["Etiqueta / adesivo", 100],
];

/** Preços de exemplo usados pela receita demo (marcados como EXEMPLO). */
const PRECOS_EXEMPLO: Record<string, number> = {
  "Leite condensado": 7.9,
  "Creme de leite": 3.9,
  "Chocolate nobre (barra)": 49.9,
  Manteiga: 13.9,
  "Granulado de chocolate": 12.9,
  Forminha: 9.9,
};

export const NOME_DEMO = "Brigadeiro gourmet – exemplo";

export function dadosIniciais(): Dados {
  const ingredientes: Ingrediente[] = INGREDIENTES.map(([nome, qtd, unidade]) => {
    const p = PRECOS_EXEMPLO[nome];
    return { id: novoId(), nome, qtdEmbalagem: qtd, unidade, preco: p ?? null, ...(p ? { exemplo: true } : {}) };
  });
  const embalagens: Embalagem[] = EMBALAGENS.map(([nome, qtd]) => {
    const p = PRECOS_EXEMPLO[nome];
    return { id: novoId(), nome, qtdPacote: qtd, preco: p ?? null, ...(p ? { exemplo: true } : {}) };
  });
  const ing = (nome: string) => ingredientes.find((i) => i.nome === nome)!.id;

  const demo: Receita = {
    id: novoId(),
    nome: NOME_DEMO,
    rendimento: 25,
    itens: [
      { ingredienteId: ing("Leite condensado"), qtd: 395, unidade: "g" },
      { ingredienteId: ing("Creme de leite"), qtd: 100, unidade: "g" },
      { ingredienteId: ing("Chocolate nobre (barra)"), qtd: 100, unidade: "g" },
      { ingredienteId: ing("Manteiga"), qtd: 15, unidade: "g" },
      { ingredienteId: ing("Granulado de chocolate"), qtd: 120, unidade: "g" },
    ],
    embalagens: [{ embalagemId: embalagens.find((e) => e.nome === "Forminha")!.id, qtd: 1 }],
    tempoMin: 90,
    precoAtual: 2.5,
    vendasMes: 200,
    exemplo: true,
    atualizadaEm: Date.now(),
  };

  return {
    versao: VERSAO_DADOS,
    onboardingFeito: false,
    perfil: structuredClone(PERFIL_VAZIO),
    ingredientes,
    embalagens,
    receitas: [demo],
  };
}

/** Remove a receita demo e os preços que ainda estão marcados como exemplo. */
export function removerExemplo(d: Dados): Dados {
  return {
    ...d,
    receitas: d.receitas.filter((r) => !r.exemplo),
    ingredientes: d.ingredientes.map((i) => (i.exemplo ? { ...i, preco: null, exemplo: undefined } : i)),
    embalagens: d.embalagens.map((e) => (e.exemplo ? { ...e, preco: null, exemplo: undefined } : e)),
  };
}

export function temExemplo(d: Dados): boolean {
  return d.receitas.some((r) => r.exemplo) || d.ingredientes.some((i) => i.exemplo) || d.embalagens.some((e) => e.exemplo);
}
