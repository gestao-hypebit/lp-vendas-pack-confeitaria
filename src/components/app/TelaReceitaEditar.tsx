"use client";

import { useMemo, useState } from "react";
import { compativeis, unidadeBase, type Unidade } from "@/lib/calc";
import { analisarReceita } from "@/lib/dados/analise";
import { novoId } from "@/lib/dados/seed";
import type { Receita } from "@/lib/dados/tipos";
import { reduzirFoto } from "@/lib/imagem";
import { moeda } from "@/lib/formato";
import { useApp } from "./estado";
import { UNIDADES } from "./TelaIngredientes";
import { Aviso, Botao, BotaoConfirmar, CampoNumero, CampoTexto, Card, Seletor, Topo } from "./ui";

function receitaVazia(): Receita {
  return {
    id: novoId(),
    nome: "",
    rendimento: null,
    itens: [],
    embalagens: [],
    tempoMin: null,
    precoAtual: null,
    vendasMes: 100,
    atualizadaEm: Date.now(),
  };
}

export function TelaReceitaEditar({ id }: { id?: string }) {
  const { dados, atualizar, ir, voltar, avisar } = useApp();
  const existente = id ? dados.receitas.find((r) => r.id === id) : undefined;
  const [r, setR] = useState<Receita>(() => existente ?? receitaVazia());
  const [picker, setPicker] = useState<"ing" | "emb" | null>(null);

  const ingMap = useMemo(() => new Map(dados.ingredientes.map((i) => [i.id, i])), [dados.ingredientes]);
  const embMap = useMemo(() => new Map(dados.embalagens.map((e) => [e.id, e])), [dados.embalagens]);
  const previa = analisarReceita(dados, r);

  if (id && !existente) {
    return (
      <>
        <Topo titulo="Receita" voltar={() => ir("", true)} />
        <p className="p-8 text-center">Essa receita não existe mais.</p>
      </>
    );
  }

  // 0 aparece como vazio: depois de digitar "2" horas, o campo de minutos não deve mostrar "0"
  const horas = r.tempoMin ? Math.floor(r.tempoMin / 60) || null : null;
  const minutos = r.tempoMin ? r.tempoMin % 60 || null : null;
  const setTempo = (h: number | null, m: number | null) => {
    const t = (h ?? 0) * 60 + (m ?? 0);
    setR({ ...r, tempoMin: t > 0 ? Math.round(t) : null });
  };

  const salvar = () => {
    if (!r.nome.trim()) return avisar("Dê um nome para a receita.");
    const final = { ...r, nome: r.nome.trim(), atualizadaEm: Date.now() };
    atualizar((d) => ({
      ...d,
      receitas: existente ? d.receitas.map((x) => (x.id === final.id ? final : x)) : [final, ...d.receitas],
    }));
    ir(`receita/${final.id}`, true);
  };

  const escolherFoto = async (f: File | undefined) => {
    if (!f) return;
    try {
      setR({ ...r, foto: await reduzirFoto(f) });
    } catch {
      avisar("Não consegui abrir essa foto.");
    }
  };

  return (
    <>
      <Topo titulo={existente ? "Editar receita" : "Nova receita"} voltar={() => voltar(existente ? `receita/${r.id}` : "")} />
      <div className="mx-auto grid max-w-[560px] gap-4 px-4 pt-4 pb-40">
        <Card className="grid gap-4">
          <CampoTexto
            label="Nome da receita"
            placeholder="Ex.: Bolo de pote de ninho"
            autoFocus={!existente}
            valor={r.nome}
            onChange={(nome) => setR({ ...r, nome })}
          />
          <CampoNumero
            label="Quantas unidades essa receita rende?"
            ajuda="Ex.: 1 panela de brigadeiro = 25 unidades."
            sufixo="un"
            valor={r.rendimento}
            onChange={(rendimento) => setR({ ...r, rendimento })}
          />
          <div className="flex items-center gap-3">
            {r.foto ? (
              // eslint-disable-next-line @next/next/no-img-element -- foto local em dataURL
              <img src={r.foto} alt="" className="size-16 rounded-xl object-cover" />
            ) : (
              <span aria-hidden="true" className="grid size-16 place-items-center rounded-xl bg-rosa text-2xl">
                📷
              </span>
            )}
            <label className="inline-flex min-h-12 cursor-pointer items-center rounded-2xl border-2 border-choco/15 px-4 font-bold">
              {r.foto ? "Trocar foto" : "Foto (opcional)"}
              <input type="file" accept="image/*" className="sr-only" onChange={(e) => escolherFoto(e.target.files?.[0])} />
            </label>
            {r.foto && (
              <button type="button" className="min-h-12 cursor-pointer px-2 text-sm font-bold text-choco-2" onClick={() => setR({ ...r, foto: undefined })}>
                Remover
              </button>
            )}
          </div>
        </Card>

        <Card>
          <h2 className="font-sans text-xl font-bold tracking-normal">🥣 Ingredientes da receita inteira</h2>
          <ul className="mt-3 grid gap-3">
            {r.itens.map((it, idx) => {
              const ing = ingMap.get(it.ingredienteId);
              const opcoes = ing ? UNIDADES.filter((u) => compativeis(u.v, ing.unidade)) : UNIDADES;
              return (
                <li key={idx} className="rounded-2xl bg-creme p-3">
                  <div className="flex items-center gap-2">
                    <span className="min-w-0 flex-1 truncate font-bold">{ing?.nome ?? "Ingrediente apagado"}</span>
                    {ing?.preco === null && <span className="text-xs font-bold text-morango-escuro">sem preço</span>}
                    <button
                      type="button"
                      aria-label={`Remover ${ing?.nome ?? "ingrediente"}`}
                      onClick={() => setR({ ...r, itens: r.itens.filter((_, j) => j !== idx) })}
                      className="grid size-11 cursor-pointer place-items-center rounded-full text-xl text-choco-2 active:bg-rosa"
                    >
                      ✕
                    </button>
                  </div>
                  <div className="mt-2 flex gap-2">
                    <CampoNumero
                      valor={it.qtd}
                      placeholder="Quantidade"
                      className="flex-1"
                      onChange={(qtd) => setR({ ...r, itens: r.itens.map((x, j) => (j === idx ? { ...x, qtd } : x)) })}
                    />
                    <Seletor<Unidade>
                      rotulo="Unidade"
                      valor={it.unidade}
                      opcoes={opcoes}
                      onChange={(unidade) => setR({ ...r, itens: r.itens.map((x, j) => (j === idx ? { ...x, unidade } : x)) })}
                    />
                  </div>
                </li>
              );
            })}
          </ul>
          <Botao variante="claro" className="mt-3 w-full" onClick={() => setPicker("ing")}>
            + Adicionar ingrediente
          </Botao>
        </Card>

        <Card>
          <h2 className="font-sans text-xl font-bold tracking-normal">🎁 Embalagem de cada unidade</h2>
          <p className="text-sm text-choco-2">O que vai em cada doce vendido: forminha, caixinha, fita…</p>
          <ul className="mt-3 grid gap-3">
            {r.embalagens.map((e, idx) => {
              const emb = embMap.get(e.embalagemId);
              return (
                <li key={idx} className="flex items-center gap-2 rounded-2xl bg-creme p-3">
                  <span className="min-w-0 flex-1 truncate font-bold">{emb?.nome ?? "Embalagem apagada"}</span>
                  <CampoNumero
                    valor={e.qtd}
                    sufixo="×"
                    className="w-24"
                    onChange={(qtd) => setR({ ...r, embalagens: r.embalagens.map((x, j) => (j === idx ? { ...x, qtd } : x)) })}
                  />
                  <button
                    type="button"
                    aria-label={`Remover ${emb?.nome ?? "embalagem"}`}
                    onClick={() => setR({ ...r, embalagens: r.embalagens.filter((_, j) => j !== idx) })}
                    className="grid size-11 cursor-pointer place-items-center rounded-full text-xl text-choco-2 active:bg-rosa"
                  >
                    ✕
                  </button>
                </li>
              );
            })}
          </ul>
          <Botao variante="claro" className="mt-3 w-full" onClick={() => setPicker("emb")}>
            + Adicionar embalagem
          </Botao>
        </Card>

        <Card className="grid gap-4">
          <div>
            <h2 className="font-sans text-xl font-bold tracking-normal">⏱️ Tempo de preparo</h2>
            <p className="text-sm text-choco-2">Da receita inteira: preparar, enrolar, decorar e embalar.</p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <CampoNumero label="Horas" sufixo="h" valor={horas} onChange={(h) => setTempo(h, minutos)} />
            <CampoNumero label="Minutos" sufixo="min" valor={minutos} onChange={(m) => setTempo(horas, m)} />
          </div>
        </Card>

        <Card>
          <CampoNumero
            label="Por quanto você vende hoje? (opcional)"
            ajuda="O preço de 1 unidade. Assim a calculadora mostra se você está perdendo dinheiro."
            prefixo="R$"
            valor={r.precoAtual}
            onChange={(precoAtual) => setR({ ...r, precoAtual })}
          />
        </Card>

        {existente && (
          <BotaoConfirmar
            confirmar="Toque de novo para apagar a receita"
            onConfirm={() => {
              atualizar((d) => ({ ...d, receitas: d.receitas.filter((x) => x.id !== r.id) }));
              ir("", true);
            }}
          >
            Apagar receita
          </BotaoConfirmar>
        )}
      </div>

      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-choco/10 bg-creme/95 px-4 pt-3 pb-[max(12px,env(safe-area-inset-bottom))] backdrop-blur">
        <div className="mx-auto flex max-w-[560px] items-center gap-3">
          <div className="min-w-0 flex-1">
            <p className="text-xs font-bold uppercase tracking-wide text-choco-2">Custo por unidade</p>
            <p className="font-display text-2xl leading-tight">{moeda(previa.custo.porUnidade.total)}</p>
          </div>
          <Botao onClick={salvar}>Ver preço certo →</Botao>
        </div>
      </div>

      {picker && (
        <Picker
          tipo={picker}
          fechar={() => setPicker(null)}
          escolher={(itemId, unidade) => {
            // receita usa g/ml/unid. mesmo que o pacote seja em kg ou L (farinha 1 kg → receita em g)
            if (picker === "ing")
              setR({ ...r, itens: [...r.itens, { ingredienteId: itemId, qtd: null, unidade: unidade ? unidadeBase(unidade) : "g" }] });
            else setR({ ...r, embalagens: [...r.embalagens, { embalagemId: itemId, qtd: 1 }] });
            setPicker(null);
          }}
        />
      )}
    </>
  );
}

