"use client";

import Link from "next/link";
import { useEffect, useState, type ReactNode } from "react";

/**
 * Trava simples do MVP: o comprador recebe /app?acesso=CHAVE por e-mail.
 * A chave é conferida no servidor (/api/acesso) e o aparelho fica liberado.
 *
 * Futuro: trocar este componente por login (Supabase) liberado pelo webhook
 * de compra aprovada da Kiwify. O resto do app não depende de como a pessoa entrou.
 */
const CHAVE_LOCAL = "calc-confeitaria:acesso";

function liberadoNoAparelho() {
  try {
    return localStorage.getItem(CHAVE_LOCAL) === "1";
  } catch {
    return false;
  }
}

type Situacao = "verificando" | "ok" | "bloqueado" | "erro";

export function AcessoGate({ children }: { children: ReactNode }) {
  const [situacao, setSituacao] = useState<Situacao>(() => (liberadoNoAparelho() ? "ok" : "verificando"));

  useEffect(() => {
    if (situacao !== "verificando") return;
    const url = new URL(window.location.href);
    const chave = url.searchParams.get("acesso") ?? "";
    fetch("/api/acesso", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ chave }) })
      .then((r) => r.json() as Promise<{ ok: boolean; aberto?: boolean }>)
      .then((r) => {
        if (!r.ok) return setSituacao("bloqueado");
        if (!r.aberto) {
          try {
            localStorage.setItem(CHAVE_LOCAL, "1");
          } catch {
            /* modo anônimo: segue liberado só nesta visita */
          }
        }
        if (chave) {
          url.searchParams.delete("acesso");
          history.replaceState(null, "", url.pathname + url.search + url.hash);
        }
        setSituacao("ok");
      })
      .catch(() => setSituacao("erro"));
  }, [situacao]);

  if (situacao === "ok") return <>{children}</>;

  return (
    <main className="grid min-h-dvh place-items-center bg-rosa px-6 text-center">
      <div className="max-w-[400px]">
        <p className="text-5xl" aria-hidden="true">
          🧁
        </p>
        {situacao === "verificando" && <p className="mt-4 text-lg font-bold">Abrindo sua calculadora…</p>}
        {situacao === "bloqueado" && (
          <>
            <h1 className="mt-4 text-[34px]">Acesse pelo link do seu e-mail</h1>
            <p className="mt-3 text-lg text-choco-2">
              Abra o e-mail de compra da Calculadora de Precificação e toque no link de acesso. Depois disso, este
              aparelho fica liberado.
            </p>
            <p className="mt-6 text-[15px] text-choco-2">
              Ainda não comprou?{" "}
              <Link href="/" className="font-bold text-morango underline">
                Conheça a calculadora
              </Link>
            </p>
          </>
        )}
        {situacao === "erro" && (
          <>
            <h1 className="mt-4 text-[34px]">Sem conexão</h1>
            <p className="mt-3 text-lg text-choco-2">Verifique sua internet e tente de novo.</p>
            <button
              type="button"
              onClick={() => setSituacao("verificando")}
              className="mt-6 min-h-14 cursor-pointer rounded-2xl bg-morango px-6 font-bold text-white"
            >
              Tentar de novo
            </button>
          </>
        )}
      </div>
    </main>
  );
}
