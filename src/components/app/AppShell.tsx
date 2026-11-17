"use client";

import type { ReactNode } from "react";
import { AcessoGate } from "./AcessoGate";
import { EstadoProvider, useApp } from "./estado";
import { Onboarding } from "./Onboarding";
import { TelaAjustes } from "./TelaAjustes";
import { TelaIngredientes } from "./TelaIngredientes";
import { TelaPrecos } from "./TelaPrecos";
import { TelaReceitaEditar } from "./TelaReceitaEditar";
import { TelaResultado } from "./TelaResultado";

export default function AppShell() {
  return (
    <AcessoGate>
      <EstadoProvider>
        <Roteador />
      </EstadoProvider>
    </AcessoGate>
  );
}

function Roteador() {
  const { dados, rota } = useApp();
  if (!dados.onboardingFeito) return <Onboarding />;

  const [a, b, c] = rota;
  let tela: ReactNode;
  let aba: Aba | null = "precos";
  if (a === "receita" && b === "nova") {
    tela = <TelaReceitaEditar />;
    aba = null;
  } else if (a === "receita" && b && c === "editar") {
    tela = <TelaReceitaEditar key={b} id={b} />;
    aba = null;
  } else if (a === "receita" && b) tela = <TelaResultado id={b} />;
  else if (a === "ingredientes") {
    tela = <TelaIngredientes />;
    aba = "ingredientes";
  } else if (a === "ajustes") {
    tela = <TelaAjustes />;
    aba = "ajustes";
  } else tela = <TelaPrecos />;

  return (
    <div className="min-h-dvh bg-creme">
      {tela}
      {aba && <BarraNav ativa={aba} />}
    </div>
  );
}

type Aba = "precos" | "ingredientes" | "ajustes";

const ABAS: { id: Aba; t: string; rota: string; icone: ReactNode }[] = [
  {
    id: "precos",
    t: "Meus preços",
    rota: "",
    icone: <path d="M4 7h16M4 12h16M4 17h10" />,
  },
  {
    id: "ingredientes",
    t: "Ingredientes",
    rota: "ingredientes",
    icone: <path d="M6 10h12l-1 10H7L6 10zM9 10V7a3 3 0 016 0v3" />,
  },
  {
    id: "ajustes",
    t: "Ajustes",
    rota: "ajustes",
    icone: (
      <>
        <circle cx="12" cy="12" r="3" />
        <path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M5.6 18.4l2.1-2.1M16.3 7.7l2.1-2.1" />
      </>
    ),
  },
];

function BarraNav({ ativa }: { ativa: Aba }) {
  const { ir } = useApp();
  return (
    <nav
      aria-label="Menu"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-choco/10 bg-white pb-[env(safe-area-inset-bottom)] print:hidden"
    >
      <ul className="mx-auto grid max-w-[560px] grid-cols-3">
        {ABAS.map((x) => (
          <li key={x.id}>
            <button
              type="button"
              aria-current={ativa === x.id ? "page" : undefined}
              onClick={() => ir(x.rota)}
              className="flex min-h-[68px] w-full cursor-pointer flex-col items-center justify-center gap-1 text-[13px] font-bold text-choco-2 aria-[current=page]:text-morango"
            >
              <svg
                viewBox="0 0 24 24"
                className="size-7"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                {x.icone}
              </svg>
              {x.t}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}
