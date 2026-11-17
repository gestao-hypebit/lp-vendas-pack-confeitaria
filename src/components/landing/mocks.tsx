/**
 * "Prints" do app desenhados com os componentes reais (sem imagem):
 * nítidos em qualquer tela, zero KB de imagem e bons para o LCP.
 */
import type { ReactNode } from "react";
import { BarraCustos, CardDiagnostico, CardPreco } from "@/components/app/resultado-ui";
import { EX, EX_CUSTOS, EX_DIAG, EX_PRECOS } from "@/lib/exemplo-landing";
import { moeda } from "@/lib/formato";

export function Celular({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={`relative mx-auto w-full max-w-[330px] rounded-[44px] border-[10px] border-choco bg-creme shadow-[0_30px_60px_rgba(59,31,23,.3)] ${className}`}
    >
      <span aria-hidden="true" className="absolute top-2 left-1/2 z-10 h-5 w-24 -translate-x-1/2 rounded-full bg-choco" />
      <div className="overflow-hidden rounded-[34px]">{children}</div>
    </div>
  );
}

function BarraApp({ titulo }: { titulo: string }) {
  return (
    <div className="flex h-14 items-end bg-choco px-4 pb-2.5 text-[15px] font-bold text-creme">
      <span aria-hidden="true" className="mr-2 text-lg">
        ‹
      </span>
      {titulo}
    </div>
  );
}

/** Tela de resultado: "Você está perdendo R$ 3,20 por unidade". */
export function MockResultado() {
  return (
    <Celular>
      <BarraApp titulo={EX.nome} />
      <div className="grid gap-2.5 p-3 text-left">
        <CardDiagnostico
          compacto
          d={EX_DIAG}
          canal="no iFood"
          precoAtual={EX.precoAtual}
          projecao={
            <p className="text-[14px] font-bold">
              Vendendo {EX.vendasMes} por mês, são{" "}
              <span className="font-display text-[19px] font-normal">{moeda((Math.round(EX_DIAG.valor * 100) / 100) * EX.vendasMes)}</span> por mês
              indo embora.
            </p>
          }
        />
        <div className="grid grid-cols-2 gap-2">
          <CardPreco titulo="Balcão" icone="🏠" preco={EX_PRECOS.balcao} lucro={EX_PRECOS.lucroBalcao} destaque compacto />
          <CardPreco titulo="App delivery" icone="🛵" preco={EX_PRECOS.app} lucro={EX_PRECOS.lucroApp} compacto />
        </div>
        <div className="rounded-[18px] bg-white p-3">
          <p className="mb-2 flex justify-between text-[12px] font-bold uppercase tracking-wide text-choco-2">
            Custo real por unidade <span className="text-choco">{moeda(EX_CUSTOS.total)}</span>
          </p>
          <BarraCustos custos={EX_CUSTOS} compacto />
        </div>
      </div>
    </Celular>
  );
}

/** Mini print: lista de ingredientes com custo por grama. */
export function MockIngredientes() {
  const itens = [
    ["Leite condensado", "R$ 7,90 · 395 g", "R$ 0,0200/g", false],
    ["Leite em pó", "R$ 21,90 · 400 g", "R$ 0,0548/g", false],
    ["Creme de leite", "R$ 3,90 · 200 g", "R$ 0,0195/g", false],
    ["Morango", "Toque para colocar o preço", "", true],
  ] as const;
  return (
    <ul className="grid gap-1.5">
      {itens.map(([n, d, c, falta]) => (
        <li key={n} className="flex items-center gap-2 rounded-xl bg-white px-3 py-2 text-left">
          <span className="min-w-0 flex-1">
            <span className="block truncate text-[14px] font-bold">{n}</span>
            <span className="block text-[12px] text-choco-2">
              {d}
              {c && (
                <>
                  {" "}
                  → <strong>{c}</strong>
                </>
              )}
            </span>
          </span>
          {falta && <span className="rounded-full bg-manteiga px-2 py-0.5 text-[10px] font-bold uppercase">Falta o preço</span>}
        </li>
      ))}
    </ul>
  );
}

/** Mini print: mensagem de cardápio no WhatsApp. */
export function MockWhatsApp() {
  return (
    <div className="rounded-xl bg-[#e5ddd5] p-3 text-left">
      <div className="ml-auto max-w-[92%] rounded-xl rounded-tr-none bg-[#dcf8c6] px-3 py-2 text-[13px] leading-snug whitespace-pre-line text-[#111]">
        {`✨ *Cardápio – Doces da Ana* ✨

🍫 Brigadeiro gourmet: *R$ 3,50*
🧁 Bolo de pote de ninho: *R$ 16,00*
🍰 Fatia de bolo: *R$ 12,50*

📲 Encomendas pelo WhatsApp`}
      </div>
    </div>
  );
}

/** Mini print: lista "Meus preços" com status. */
export function MockLista() {
  const itens = [
    ["Brigadeiro gourmet", "OK ✓", "bg-[#d6f2dc] text-[#1d6b34]"],
    ["Bolo de pote de ninho", "Perdendo R$ 3,20", "bg-morango text-white"],
    ["Brownie recheado", "Abaixo do ideal", "bg-manteiga text-choco"],
  ] as const;
  return (
    <ul className="grid gap-1.5">
      {itens.map(([n, s, c]) => (
        <li key={n} className="flex items-center gap-2 rounded-xl bg-white px-3 py-2.5 text-left">
          <span aria-hidden="true" className="grid size-9 place-items-center rounded-lg bg-rosa">
            🧁
          </span>
          <span className="flex-1 text-[14px] font-bold">{n}</span>
          <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${c}`}>{s}</span>
        </li>
      ))}
    </ul>
  );
}
