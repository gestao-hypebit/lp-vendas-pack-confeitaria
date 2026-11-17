/**
 * Peças visuais do resultado, sem estado nem hooks: usadas no app e também
 * como "print" na landing (renderizadas no servidor, sem imagem pesada).
 */
import type { ReactNode } from "react";
import type { Custos, Diagnostico } from "@/lib/calc";
import { moeda } from "@/lib/formato";

export const CORES_CUSTO = [
  { k: "ingredientes", t: "Ingredientes", cor: "var(--color-morango)" },
  { k: "embalagem", t: "Embalagem", cor: "var(--color-manteiga)" },
  { k: "maoDeObra", t: "Sua mão de obra", cor: "var(--color-choco)" },
  { k: "fixo", t: "Gás, luz e fixos", cor: "#e9a0b1" },
] as const;

export function BarraCustos({ custos, compacto = false }: { custos: Custos; compacto?: boolean }) {
  const total = custos.total || 1;
  return (
    <div>
      <div
        className={`flex w-full overflow-hidden rounded-full bg-choco/10 ${compacto ? "h-4" : "h-6"}`}
        role="img"
        aria-label={`Composição do custo: ${CORES_CUSTO.map((c) => `${c.t} ${moeda(custos[c.k])}`).join(", ")}`}
      >
        {CORES_CUSTO.map((c) =>
          custos[c.k] > 0 ? (
            <span key={c.k} style={{ width: `${(custos[c.k] / total) * 100}%`, background: c.cor }} className="h-full" />
          ) : null,
        )}
      </div>
      <ul className={`mt-3 grid gap-1.5 ${compacto ? "text-[13px]" : "text-[15px]"}`}>
        {CORES_CUSTO.map((c) => (
          <li key={c.k} className="flex items-center gap-2.5">
            <span aria-hidden="true" className="size-3.5 flex-none rounded-full" style={{ background: c.cor }} />
            <span className="flex-1">{c.t}</span>
            <span className="font-bold tabular-nums">{moeda(custos[c.k])}</span>
            <span className="w-11 text-right text-choco-2 tabular-nums">
              {Math.round((custos[c.k] / total) * 100)}%
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

const ESTILO = {
  perdendo: "bg-morango text-white",
  abaixo: "bg-manteiga text-choco",
  saudavel: "bg-[#d6f2dc] text-[#14532a]",
};

export function TituloDiagnostico({ d, canal }: { d: Diagnostico; canal?: string }) {
  const sufixo = canal ? ` ${canal}` : "";
  if (d.status === "perdendo")
    return (
      <>
        Você está <strong className="font-normal underline decoration-4 underline-offset-4">PERDENDO</strong>{" "}
        {moeda(d.valor)} por unidade{sufixo}
      </>
    );
  if (d.status === "abaixo")
    return (
      <>
        Você está ganhando {moeda(d.valor)} a menos do que deveria por unidade{sufixo}
      </>
    );
  return <>Seu preço está saudável ✅</>;
}

export function CardDiagnostico({
  d,
  canal,
  projecao,
  precoAtual,
  compacto = false,
}: {
  d: Diagnostico;
  canal?: string;
  precoAtual?: number;
  /** linha de projeção mensal (no app vem com o campo editável) */
  projecao?: ReactNode;
  compacto?: boolean;
}) {
  return (
    <div className={`rounded-[22px] ${compacto ? "p-4" : "p-5"} ${ESTILO[d.status]}`} role="status">
      {precoAtual !== undefined && (
        <p className="text-sm font-bold uppercase tracking-wide opacity-80">Vendendo a {moeda(precoAtual)}</p>
      )}
      <p className={`mt-1 font-display leading-[1.1] ${compacto ? "text-[22px]" : "text-[28px]"}`}>
        <TituloDiagnostico d={d} canal={canal} />
      </p>
      {d.status === "saudavel" && (
        <p className="mt-1 font-bold">Sobram {moeda(d.valor)} por unidade, já pagando a sua hora.</p>
      )}
      {projecao && <div className="mt-3 border-t border-current/20 pt-3">{projecao}</div>}
    </div>
  );
}

export function CardPreco({
  titulo,
  icone,
  preco,
  lucro,
  taxa,
  destaque = false,
  compacto = false,
}: {
  compacto?: boolean;
  titulo: string;
  icone: string;
  preco: number | null;
  lucro: number | null;
  taxa?: number | null;
  destaque?: boolean;
}) {
  return (
    <div className={`rounded-[22px] ${compacto ? "p-3" : "p-4"} ${destaque ? "bg-choco text-creme" : "bg-white"}`}>
      <p className="text-sm font-bold">
        <span aria-hidden="true">{icone} </span>
        {titulo}
      </p>
      {preco === null ? (
        <p className="mt-1 text-sm">Margem + taxa passam de 100%. Ajuste nos Ajustes.</p>
      ) : (
        <>
          <p className={`font-display leading-tight whitespace-nowrap ${compacto ? "text-[24px]" : "text-[28px]"} ${destaque ? "text-manteiga" : "text-morango"}`}>
            {moeda(preco)}
          </p>
          <p className={`text-[13px] ${destaque ? "text-creme/80" : "text-choco-2"}`}>
            Lucro: <strong>{moeda(lucro)}</strong>
            {taxa ? ` · taxa ${taxa.toLocaleString("pt-BR")}%` : ""}
          </p>
        </>
      )}
    </div>
  );
}
