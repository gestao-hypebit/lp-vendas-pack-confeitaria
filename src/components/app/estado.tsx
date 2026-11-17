"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { repositorioLocal, type Repositorio } from "@/lib/dados/repositorio";
import { dadosIniciais } from "@/lib/dados/seed";
import type { Dados } from "@/lib/dados/tipos";

interface Estado {
  dados: Dados;
  atualizar: (fn: (d: Dados) => Dados) => void;
  substituir: (d: Dados) => void;
  /** navegação por hash: ir("receita/123") → #/receita/123 */
  rota: string[];
  ir: (caminho: string, trocar?: boolean) => void;
  voltar: (padrao?: string) => void;
  avisar: (msg: string) => void;
}

const Ctx = createContext<Estado | null>(null);

export function useApp() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useApp fora do <EstadoProvider>");
  return c;
}

function lerRota(): string[] {
  return window.location.hash.replace(/^#\/?/, "").split("/").filter(Boolean);
}

/** Só roda no navegador (o app é carregado com ssr: false). */
export function EstadoProvider({ children, repo = repositorioLocal }: { children: ReactNode; repo?: Repositorio }) {
  const [dados, setDados] = useState<Dados>(() => repo.carregar() ?? dadosIniciais());
  const [rota, setRota] = useState<string[]>(lerRota);
  const [toast, setToast] = useState<string | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const navegou = useRef(false);

  const avisar = useCallback((msg: string) => {
    setToast(msg);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setToast(null), 2600);
  }, []);

  useEffect(() => {
    if (!repo.salvar(dados)) {
      const t = setTimeout(() => avisar("Não consegui salvar: a memória do navegador está cheia. Tente remover fotos."));
      return () => clearTimeout(t);
    }
  }, [dados, repo, avisar]);

  useEffect(() => {
    const on = () => {
      setRota(lerRota());
      window.scrollTo(0, 0);
    };
    window.addEventListener("hashchange", on);
    return () => window.removeEventListener("hashchange", on);
  }, []);

  const ir = useCallback((caminho: string, trocar = false) => {
    navegou.current = true;
    const h = `#/${caminho}`;
    if (trocar) {
      history.replaceState(null, "", h);
      setRota(lerRota());
      window.scrollTo(0, 0);
    } else window.location.hash = h;
  }, []);

  const voltar = useCallback(
    (padrao = "") => {
      // Se chegou direto pelo link, não há para onde voltar dentro do app.
      if (navegou.current && history.length > 1) history.back();
      else ir(padrao, true);
    },
    [ir],
  );

  const atualizar = useCallback((fn: (d: Dados) => Dados) => setDados((d) => fn(d)), []);

  return (
    <Ctx.Provider value={{ dados, atualizar, substituir: setDados, rota, ir, voltar, avisar }}>
      {children}
      <div
        aria-live="polite"
        className={`pointer-events-none fixed inset-x-4 bottom-24 z-50 mx-auto max-w-[440px] rounded-2xl bg-choco px-5 py-4 text-center font-bold text-creme shadow-xl transition-all duration-200 print:hidden ${toast ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"}`}
      >
        {toast}
      </div>
    </Ctx.Provider>
  );
}
