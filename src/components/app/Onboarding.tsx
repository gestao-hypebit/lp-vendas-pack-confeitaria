"use client";

import { useState } from "react";
import type { Perfil } from "@/lib/dados/tipos";
import { useApp } from "./estado";
import { CamposFixos, CamposHora, CamposMargem, CamposTaxas } from "./perfil-campos";
import { Botao, CampoTexto } from "./ui";

const PASSOS = [
  { t: "Bem-vinda! 🧁", s: "Em 2 minutos você descobre o preço certo de cada doce. Vamos começar pelo nome." },
  { t: "Quanto vale a sua hora?", s: "Seu tempo também é custo. Quem não cobra a própria hora trabalha de graça." },
  { t: "Custos fixos do mês", s: "Gás, luz, internet… são pequenos por doce, mas fazem diferença. Se não souber agora, pode pular." },
  { t: "Taxas que você paga", s: "A maquininha e o app de delivery ficam com uma parte de cada venda." },
  { t: "Quanto quer de lucro?", s: "Por último, a margem: o que sobra depois de pagar tudo." },
];

export function Onboarding() {
  const { dados, atualizar, ir } = useApp();
  const [i, setI] = useState(0);
  const [p, setP] = useState<Perfil>(dados.perfil);
  const ultimo = i === PASSOS.length - 1;

  const concluir = () => {
    atualizar((d) => ({ ...d, perfil: p, onboardingFeito: true }));
    const demo = dados.receitas.find((r) => r.exemplo);
    ir(demo ? `receita/${demo.id}` : "", true);
  };

  return (
    <main className="mx-auto flex min-h-dvh max-w-[520px] flex-col bg-creme px-5 pt-6 pb-8">
      <div className="flex items-center gap-3">
        {i > 0 && (
          <button
            type="button"
            onClick={() => setI(i - 1)}
            className="min-h-11 cursor-pointer rounded-full px-2 font-bold text-choco-2"
          >
            ← Voltar
          </button>
        )}
        <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-choco/10" aria-hidden="true">
          <div className="h-full rounded-full bg-morango transition-all" style={{ width: `${((i + 1) / PASSOS.length) * 100}%` }} />
        </div>
        <span className="text-sm font-bold text-choco-2">
          {i + 1}/{PASSOS.length}
        </span>
      </div>

      <h1 className="mt-8 text-[38px]">{PASSOS[i].t}</h1>
      <p className="mt-2 mb-7 text-lg text-choco-2">{PASSOS[i].s}</p>

      <div className="flex-1">
        {i === 0 && (
          <CampoTexto
            label="Nome da sua confeitaria"
            placeholder="Ex.: Doces da Ana"
            valor={p.nome}
            onChange={(nome) => setP({ ...p, nome })}
          />
        )}
        {i === 1 && <CamposHora p={p} set={setP} />}
        {i === 2 && <CamposFixos p={p} set={setP} />}
        {i === 3 && <CamposTaxas p={p} set={setP} />}
        {i === 4 && <CamposMargem p={p} set={setP} />}
      </div>

      <div className="mt-8 grid gap-3">
        <Botao onClick={() => (ultimo ? concluir() : setI(i + 1))}>{ultimo ? "Ver meu primeiro resultado" : "Continuar"}</Botao>
        {(i === 2 || i === 3) && (
          <Botao variante="claro" onClick={() => setI(i + 1)}>
            Pular por enquanto
          </Botao>
        )}
        <p className="text-center text-sm text-choco-2">Dá para mudar tudo depois em Ajustes.</p>
      </div>
    </main>
  );
}