function Picker({
  tipo,
  fechar,
  escolher,
}: {
  tipo: "ing" | "emb";
  fechar: () => void;
  escolher: (id: string, unidade?: Unidade) => void;
}) {
  const { dados, atualizar } = useApp();
  const [busca, setBusca] = useState("");
  const lista = (tipo === "ing" ? dados.ingredientes : dados.embalagens)
    .filter((x) => x.nome.toLowerCase().includes(busca.trim().toLowerCase()))
    .sort((a, b) => a.nome.localeCompare(b.nome, "pt-BR"));

  const criar = () => {
    const id = novoId();
    const nome = busca.trim();
    if (tipo === "ing") {
      atualizar((d) => ({ ...d, ingredientes: [{ id, nome, preco: null, qtdEmbalagem: null, unidade: "g" }, ...d.ingredientes] }));
      escolher(id, "g");
    } else {
      atualizar((d) => ({ ...d, embalagens: [{ id, nome, preco: null, qtdPacote: null }, ...d.embalagens] }));
      escolher(id);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-black/40" role="dialog" aria-modal="true" aria-label="Escolher">
      <button type="button" aria-label="Fechar" className="min-h-16 flex-none cursor-default" onClick={fechar} />
      <div className="mx-auto flex w-full max-w-[560px] flex-1 flex-col overflow-hidden rounded-t-[26px] bg-creme">
        <div className="flex items-center gap-2 p-4">
          <input
            type="search"
            autoFocus
            aria-label="Buscar"
            placeholder={tipo === "ing" ? "🔎 Buscar ingrediente" : "🔎 Buscar embalagem"}
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className="h-14 min-w-0 flex-1 rounded-2xl border-2 border-choco/15 bg-white px-4 text-lg outline-none focus:border-morango"
          />
          <button type="button" onClick={fechar} className="min-h-12 cursor-pointer px-2 font-bold text-choco-2">
            Fechar
          </button>
        </div>
        <ul className="flex-1 overflow-y-auto px-4 pb-8">
          {lista.map((x) => (
            <li key={x.id}>
              <button
                type="button"
                onClick={() => escolher(x.id, "unidade" in x ? x.unidade : undefined)}
                className="flex min-h-14 w-full cursor-pointer items-center justify-between gap-2 border-b border-choco/10 px-2 text-left text-lg active:bg-rosa/40"
              >
                <span className="truncate">{x.nome}</span>
                {x.preco === null && <span className="text-xs font-bold text-morango-escuro">sem preço</span>}
              </button>
            </li>
          ))}
          {busca.trim() && !lista.some((x) => x.nome.toLowerCase() === busca.trim().toLowerCase()) && (
            <li>
              <button
                type="button"
                onClick={criar}
                className="mt-3 flex min-h-14 w-full cursor-pointer items-center rounded-2xl bg-manteiga px-4 text-left font-bold"
              >
                + Criar “{busca.trim()}”
              </button>
            </li>
          )}
        </ul>
      </div>
    </div>
  );
}

export function AvisoPendencias({ pendencias, onCorrigir }: { pendencias: string[]; onCorrigir: () => void }) {
  if (!pendencias.length) return null;
  return (
    <Aviso>
      <p className="font-bold">Faltam alguns dados, então o custo pode estar menor do que é:</p>
      <ul className="mt-1 list-disc pl-5">
        {pendencias.slice(0, 4).map((p) => (
          <li key={p}>{p}</li>
        ))}
        {pendencias.length > 4 && <li>e mais {pendencias.length - 4}…</li>}
      </ul>
      <button type="button" onClick={onCorrigir} className="mt-2 min-h-11 cursor-pointer font-bold text-morango-escuro underline">
        Completar agora
      </button>
    </Aviso>
  );
}
