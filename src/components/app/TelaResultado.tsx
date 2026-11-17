"use client";

import { custoEmbalagemUnit, custoPorBase, converter, unidadeBase } from "@/lib/calc";
import { analisarReceita, resumoPerfil, type Analise } from "@/lib/dados/analise";
import type { Dados, Receita } from "@/lib/dados/tipos";
import { moeda, numeroBR } from "@/lib/formato";
import { copiar, linkWhatsApp, textoReceita } from "@/lib/whatsapp";
import { CardCatalogoPlace } from "./CardCatalogoPlace";
import { useApp } from "./estado";
import { CampoArredondar } from "./perfil-campos";
import { BarraCustos, CardDiagnostico, CardPreco } from "./resultado-ui";
import { AvisoPendencias } from "./TelaReceitaEditar";
import { Aviso, Botao, CampoNumero, Card, Chip, Topo } from "./ui";

export function TelaResultado({ id }: { id: string }) {
  const { dados, atualizar, ir, voltar, avisar } = useApp();
  const r = dados.receitas.find((x) => x.id === id);

  if (!r) {
    return (
      <>
        <Topo titulo="Receita" voltar={() => ir("", true)} />
        <p className="p-8 text-center">Essa receita não existe mais.</p>
      </>
    );
  }

  const a = analisarReceita(dados, r);
  const { perfil } = dados;
  const custo = a.custo.porUnidade;
  const mudarReceita = (patch: Partial<Receita>) =>
    atualizar((d) => ({ ...d, receitas: d.receitas.map((x) => (x.id === r.id ? { ...x, ...patch } : x)) }));

  const texto = textoReceita(perfil.nome, r.nome.replace(/ – exemplo$/, ""), a.balcao);
  const vendas = r.vendasMes;

  return (
    <>
      <Topo
        titulo={r.nome}
        voltar={() => voltar("")}
        acao={
          <button
            type="button"
            onClick={() => ir(`receita/${r.id}/editar`)}
            className="min-h-11 cursor-pointer rounded-full bg-white/10 px-4 font-bold"
          >
            Editar
          </button>
        }
      />

      <div className="mx-auto grid max-w-[560px] gap-4 px-4 pt-4 pb-32 print:hidden">
        {r.exemplo && (
          <Aviso tom="rosa">
            <Chip cor="vermelho">Exemplo</Chip> Esta receita e os preços dela são só para você ver como funciona.
            Coloque os preços dos seus ingredientes em <strong>Ingredientes</strong> ou crie a sua receita.
          </Aviso>
        )}

        <AvisoPendencias pendencias={a.custo.pendencias} onCorrigir={() => ir(`receita/${r.id}/editar`)} />

        {/* DESTAQUE: está perdendo dinheiro? */}
        {a.diagBalcao && (
          <>
            <CardDiagnostico
              d={a.diagBalcao}
              precoAtual={r.precoAtual ?? undefined}
              projecao={<Projecao valor={a.diagBalcao.valor} status={a.diagBalcao.status} vendas={vendas} onVendas={(v) => mudarReceita({ vendasMes: v })} />}
            />
            {a.diagApp && a.diagApp.status !== "saudavel" && (
              <p className="rounded-2xl bg-white px-4 py-3 text-[15px]">
                🛵 Se vender esse mesmo preço no app de delivery:{" "}
                <strong className="text-morango-escuro">
                  {a.diagApp.status === "perdendo"
                    ? `perde ${moeda(a.diagApp.valor)} por unidade`
                    : `ganha ${moeda(a.diagApp.valor)} a menos por unidade`}
                </strong>
                .
              </p>
            )}
          </>
        )}
        {/* sempre montado: se trocasse pelo card acima, perderia o resto da digitação ("2" → ",50") */}
        <Card>
          <CampoNumero
            label="Por quanto você vende hoje?"
            ajuda={a.diagBalcao ? "Mude para simular outro preço." : "Coloque o preço atual para saber se está perdendo dinheiro."}
            prefixo="R$"
            valor={r.precoAtual}
            onChange={(precoAtual) => mudarReceita({ precoAtual })}
          />
        </Card>

        {/* PREÇOS SUGERIDOS */}
        <section aria-labelledby="t-precos">
          <h2 id="t-precos" className="mb-2 font-sans text-sm font-bold uppercase tracking-wide text-choco-2">
            Preço certo por unidade
          </h2>
          {a.margemImpossivel && (
            <Aviso>Margem + taxa passam de 100%. Diminua a margem ou confira as taxas em Ajustes.</Aviso>
          )}
          <div className="grid grid-cols-2 gap-3">
            <CardPreco titulo="Balcão / WhatsApp" icone="🏠" preco={a.balcao} lucro={a.lucroBalcao} taxa={perfil.taxaCartao} destaque />
            <CardPreco titulo="App de delivery" icone="🛵" preco={a.app} lucro={a.lucroApp} taxa={perfil.taxaApp} />
          </div>
          <p className="mt-2 text-sm text-choco-2">
            Lucro já com a sua hora paga e com margem de {numeroBR(perfil.margem ?? 0)}%.
          </p>
          <div className="mt-3">
            <CampoArredondar p={perfil} set={(p) => atualizar((d) => ({ ...d, perfil: p }))} />
          </div>
        </section>

        {/* CUSTO */}
        <Card>
          <div className="flex items-end justify-between gap-3">
            <h2 className="font-sans text-sm font-bold uppercase tracking-wide text-choco-2">Custo real por unidade</h2>
            <p className="font-display text-[30px] leading-none">{moeda(custo.total)}</p>
          </div>
          <div className="mt-4">
            <BarraCustos custos={custo} />
          </div>
          <p className="mt-3 text-sm text-choco-2">
            Receita inteira: {moeda(a.custo.lote.total)} para {numeroBR(a.custo.rendimento)} unidades.
          </p>
        </Card>

        <div className="grid gap-3">
          <Botao
            variante="escuro"
            onClick={async () => avisar((await copiar(texto)) ? "Copiado! Cole no WhatsApp 💬" : "Não consegui copiar. Use o botão abaixo.")}
          >
            📋 Copiar preço para o WhatsApp
          </Botao>
          <a
            href={linkWhatsApp(texto)}
            target="_blank"
            rel="noopener"
            className="inline-flex min-h-14 items-center justify-center rounded-2xl border-2 border-choco/15 bg-white px-5 font-bold"
          >
            💬 Abrir no WhatsApp
          </a>
          <Botao variante="claro" onClick={() => window.print()}>
            🖨️ Imprimir / salvar ficha técnica em PDF
          </Botao>
        </div>

        <CardCatalogoPlace />
      </div>

      <FichaTecnica dados={dados} r={r} a={a} />
    </>
  );
}

