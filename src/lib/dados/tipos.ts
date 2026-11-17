import type { ModoArredondar, Unidade } from "@/lib/calc";

export const VERSAO_DADOS = 1;

export interface Fixos {
  gas: number | null;
  energia: number | null;
  internet: number | null;
  mei: number | null;
  aluguel: number | null;
  outros: number | null;
}

export interface Perfil {
  nome: string;
  proLabore: number | null;
  horasMes: number | null;
  fixos: Fixos;
  unidadesMes: number | null;
  taxaCartao: number | null;
  taxaApp: number | null;
  margem: number | null;
  arredondar: ModoArredondar;
}

export interface Ingrediente {
  id: string;
  nome: string;
  preco: number | null;
  qtdEmbalagem: number | null;
  unidade: Unidade;
  /** preço de exemplo (vem da receita demo); some quando ela edita */
  exemplo?: boolean;
}

export interface Embalagem {
  id: string;
  nome: string;
  preco: number | null;
  qtdPacote: number | null;
  exemplo?: boolean;
}

export interface ItemReceita {
  ingredienteId: string;
  qtd: number | null;
  unidade: Unidade;
}

export interface EmbalagemReceita {
  embalagemId: string;
  qtd: number | null; // por unidade vendida
}

export interface Receita {
  id: string;
  nome: string;
  rendimento: number | null;
  foto?: string; // dataURL já reduzida
  itens: ItemReceita[];
  embalagens: EmbalagemReceita[];
  tempoMin: number | null;
  precoAtual: number | null;
  vendasMes: number | null;
  exemplo?: boolean;
  atualizadaEm: number;
}

export interface Dados {
  versao: typeof VERSAO_DADOS;
  onboardingFeito: boolean;
  perfil: Perfil;
  ingredientes: Ingrediente[];
  embalagens: Embalagem[];
  receitas: Receita[];
}
