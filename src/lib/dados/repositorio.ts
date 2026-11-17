import { PERFIL_VAZIO, novoId } from "./seed";
import { VERSAO_DADOS, type Dados, type Perfil } from "./tipos";

/**
 * Onde os dados ficam guardados. Hoje: localStorage do aparelho.
 * Para migrar para Supabase, basta outra implementação desta interface
 * (carregar/salvar por usuário logado) — as telas não mudam.
 */
export interface Repositorio {
  carregar(): Dados | null;
  /** retorna false se não conseguiu salvar (ex.: memória cheia) */
  salvar(d: Dados): boolean;
}

const CHAVE = "calc-confeitaria:dados";

export const repositorioLocal: Repositorio = {
  carregar() {
    try {
      const raw = localStorage.getItem(CHAVE);
      return raw ? normalizar(JSON.parse(raw)) : null;
    } catch {
      return null;
    }
  },
  salvar(d) {
    try {
      localStorage.setItem(CHAVE, JSON.stringify(d));
      return true;
    } catch {
      return false;
    }
  },
};

/* ---------------- Backup (JSON) ---------------- */

const APP_ID = "calculadora-confeitaria";

export function exportarBackup(d: Dados): string {
  return JSON.stringify({ app: APP_ID, versao: d.versao, exportadoEm: new Date().toISOString(), dados: d }, null, 2);
}

/** Lê um arquivo de backup. Lança Error com mensagem amigável se não for válido. */
export function importarBackup(texto: string): Dados {
  let obj: unknown;
  try {
    obj = JSON.parse(texto);
  } catch {
    throw new Error("Esse arquivo não é um backup da calculadora.");
  }
  const o = obj as { app?: string; dados?: unknown };
  if (!o || o.app !== APP_ID || !o.dados) throw new Error("Esse arquivo não é um backup da calculadora.");
  const d = normalizar(o.dados);
  if (!d) throw new Error("O backup está incompleto ou corrompido.");
  return d;
}

/* ---------------- Normalização / migração ---------------- */

const num = (v: unknown): number | null => (typeof v === "number" && Number.isFinite(v) ? v : null);
const str = (v: unknown, padrao = ""): string => (typeof v === "string" ? v : padrao);
const arr = (v: unknown): Record<string, unknown>[] =>
  Array.isArray(v) ? v.filter((x) => x && typeof x === "object") : [];
const UNIDADES = ["g", "kg", "ml", "L", "un"] as const;
const unid = (v: unknown) => (UNIDADES.includes(v as never) ? (v as (typeof UNIDADES)[number]) : "g");

/** Garante o formato atual, preenchendo o que faltar. Futuras versões migram aqui. */
export function normalizar(raw: unknown): Dados | null {
  if (!raw || typeof raw !== "object") return null;
  const r = raw as Record<string, unknown>;
  if (typeof r.versao === "number" && r.versao > VERSAO_DADOS) return null; // backup de versão mais nova

  const p = (r.perfil ?? {}) as Record<string, unknown>;
  const f = (p.fixos ?? {}) as Record<string, unknown>;
  const perfil: Perfil = {
    nome: str(p.nome),
    proLabore: num(p.proLabore),
    horasMes: num(p.horasMes),
    fixos: {
      gas: num(f.gas),
      energia: num(f.energia),
      internet: num(f.internet),
      mei: num(f.mei),
      aluguel: num(f.aluguel),
      outros: num(f.outros),
    },
    unidadesMes: num(p.unidadesMes),
    taxaCartao: num(p.taxaCartao),
    taxaApp: num(p.taxaApp),
    margem: "margem" in p ? num(p.margem) : PERFIL_VAZIO.margem,
    arredondar: p.arredondar === "cima50" ? "cima50" : "centavos",
  };

  return {
    versao: VERSAO_DADOS,
    onboardingFeito: r.onboardingFeito === true,
    perfil,
    ingredientes: arr(r.ingredientes).map((i) => ({
      id: str(i.id) || novoId(),
      nome: str(i.nome, "Ingrediente"),
      preco: num(i.preco),
      qtdEmbalagem: num(i.qtdEmbalagem),
      unidade: unid(i.unidade),
      ...(i.exemplo === true ? { exemplo: true } : {}),
    })),
    embalagens: arr(r.embalagens).map((e) => ({
      id: str(e.id) || novoId(),
      nome: str(e.nome, "Embalagem"),
      preco: num(e.preco),
      qtdPacote: num(e.qtdPacote),
      ...(e.exemplo === true ? { exemplo: true } : {}),
    })),
    receitas: arr(r.receitas).map((x) => ({
      id: str(x.id) || novoId(),
      nome: str(x.nome, "Receita"),
      rendimento: num(x.rendimento),
      ...(typeof x.foto === "string" && x.foto.startsWith("data:image/") ? { foto: x.foto } : {}),
      itens: arr(x.itens).map((it) => ({ ingredienteId: str(it.ingredienteId), qtd: num(it.qtd), unidade: unid(it.unidade) })),
      embalagens: arr(x.embalagens).map((e) => ({ embalagemId: str(e.embalagemId), qtd: num(e.qtd) })),
      tempoMin: num(x.tempoMin),
      precoAtual: num(x.precoAtual),
      vendasMes: num(x.vendasMes),
      ...(x.exemplo === true ? { exemplo: true } : {}),
      atualizadaEm: num(x.atualizadaEm) ?? Date.now(),
    })),
  };
}
