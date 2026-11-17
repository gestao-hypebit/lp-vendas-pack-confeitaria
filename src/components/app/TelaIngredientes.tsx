"use client";

import { useState } from "react";
import { custoEmbalagemUnit, custoPorBase, unidadeBase, type Unidade } from "@/lib/calc";
import { novoId } from "@/lib/dados/seed";
import type { Embalagem, Ingrediente } from "@/lib/dados/tipos";
import { moeda, moedaFina, numeroBR } from "@/lib/formato";
import { useApp } from "./estado";
import { Botao, BotaoConfirmar, CampoNumero, CampoTexto, Chip, Seletor, Topo } from "./ui";

export const UNIDADES: { v: Unidade; t: string }[] = [
  { v: "g", t: "g" },
  { v: "kg", t: "kg" },
  { v: "ml", t: "ml" },
  { v: "L", t: "L" },
  { v: "un", t: "unid." },
];

const ROTULO_BASE = { g: "g", ml: "ml", un: "unid." };

const ordenar = <T extends { nome: string }>(l: T[]) => [...l].sort((a, b) => a.nome.localeCompare(b.nome, "pt-BR"));

export function TelaIngredientes() {
  const { dados, rota, ir } = useApp();
  const aba = rota[1] === "embalagens" ? "embalagens" : "ingredientes";
  const [busca, setBusca] = useState("");
  const [aberto, setAberto] = useState<string | null>(null);
  const [novo, setNovo] = useState<string | null>(null);

  const lista: (Ingrediente | Embalagem)[] = aba === "ingredientes" ? dados.ingredientes : dados.embalagens;
  const semPreco = lista.filter((x) => x.preco === null).length;
  const filtrada = ordenar(lista).filter((x) => x.nome.toLowerCase().includes(busca.trim().toLowerCase()));

  return (
    <>
      <Topo titulo="Ingredientes e embalagens" />
      <div className="mx-auto max-w-[560px] px-4 pt-4 pb-32">
        <div className="grid grid-cols-2 gap-1 rounded-2xl bg-choco/10 p-1" role="tablist">
          {(["ingredientes", "embalagens"] as const).map((a) => (
            <button
              key={a}
              type="button"
              role="tab"
              aria-selected={aba === a}
              onClick={() => {
                setAberto(null);
                ir(a === "embalagens" ? "ingredientes/embalagens" : "ingredientes", true);
              }}
              className="min-h-12 cursor-pointer rounded-xl font-bold capitalize text-choco-2 aria-selected:bg-white aria-selected:text-choco aria-selected:shadow"
            >
              {a}
            </button>
          ))}
        </div>

        {semPreco > 0 && (
          <p className="mt-4 rounded-2xl bg-manteiga/60 px-4 py-3 text-[15px]">
            <strong>{semPreco}</strong> {aba === "ingredientes" ? "ingredientes" : "embalagens"} sem preço. Preencha só os que
            você usa, o resto pode ficar vazio.
          </p>
        )}

        <div className="mt-4">
          <label htmlFor="busca" className="sr-only">
            Buscar
          </label>
          <input
            id="busca"
            type="search"
            placeholder="🔎 Buscar"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className="h-13 w-full rounded-2xl border-2 border-choco/15 bg-white px-4 text-lg outline-none focus:border-morango"
          />
        </div>

        <Botao
          variante="escuro"
          className="mt-4 w-full"
          onClick={() => {
            const id = novoId();
            setNovo(id);
            setAberto(id);
          }}
        >
          + Adicionar {aba === "ingredientes" ? "ingrediente" : "embalagem"}
        </Botao>

        <ul className="mt-4 grid gap-2.5">
          {novo && aberto === novo && (
            <li>
              {aba === "ingredientes" ? (
                <EditorIngrediente
                  inicial={{ id: novo, nome: busca, preco: null, qtdEmbalagem: null, unidade: "g" }}
                  novo
                  fechar={() => {
                    setNovo(null);
                    setAberto(null);
                  }}
                />
              ) : (
                <EditorEmbalagem
                  inicial={{ id: novo, nome: busca, preco: null, qtdPacote: null }}
                  novo
                  fechar={() => {
                    setNovo(null);
                    setAberto(null);
                  }}
                />
              )}
            </li>
          )}
          {filtrada.map((x) => (
            <li key={x.id}>
              {aberto === x.id ? (
                aba === "ingredientes" ? (
                  <EditorIngrediente inicial={x as Ingrediente} fechar={() => setAberto(null)} />
                ) : (
                  <EditorEmbalagem inicial={x as Embalagem} fechar={() => setAberto(null)} />
                )
              ) : (
                <button
                  type="button"
                  onClick={() => setAberto(x.id)}
                  className="flex min-h-16 w-full cursor-pointer items-center gap-3 rounded-2xl bg-white px-4 py-3 text-left active:bg-rosa/30"
                >
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-bold">{x.nome}</span>
                    <ResumoItem x={x} tipo={aba} />
                  </span>
                  {x.preco === null ? <Chip>Falta o preço</Chip> : x.exemplo ? <Chip cor="rosa">Exemplo</Chip> : null}
                  <span aria-hidden="true" className="text-xl text-choco-2">
                    ›
                  </span>
                </button>
              )}
            </li>
          ))}
          {filtrada.length === 0 && !novo && (
            <li className="py-8 text-center text-choco-2">Nada encontrado. Toque em “Adicionar”.</li>
          )}
        </ul>
      </div>
    </>
  );
}

