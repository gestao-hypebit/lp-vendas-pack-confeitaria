"use client";

import dynamic from "next/dynamic";

/** O app vive no navegador (localStorage), então não é renderizado no servidor. */
const AppShell = dynamic(() => import("./AppShell"), {
  ssr: false,
  loading: () => (
    <main className="grid min-h-dvh place-items-center bg-rosa">
      <p className="text-lg font-bold">Abrindo sua calculadora…</p>
    </main>
  ),
});

export function AppCliente() {
  return <AppShell />;
}