function Projecao({
  valor,
  status,
  vendas,
  onVendas,
}: {
  valor: number;
  status: "perdendo" | "abaixo" | "saudavel";
  vendas: number | null;
  onVendas: (v: number | null) => void;
}) {
  const frase = { perdendo: "indo embora", abaixo: "deixando de ganhar", saudavel: "de lucro" }[status];
  return (
    <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[17px] font-bold">
      <span>Vendendo</span>
      <CampoNumero valor={vendas} onChange={onVendas} className="w-24 text-choco" />
      <span>por mês, são</span>
      <span className="font-display text-[26px] font-normal">{moeda((Math.round(valor * 100) / 100) * (vendas ?? 0))}</span>
      <span>por mês {frase}.</span>
    </div>
  );
}

/** Versão limpa só para impressão / PDF. */
function FichaTecnica({ dados, r, a }: { dados: Dados; r: Receita; a: Analise }) {
  const perfil = resumoPerfil(dados.perfil);
  const ingMap = new Map(dados.ingredientes.map((i) => [i.id, i]));
  const embMap = new Map(dados.embalagens.map((e) => [e.id, e]));
  const td = "border-b border-black/15 py-1.5";
  return (
    <article className="hidden bg-white p-8 text-[13px] text-black print:block">
      <p className="text-xs uppercase tracking-widest">{dados.perfil.nome || "Minha confeitaria"} · Ficha técnica</p>
      <h1 className="mt-1 font-sans text-3xl font-bold">{r.nome}</h1>
      <p className="mt-1">
        Rende {numeroBR(r.rendimento)} unidades · Tempo {Math.floor((r.tempoMin ?? 0) / 60)}h{String((r.tempoMin ?? 0) % 60).padStart(2, "0")} ·
        Sua hora: {moeda(perfil.valorHora)}
      </p>

      <h2 className="mt-5 font-sans text-base font-bold">Ingredientes</h2>
      <table className="mt-1 w-full border-collapse">
        <tbody>
          {r.itens.map((it, i) => {
            const ing = ingMap.get(it.ingredienteId);
            const cb = ing ? custoPorBase(ing) : null;
            const q = ing ? converter(it.qtd ?? 0, it.unidade, unidadeBase(ing.unidade)) : null;
            return (
              <tr key={i}>
                <td className={td}>{ing?.nome ?? "—"}</td>
                <td className={`${td} text-right`}>
                  {numeroBR(it.qtd)} {it.unidade}
                </td>
                <td className={`${td} text-right`}>{cb !== null && q !== null ? moeda(cb * q) : "sem preço"}</td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {r.embalagens.length > 0 && (
        <>
          <h2 className="mt-5 font-sans text-base font-bold">Embalagem (por unidade)</h2>
          <table className="mt-1 w-full border-collapse">
            <tbody>
              {r.embalagens.map((e, i) => {
                const emb = embMap.get(e.embalagemId);
                const cu = emb ? custoEmbalagemUnit(emb) : null;
                return (
                  <tr key={i}>
                    <td className={td}>{emb?.nome ?? "—"}</td>
                    <td className={`${td} text-right`}>{numeroBR(e.qtd)}×</td>
                    <td className={`${td} text-right`}>{cu !== null ? moeda(cu * (e.qtd ?? 0)) : "sem preço"}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </>
      )}

      <h2 className="mt-5 font-sans text-base font-bold">Custo por unidade</h2>
      <table className="mt-1 w-full border-collapse">
        <tbody>
          {(
            [
              ["Ingredientes", a.custo.porUnidade.ingredientes],
              ["Embalagem", a.custo.porUnidade.embalagem],
              ["Mão de obra", a.custo.porUnidade.maoDeObra],
              ["Custos fixos", a.custo.porUnidade.fixo],
            ] as const
          ).map(([t, v]) => (
            <tr key={t}>
              <td className={td}>{t}</td>
              <td className={`${td} text-right`}>{moeda(v)}</td>
            </tr>
          ))}
          <tr className="font-bold">
            <td className="py-1.5">Total</td>
            <td className="py-1.5 text-right">{moeda(a.custo.porUnidade.total)}</td>
          </tr>
        </tbody>
      </table>

      <h2 className="mt-5 font-sans text-base font-bold">Preço sugerido (margem {numeroBR(dados.perfil.margem ?? 0)}%)</h2>
      <p className="mt-1">
        Balcão / WhatsApp: <strong>{a.balcao === null ? "—" : moeda(a.balcao)}</strong> (lucro {moeda(a.lucroBalcao)}) ·
        App de delivery: <strong>{a.app === null ? "—" : moeda(a.app)}</strong> (lucro {moeda(a.lucroApp)})
      </p>
      {r.precoAtual ? <p className="mt-1">Preço atual: {moeda(r.precoAtual)}</p> : null}
      <p className="mt-8 text-[11px] text-black/60">Gerado pela Calculadora de Precificação para Confeitaria em {new Date().toLocaleDateString("pt-BR")}.</p>
    </article>
  );
}
