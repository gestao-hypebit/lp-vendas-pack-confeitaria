"use client";

import { useId, useState, type ButtonHTMLAttributes, type ReactNode } from "react";
import { lerNumero, numeroBR } from "@/lib/formato";

/* ---------------- Campos ---------------- */

const INPUT =
  "h-14 w-full min-w-0 rounded-2xl border-2 border-choco/15 bg-white px-4 text-lg font-medium text-choco outline-none placeholder:text-choco/35 focus:border-morango";

export function Rotulo({ htmlFor, children, ajuda }: { htmlFor: string; children: ReactNode; ajuda?: ReactNode }) {
  return (
    <div className="mb-1.5">
      <label htmlFor={htmlFor} className="block text-[15px] font-bold">
        {children}
      </label>
      {ajuda && <p className="text-sm text-choco-2">{ajuda}</p>}
    </div>
  );
}

/**
 * Campo de número que aceita vírgula ("4,50"). Vazio = null.
 * Guarda o texto digitado para não brigar com quem está no meio da digitação ("4,").
 */
export function CampoNumero({
  label,
  valor,
  onChange,
  prefixo,
  sufixo,
  ajuda,
  placeholder,
  className = "",
  autoFocus,
}: {
  label?: ReactNode;
  valor: number | null;
  onChange: (v: number | null) => void;
  prefixo?: string;
  sufixo?: string;
  ajuda?: ReactNode;
  placeholder?: string;
  className?: string;
  autoFocus?: boolean;
}) {
  const id = useId();
  const [txt, setTxt] = useState(numeroBR(valor, 4));
  const [anterior, setAnterior] = useState(valor);
  if (valor !== anterior) {
    setAnterior(valor);
    if (lerNumero(txt) !== valor) setTxt(numeroBR(valor, 4));
  }

  return (
    <div className={className}>
      {label && (
        <Rotulo htmlFor={id} ajuda={ajuda}>
          {label}
        </Rotulo>
      )}
      <div className="relative">
        {prefixo && (
          <span className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-lg font-bold text-choco-2">
            {prefixo}
          </span>
        )}
        <input
          id={id}
          inputMode="decimal"
          autoComplete="off"
          autoFocus={autoFocus}
          enterKeyHint="next"
          placeholder={placeholder}
          value={txt}
          onChange={(e) => {
            setTxt(e.target.value);
            const v = lerNumero(e.target.value);
            setAnterior(v);
            onChange(v);
          }}
          className={`${INPUT} ${prefixo ? "pl-12" : ""} ${sufixo ? "pr-14" : ""}`}
        />
        {sufixo && (
          <span className="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 text-lg font-bold text-choco-2">
            {sufixo}
          </span>
        )}
      </div>
    </div>
  );
}

export function CampoTexto({
  label,
  valor,
  onChange,
  placeholder,
  ajuda,
  autoFocus,
}: {
  label: ReactNode;
  valor: string;
  onChange: (v: string) => void;
  placeholder?: string;
  ajuda?: ReactNode;
  autoFocus?: boolean;
}) {
  const id = useId();
  return (
    <div>
      <Rotulo htmlFor={id} ajuda={ajuda}>
        {label}
      </Rotulo>
      <input
        id={id}
        value={valor}
        autoFocus={autoFocus}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className={INPUT}
      />
    </div>
  );
}

export function Seletor<T extends string>({
  valor,
  opcoes,
  onChange,
  rotulo,
}: {
  valor: T;
  opcoes: { v: T; t: string }[];
  onChange: (v: T) => void;
  rotulo: string;
}) {
  return (
    <select
      aria-label={rotulo}
      value={valor}
      onChange={(e) => onChange(e.target.value as T)}
      className="h-14 rounded-2xl border-2 border-choco/15 bg-white px-3 text-lg font-bold text-choco outline-none focus:border-morango"
    >
      {opcoes.map((o) => (
        <option key={o.v} value={o.v}>
          {o.t}
        </option>
      ))}
    </select>
  );
}

/* ---------------- Botões ---------------- */

const BOTAO = {
  primario:
    "bg-morango text-white shadow-[0_5px_0_var(--color-morango-escuro)] active:translate-y-1 active:shadow-[0_1px_0_var(--color-morango-escuro)]",
  escuro:
    "bg-choco text-creme shadow-[0_5px_0_var(--color-choco-escuro)] active:translate-y-1 active:shadow-[0_1px_0_var(--color-choco-escuro)]",
  claro: "bg-white text-choco border-2 border-choco/15 active:bg-creme",
  perigo: "bg-white text-morango-escuro border-2 border-morango/40 active:bg-rosa/40",
};

export function Botao({
  variante = "primario",
  className = "",
  children,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variante?: keyof typeof BOTAO }) {
  return (
    <button
      type="button"
      {...props}
      className={`inline-flex min-h-14 cursor-pointer items-center justify-center gap-2 rounded-2xl px-5 text-[17px] font-bold transition-transform disabled:cursor-not-allowed disabled:opacity-50 ${BOTAO[variante]} ${className}`}
    >
      {children}
    </button>
  );
}

/** Botão de ação perigosa: pede um segundo toque para confirmar (sem pop-up). */
export function BotaoConfirmar({
  children,
  confirmar,
  onConfirm,
  className = "",
}: {
  children: ReactNode;
  confirmar: string;
  onConfirm: () => void;
  className?: string;
}) {
  const [armado, setArmado] = useState(false);
  return (
    <Botao
      variante="perigo"
      className={className}
      onClick={() => (armado ? onConfirm() : setArmado(true))}
      onBlur={() => setArmado(false)}
    >
      {armado ? confirmar : children}
    </Botao>
  );
}

/* ---------------- Layout ---------------- */

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`rounded-[22px] bg-white p-5 shadow-[0_2px_0_rgba(59,31,23,.06)] ${className}`}>{children}</div>;
}

export function Chip({ children, cor = "manteiga" }: { children: ReactNode; cor?: "manteiga" | "rosa" | "verde" | "cinza" | "vermelho" }) {
  const c = {
    manteiga: "bg-manteiga text-choco",
    rosa: "bg-rosa text-choco",
    verde: "bg-[#d6f2dc] text-[#1d6b34]",
    cinza: "bg-choco/10 text-choco-2",
    vermelho: "bg-morango text-white",
  }[cor];
  return <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold uppercase tracking-wide ${c}`}>{children}</span>;
}

export function Topo({ titulo, voltar, acao }: { titulo: ReactNode; voltar?: () => void; acao?: ReactNode }) {
  return (
    <header className="sticky top-0 z-30 flex min-h-16 items-center gap-2 bg-choco px-3 text-creme print:hidden">
      {voltar ? (
        <button
          type="button"
          onClick={voltar}
          aria-label="Voltar"
          className="grid size-12 flex-none cursor-pointer place-items-center rounded-full active:bg-white/10"
        >
          <svg viewBox="0 0 24 24" className="size-7" aria-hidden="true">
            <path d="M15 5l-7 7 7 7" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      ) : (
        <span className="w-2" />
      )}
      <h1 className="min-w-0 flex-1 truncate font-sans text-lg font-bold tracking-normal">{titulo}</h1>
      {acao}
    </header>
  );
}

export function Aviso({ children, tom = "manteiga" }: { children: ReactNode; tom?: "manteiga" | "rosa" }) {
  return (
    <div className={`rounded-2xl px-4 py-3 text-[15px] ${tom === "manteiga" ? "bg-manteiga/60" : "bg-rosa/70"}`}>
      {children}
    </div>
  );
}
