"use client";

import { resumoPerfil } from "@/lib/dados/analise";
import type { Fixos, Perfil } from "@/lib/dados/tipos";
import { moeda } from "@/lib/formato";
import { CampoNumero } from "./ui";

type P = { p: Perfil; set: (p: Perfil) => void };

function Resultado({ children }: { children: React.ReactNode }) {
  return <div className="rounded-2xl bg-choco px-5 py-4 text-creme">{children}</div>;
}

export function CamposHora({ p, set }: P) {
  const { valorHora } = resumoPerfil(p);
  return (
    <div className="grid gap-5">
      <CampoNumero
        label="Quanto você quer ganhar por mês?"
        ajuda="O seu salário com a confeitaria (pró-labore)."
        prefixo="R$"
        placeholder="3.000"
        valor={p.proLabore}
        onChange={(v) => set({ ...p, proLabore: v })}
      />
      <CampoNumero
        label="Quantas horas por mês você trabalha na confeitaria?"
        ajuda="Ex.: 6 horas por dia × 22 dias = 132 horas."
        sufixo="h"
        placeholder="132"
        valor={p.horasMes}
        onChange={(v) => set({ ...p, horasMes: v })}
      />
      <Resultado>
        <p className="text-sm font-bold uppercase tracking-wide text-manteiga">Sua hora vale</p>
        <p className="font-display text-[34px] leading-tight">{moeda(valorHora)}</p>
        <p className="text-sm text-creme/80">Esse valor entra no custo de cada receita, pelo tempo de preparo.</p>
      </Resultado>
    </div>
  );
}

const FIXOS: [keyof Fixos, string][] = [
  ["gas", "Gás"],
  ["energia", "Energia elétrica"],
  ["internet", "Internet e celular"],
  ["mei", "MEI / DAS"],
  ["aluguel", "Aluguel"],
  ["outros", "Outros"],
];

export function CamposFixos({ p, set }: P) {
  const { totalFixos, fixoPorUnidade } = resumoPerfil(p);
  return (
    <div className="grid gap-5">
      <div className="grid grid-cols-2 gap-3">
        {FIXOS.map(([k, t]) => (
          <CampoNumero
            key={k}
            label={t}
            prefixo="R$"
            valor={p.fixos[k]}
            onChange={(v) => set({ ...p, fixos: { ...p.fixos, [k]: v } })}
          />
        ))}
      </div>
      <p className="text-sm text-choco-2">
        Se divide a conta de luz ou gás com a casa, coloque só a parte da confeitaria (um chute honesto já ajuda).
      </p>
      <CampoNumero
        label="Quantas unidades você produz por mês, em média?"
        ajuda="Somando todos os doces. Ex.: 300 brigadeiros + 50 bolos de pote = 350."
        sufixo="un"
        valor={p.unidadesMes}
        onChange={(v) => set({ ...p, unidadesMes: v })}
      />
      <Resultado>
        <p className="text-sm text-creme/80">Total de custos fixos: {moeda(totalFixos)} por mês</p>
        <p className="mt-1 text-sm font-bold uppercase tracking-wide text-manteiga">Cada unidade carrega</p>
        <p className="font-display text-[34px] leading-tight">{moeda(fixoPorUnidade)}</p>
      </Resultado>
    </div>
  );
}

export function CamposTaxas({ p, set }: P) {
  return (
    <div className="grid gap-6">
      <CampoNumero
        label="Taxa da maquininha / cartão"
        ajuda="Veja no app da sua maquininha. O crédito costuma ficar entre 3% e 5%. Se só recebe Pix, deixe vazio."
        sufixo="%"
        valor={p.taxaCartao}
        onChange={(v) => set({ ...p, taxaCartao: v })}
      />
      <CampoNumero
        label="Taxa do app de delivery (iFood etc.)"
        ajuda="Veja no seu contrato. Costuma ficar entre 12% e 30% do pedido. Se não vende por app, deixe vazio."
        sufixo="%"
        valor={p.taxaApp}
        onChange={(v) => set({ ...p, taxaApp: v })}
      />
    </div>
  );
}

export function CamposMargem({ p, set }: P) {
  return (
    <div className="grid gap-4">
      <CampoNumero
        label="Margem de lucro desejada"
        ajuda="É o que sobra para a confeitaria crescer, depois de pagar tudo, inclusive o seu salário. Sugestão: 30%."
        sufixo="%"
        valor={p.margem}
        onChange={(v) => set({ ...p, margem: v })}
      />
      <div className="flex flex-wrap gap-2" role="group" aria-label="Sugestões de margem">
        {[20, 30, 40].map((m) => (
          <button
            key={m}
            type="button"
            aria-pressed={p.margem === m}
            onClick={() => set({ ...p, margem: m })}
            className="min-h-12 cursor-pointer rounded-full border-2 border-choco/15 bg-white px-5 font-bold aria-pressed:border-choco aria-pressed:bg-choco aria-pressed:text-creme"
          >
            {m}%{m === 30 ? " (sugerido)" : ""}
          </button>
        ))}
      </div>
    </div>
  );
}

export function CampoArredondar({ p, set }: P) {
  const ligado = p.arredondar === "cima50";
  return (
    <label className="flex min-h-14 cursor-pointer items-center gap-4 rounded-2xl bg-white px-4 py-3">
      <span className="flex-1">
        <span className="block font-bold">Arredondar preço para cima</span>
        <span className="block text-sm text-choco-2">Ex.: R$ 4,37 vira R$ 4,50</span>
      </span>
      <input
        type="checkbox"
        role="switch"
        checked={ligado}
        onChange={(e) => set({ ...p, arredondar: e.target.checked ? "cima50" : "centavos" })}
        className="peer sr-only"
      />
      <span
        aria-hidden="true"
        className="relative h-8 w-14 flex-none rounded-full bg-choco/20 transition-colors peer-checked:bg-morango peer-focus-visible:outline-3 peer-focus-visible:outline-choco after:absolute after:top-1 after:left-1 after:size-6 after:rounded-full after:bg-white after:transition-transform peer-checked:after:translate-x-6"
      />
    </label>
  );
}
