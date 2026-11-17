"use client";

import { analisarReceita } from "@/lib/dados/analise";
import { moeda } from "@/lib/formato";
import { copiar, linkWhatsApp, textoCardapio } from "@/lib/whatsapp";
import { CardCatalogoPlace } from "./CardCatalogoPlace";
import { useApp } from "./estado";
import { Botao, Chip, Topo } from "./ui";

export function TelaPrecos() {
  const { dados, ir, avisar } = useApp();
  const linhas = dados.receitas.map((r) => ({ r, a: analisarReceita(dados, r) }));
  const perdendo = linhas.filter((l) => l.a.diagBalcao?.status === "perdendo").length;
  const cardapio = textoCardapio(
    dados.perfil.nome,
    linhas.filter((l) => !l.r.exemplo).map((l) => ({ nome: l.r.nome, preco: l.a.balcao })),
  );
  const temReais = linhas.some((l) => !l.r.exemplo);

  return (
    <>
      <Topo titulo={dados.perfil.nome || "Meus preços"} />
      <div className="mx-auto grid max-w-[560px] gap-4 px-4 pt-5 pb-32">
        <div>
          <h1 className="text-[34px]">Meus preços</h1>
          {perdendo > 0 ? (
            <p className="mt-1 text-lg font-bold text-morango-escuro">
              {perdendo === 1 ? "1 receita está" : `${perdendo} receitas estão`} dando prejuízo.
            </p>
          ) : (
            <p className="mt-1 text-choco-2">Toque numa receita para ver o preço certo.</p>
          )}
        </div>

        <Botao onClick={() => ir("receita/nova")} className="w-full">
          + Nova receita
        </Botao>

        <ul className="grid gap-3">
          {linhas.map(({ r, a }) => {
            const s = a.diagBalcao?.status;
            return (
              <li key={r.id}>
                <button
                  type="button"
                  onClick={() => ir(`receita/${r.id}`)}
                  className="flex w-full cursor-pointer items-center gap-3 rounded-[20px] bg-white p-3 text-left active:bg-rosa/30"
                >
                  {r.foto ? (
                    // eslint-disable-next-line @next/next/no-img-element -- foto local em dataURL
                    <img src={r.foto} alt="" className="size-16 flex-none rounded-2xl object-cover" />
                  ) : (
                    <span aria-hidden="true" className="grid size-16 flex-none place-items-center rounded-2xl bg-rosa text-3xl">
                      🧁
                    </span>
                  )}
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center gap-2">
                      <span className="truncate font-bold">{r.nome}</span>
                      {r.exemplo && <Chip cor="rosa">Exemplo</Chip>}
                    </span>
                    <span className="block text-sm text-choco-2">
                      Custo {moeda(a.custo.porUnidade.total)} · Preço certo{" "}
                      <strong className="text-choco">{a.balcao === null ? "—" : moeda(a.balcao)}</strong>
                    </span>
                    <span className="mt-1 block">
                      {s === "perdendo" ? (
                        <Chip cor="vermelho">Perdendo {moeda(a.diagBalcao!.valor)}</Chip>
                      ) : s === "abaixo" ? (
                        <Chip>Abaixo do ideal</Chip>
                      ) : s === "saudavel" ? (
                        <Chip cor="verde">OK ✓</Chip>
                      ) : (
                        <Chip cor="cinza">Sem preço atual</Chip>
                      )}
                    </span>
                  </span>
                  <span aria-hidden="true" className="text-2xl text-choco-2">
                    ›
                  </span>
                </button>
              </li>
            );
          })}
        </ul>

        {linhas.length === 0 && (
          <div className="rounded-[22px] bg-white p-6 text-center">
            <p className="text-4xl" aria-hidden="true">
              🎂
            </p>
            <p className="mt-2 text-lg font-bold">Nenhuma receita ainda</p>
            <p className="text-choco-2">Comece pela que você mais vende.</p>
          </div>
        )}

        {temReais && (
          <div className="grid gap-2 rounded-[22px] bg-manteiga p-4">
            <p className="font-bold">📋 Cardápio de preços para o WhatsApp</p>
            <p className="text-sm">Com os preços certos de balcão de todas as suas receitas.</p>
            <Botao
              variante="escuro"
              onClick={async () => avisar((await copiar(cardapio)) ? "Cardápio copiado! 💬" : "Não consegui copiar.")}
            >
              Gerar cardápio de preços
            </Botao>
            <a href={linkWhatsApp(cardapio)} target="_blank" rel="noopener" className="min-h-11 py-2 text-center font-bold underline">
              ou abrir direto no WhatsApp
            </a>
          </div>
        )}

        <CardCatalogoPlace />
      </div>
    </>
  );
}