function ResumoItem({ x, tipo }: { x: Ingrediente | Embalagem; tipo: "ingredientes" | "embalagens" }) {
  if (x.preco === null) return <span className="block text-sm text-choco-2">Toque para colocar o preço</span>;
  if (tipo === "embalagens") {
    const e = x as Embalagem;
    const cu = custoEmbalagemUnit(e);
    return (
      <span className="block text-sm text-choco-2">
        {moeda(e.preco)} · pacote com {numeroBR(e.qtdPacote || 1)} → <strong>{moedaFina(cu ?? 0)}</strong> cada
      </span>
    );
  }
  const i = x as Ingrediente;
  const cb = custoPorBase(i);
  return (
    <span className="block text-sm text-choco-2">
      {moeda(i.preco)} · {numeroBR(i.qtdEmbalagem)} {i.unidade}
      {cb !== null && (
        <>
          {" "}
          → <strong>{moedaFina(cb)}</strong> por {ROTULO_BASE[unidadeBase(i.unidade)]}
        </>
      )}
    </span>
  );
}

function EditorIngrediente({ inicial, fechar, novo = false }: { inicial: Ingrediente; fechar: () => void; novo?: boolean }) {
  const { atualizar, avisar } = useApp();
  const [i, setI] = useState(inicial);
  const cb = custoPorBase(i);

  const salvar = () => {
    if (!i.nome.trim()) return avisar("Dê um nome ao ingrediente.");
    const final: Ingrediente = { ...i, nome: i.nome.trim(), exemplo: i.preco === inicial.preco ? inicial.exemplo : undefined };
    atualizar((d) => ({
      ...d,
      ingredientes: novo ? [final, ...d.ingredientes] : d.ingredientes.map((x) => (x.id === final.id ? final : x)),
    }));
    avisar("Salvo ✓");
    fechar();
  };

  return (
    <div className="grid gap-4 rounded-2xl border-2 border-morango bg-white p-4">
      <CampoTexto label="Nome" valor={i.nome} autoFocus={novo} onChange={(nome) => setI({ ...i, nome })} />
      <CampoNumero
        label="Preço que você pagou"
        prefixo="R$"
        autoFocus={!novo}
        valor={i.preco}
        onChange={(preco) => setI({ ...i, preco })}
      />
      <div>
        <p className="mb-1.5 text-[15px] font-bold">Quanto vem na embalagem</p>
        <div className="flex gap-2">
          <CampoNumero valor={i.qtdEmbalagem} onChange={(q) => setI({ ...i, qtdEmbalagem: q })} className="flex-1" />
          <Seletor rotulo="Unidade" valor={i.unidade} opcoes={UNIDADES} onChange={(unidade) => setI({ ...i, unidade })} />
        </div>
      </div>
      {cb !== null && (
        <p className="rounded-xl bg-creme px-4 py-2.5 text-[15px]">
          Custa <strong>{moedaFina(cb)}</strong> por {ROTULO_BASE[unidadeBase(i.unidade)]}
          {unidadeBase(i.unidade) !== "un" && <> · {moeda(cb * 100)} a cada 100 {ROTULO_BASE[unidadeBase(i.unidade)]}</>}
        </p>
      )}
      <div className="flex gap-2">
        <Botao className="flex-1" onClick={salvar}>
          Salvar
        </Botao>
        <Botao variante="claro" onClick={fechar}>
          Cancelar
        </Botao>
      </div>
      {!novo && (
        <BotaoConfirmar
          confirmar="Toque de novo para apagar"
          onConfirm={() => {
            atualizar((d) => ({ ...d, ingredientes: d.ingredientes.filter((x) => x.id !== i.id) }));
            fechar();
          }}
        >
          Apagar ingrediente
        </BotaoConfirmar>
      )}
    </div>
  );
}

function EditorEmbalagem({ inicial, fechar, novo = false }: { inicial: Embalagem; fechar: () => void; novo?: boolean }) {
  const { atualizar, avisar } = useApp();
  const [e, setE] = useState(inicial);
  const cu = custoEmbalagemUnit(e);

  const salvar = () => {
    if (!e.nome.trim()) return avisar("Dê um nome à embalagem.");
    const final: Embalagem = { ...e, nome: e.nome.trim(), exemplo: e.preco === inicial.preco ? inicial.exemplo : undefined };
    atualizar((d) => ({
      ...d,
      embalagens: novo ? [final, ...d.embalagens] : d.embalagens.map((x) => (x.id === final.id ? final : x)),
    }));
    avisar("Salvo ✓");
    fechar();
  };

  return (
    <div className="grid gap-4 rounded-2xl border-2 border-morango bg-white p-4">
      <CampoTexto label="Nome" valor={e.nome} autoFocus={novo} onChange={(nome) => setE({ ...e, nome })} />
      <div className="grid grid-cols-2 gap-3">
        <CampoNumero label="Preço do pacote" prefixo="R$" autoFocus={!novo} valor={e.preco} onChange={(preco) => setE({ ...e, preco })} />
        <CampoNumero label="Unidades no pacote" placeholder="1" valor={e.qtdPacote} onChange={(q) => setE({ ...e, qtdPacote: q })} />
      </div>
      {cu !== null && (
        <p className="rounded-xl bg-creme px-4 py-2.5 text-[15px]">
          Cada uma custa <strong>{moedaFina(cu)}</strong>
        </p>
      )}
      <div className="flex gap-2">
        <Botao className="flex-1" onClick={salvar}>
          Salvar
        </Botao>
        <Botao variante="claro" onClick={fechar}>
          Cancelar
        </Botao>
      </div>
      {!novo && (
        <BotaoConfirmar
          confirmar="Toque de novo para apagar"
          onConfirm={() => {
            atualizar((d) => ({ ...d, embalagens: d.embalagens.filter((x) => x.id !== e.id) }));
            fechar();
          }}
        >
          Apagar embalagem
        </BotaoConfirmar>
      )}
    </div>
  );
}
