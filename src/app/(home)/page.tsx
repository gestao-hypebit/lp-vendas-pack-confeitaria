import type { Metadata } from "next";
import type { CSSProperties, ReactNode } from "react";
import { MockIngredientes, MockLista, MockResultado, MockWhatsApp } from "@/components/landing/mocks";
import { TrackViewContent } from "@/components/TrackViewContent";
import { Button, Faq, Marquee, MobileBar, Section, Starburst } from "@/components/ui";
import { CONFIG } from "@/config";
import { EX, EX_CUSTOS, EX_DIAG, EX_TAXA_APP_VALOR } from "@/lib/exemplo-landing";
import { moeda } from "@/lib/formato";

const TITULO = "Calculadora de Precificação para Confeitaria";
const DESCRICAO =
  "Descubra em 2 minutos se você está perdendo dinheiro em cada doce. Ingredientes, embalagem, gás, sua hora e a taxa do iFood: a calculadora faz a conta por você, direto do celular.";

export const metadata: Metadata = {
  title: `${TITULO} · Descubra o preço certo dos seus doces`,
  description: DESCRICAO,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: "/",
    title: "Você está perdendo dinheiro em cada doce que vende?",
    description: "A calculadora que faz a precificação por você, direto do celular. R$ 37, pagamento único.",
  },
  twitter: { card: "summary_large_image" },
};

const CHECKOUT = CONFIG.calculadora.checkout;
const PRECO = CONFIG.calculadora.preco;
const PRECO_CURTO = PRECO.replace(",00", "");
const CTA = `Quero precificar certo · R$ ${PRECO_CURTO}`;
/** no celular o texto do CTA é longo: fonte um pouco menor para caber em 1 linha */
const CTA_CEL = "max-cel:px-5 max-cel:text-[14px] max-cel:tracking-[.03em]";
const ENTREGA = "Acesso enviado por e-mail logo após a confirmação do pagamento";

const C = {
  choco: "var(--color-choco)",
  morango: "var(--color-morango)",
  rosa: "var(--color-rosa)",
  manteiga: "var(--color-manteiga)",
  creme: "var(--color-creme)",
};
const focoClaro = { "--focus": "var(--color-manteiga)" } as CSSProperties;

const MARQUEE = ["Ingredientes", "Embalagem", "Gás e luz", "Sua hora", "Taxa do iFood", "Maquininha", "Margem de lucro", "Preço certo"];

/* ---- Dor: o que ela acha que custa × o que custa de verdade ---- */
const NA_CABECA: [string, number][] = [
  ["Ingredientes", EX.ingredientes],
  ["Pote", EX.pote],
];
const NA_REAL: [string, number, string?][] = [
  ["Ingredientes", EX.ingredientes],
  ["Pote + colher + etiqueta", EX_CUSTOS.embalagem],
  [`Sua hora (${EX.minutos} min por pote)`, EX_CUSTOS.maoDeObra, "esquecido"],
  ["Gás, luz, internet e MEI", EX_CUSTOS.fixo, "esquecido"],
  [`Taxa do iFood (${EX.taxaApp}%)`, EX_TAXA_APP_VALOR, "esquecido"],
];
const custoCabeca = NA_CABECA.reduce((s, [, v]) => s + v, 0);
const custoReal = NA_REAL.reduce((s, [, v]) => s + v, 0);

const PASSOS = [
  { t: "Cadastre os ingredientes", p: "A lista já vem pronta com os mais comuns. Você só coloca o preço que pagou e a calculadora acha o custo de cada grama." },
  { t: "Monte a receita", p: "Escolha os ingredientes, a quantidade, a embalagem e o tempo de preparo. Igual a uma ficha técnica, só que sem conta." },
  { t: "Veja o preço certo", p: "Custo real, preço para o balcão e para o app de delivery, seu lucro e se você está perdendo dinheiro hoje." },
];

const FUNCOES: { t: string; p: string; mock?: ReactNode }[] = [
  { t: "Custo de cada grama", p: "Lista de ingredientes pronta, sem preço. Ela converte kg, g, L e ml sozinha.", mock: <MockIngredientes /> },
  { t: "Mostra onde você perde dinheiro", p: "Coloque o preço que você cobra hoje e veja na hora se está perdendo, ganhando pouco ou se está saudável.", mock: <MockLista /> },
  { t: "Cardápio pronto para o WhatsApp", p: "Um toque e a tabela de preços está copiada, com emojis, para mandar aos clientes.", mock: <MockWhatsApp /> },
  { t: "Sua hora entra na conta", p: "Você diz quanto quer ganhar por mês e quantas horas trabalha. A calculadora cobra o seu tempo em cada receita." },
  { t: "Gás, luz e embalagem", p: "Os custos fixos do mês são divididos por doce. Caixinha, forminha, fita e etiqueta também entram." },
  { t: "Preço do balcão e do iFood", p: "Dois preços: um para vender direto e outro que já cobre a taxa do app de delivery e da maquininha." },
  { t: "Ficha técnica para imprimir", p: "Salve em PDF ou imprima a ficha de cada receita, com ingredientes, custos e preço." },
  { t: "Arredonda para você", p: "Prefere preço redondo? R$ 4,37 vira R$ 4,50 com um toque." },
  { t: "Backup dos seus dados", p: "Baixe uma cópia das suas receitas e restaure quando quiser, até em outro celular." },
];

const PUBLICO = ["Confeiteiras", "Boleiras", "Docerias", "Brigadeiros gourmet", "Bolo de pote", "Delivery de doces", "Quem vende por encomenda", "Quem está começando"];

const INCLUI = [
  "Calculadora de precificação completa, em português",
  "Lista de ingredientes e embalagens já cadastrada",
  "Preço certo para balcão/WhatsApp e app de delivery",
  "Ficha técnica para imprimir ou salvar em PDF",
  "Cardápio de preços pronto para o WhatsApp",
  "Receita de exemplo para aprender em segundos",
];

const DETALHES = ["Pagamento único, sem mensalidade", "Acesso vitalício", "Funciona no celular e no computador", "Garantia de 7 dias"];

const FAQ: [string, string][] = [
  ["Preciso saber matemática?", "Não. Você só digita o que já sabe: quanto pagou nos ingredientes, quanto usa na receita e quanto tempo leva. Todas as contas são feitas pela calculadora."],
  ["Funciona no celular?", "Sim, foi feita pensando no celular: botões grandes e telas simples. Funciona também no computador e no tablet, direto no navegador, sem instalar nada."],
  ["Perco meus dados?", "Seus dados ficam guardados no próprio aparelho, no navegador que você usa. Se limpar o navegador ou trocar de celular, eles somem, por isso a calculadora tem o botão “Exportar backup”: ele baixa um arquivo com tudo, que você guarda no Drive, no e-mail ou no WhatsApp. Para recuperar, é só tocar em “Importar backup”."],
  ["É mensalidade?", `Não. Você paga R$ ${PRECO} uma vez só e usa para sempre.`],
  ["Serve para salgados?", "Serve! A lógica é a mesma: ingredientes, embalagem, tempo, custos fixos e taxas. Funciona para coxinha, empada, kit festa, marmita e o que mais você produzir."],
  ["Como recebo o acesso?", "O acesso é enviado por e-mail logo após a confirmação do pagamento. No Pix, a confirmação costuma ser rápida; no boleto, pode levar até 3 dias úteis. É só tocar no link do e-mail para abrir a calculadora."],
  ["E se eu não gostar?", "Você tem 7 dias de garantia. Se não gostar, peça o reembolso pela plataforma de pagamento dentro do prazo e recebe seu dinheiro de volta."],
];

/** Depoimentos REAIS entram aqui. A seção só aparece com CONFIG.mostrarDepoimentos = true. */
const DEPOIMENTOS: { nome: string; negocio: string; texto: string }[] = [];

/* ---- ancoragem honesta ---- */
const PERDA_EX = 2;
const VENDAS_EX = 150;

function Check({ escuro = false }: { escuro?: boolean }) {
  return (
    <span aria-hidden="true" className={`mt-px grid size-[26px] flex-none place-items-center rounded-full ${escuro ? "bg-choco" : "bg-manteiga"}`}>
      <svg viewBox="0 0 24 24" className="size-4">
        <path d="M6 12.5l4 4 8-9" fill="none" stroke={escuro ? "#FFD25E" : "#3B1F17"} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  );
}

export default function Home() {
  return (
    <>
      <TrackViewContent nome={TITULO} valor={PRECO} />

      <div className="bg-choco px-4 py-2.5 text-center text-[13px] font-bold uppercase tracking-[.14em] text-manteiga">
        Pagamento único · Funciona no celular
      </div>

      {/* HERO */}
      <header className="overflow-hidden bg-rosa pt-12 pb-[110px] max-tab:pt-8 max-tab:pb-[90px]">
        <div className="wrap grid grid-cols-[1.1fr_.9fr] items-center gap-12 max-tab:grid-cols-1 max-tab:gap-10">
          <div>
            <p className="kicker">Calculadora de precificação para confeitaria</p>
            <h1 className="mt-2 text-[clamp(38px,6.2vw,72px)] text-choco">
              Descubra em 2 minutos se você está <em className="not-italic text-morango">perdendo dinheiro</em> em cada doce
              que vende
            </h1>
            <p className="mt-[22px] mb-8 max-w-[540px] text-[clamp(18px,2.2vw,21px)] text-choco-2">
              A calculadora que faz a precificação por você: ingredientes, embalagem, gás, sua hora de trabalho e taxas do
              iFood. Direto do celular.
            </p>
            <Button href={CHECKOUT} className={`max-cel:w-full ${CTA_CEL}`}>
              {CTA}
            </Button>
            <p className="mt-3 text-sm text-choco-2">{ENTREGA}.</p>
            <div className="mt-6 flex flex-wrap gap-2.5">
              {["Sem planilha", "Sem mensalidade", "Garantia de 7 dias"].map((c) => (
                <span key={c} className="rounded-full bg-creme px-4 py-2 text-sm font-bold">
                  {c}
                </span>
              ))}
            </div>
          </div>

          <div className="relative" aria-label="Exemplo da tela de resultado da calculadora" role="img">
            <div aria-hidden="true">
              <MockResultado />
            </div>
            <Starburst rotate={10} className="absolute -top-8 right-0 w-[110px] text-[11px] max-cel:-right-1 max-cel:w-[96px]">
              TELA<b className="block font-display text-[24px] leading-none font-normal max-cel:text-[20px]">real</b>DO APP
            </Starburst>
          </div>
        </div>
      </header>

      <Marquee items={MARQUEE} />

      {/* VÍDEO (aparece quando CONFIG.videoUrl estiver preenchido) */}
      {CONFIG.videoUrl && (
        <Section color={C.creme}>
          <p className="kicker text-center">Veja funcionando</p>
          <h2 className="text-center">Do ingrediente ao preço certo</h2>
          <div className="mx-auto mt-10 aspect-[9/16] w-full max-w-[340px] overflow-hidden rounded-[32px] bg-choco shadow-xl">
            <video src={CONFIG.videoUrl} controls playsInline preload="metadata" className="size-full object-cover" />
          </div>
        </Section>
      )}

      {/* DOR */}
      <Section color={C.creme}>
        <p className="kicker text-center">Você cobra pelo preço da concorrência?</p>
        <h2 className="text-center">O doce que parece dar lucro</h2>
        <p className="mx-auto mt-5 max-w-[640px] text-center text-lg text-choco-2">
          A maioria das confeiteiras soma os ingredientes, olha o preço da vizinha e pronto. Fica de fora o gás, a
          embalagem, a sua hora e a taxa do app. Veja um {EX.nome.toLowerCase()} vendido a{" "}
          <strong className="text-choco">{moeda(EX.precoAtual)}</strong> no iFood:
        </p>

        <div className="mx-auto mt-10 grid max-w-[920px] grid-cols-2 gap-5 max-tab:grid-cols-1">
          <div className="rounded-[26px] bg-white p-7">
            <p className="text-sm font-bold uppercase tracking-wide text-choco-2">💭 A conta que ela faz</p>
            <ul className="mt-4 grid gap-2 text-lg">
              {NA_CABECA.map(([t, v]) => (
                <li key={t} className="flex justify-between gap-3 border-b border-dashed border-choco/20 pb-2">
                  {t} <span className="font-bold whitespace-nowrap tabular-nums">{moeda(v)}</span>
                </li>
              ))}
            </ul>
            <p className="mt-4 flex justify-between text-lg">
              Custo <strong className="tabular-nums">{moeda(custoCabeca)}</strong>
            </p>
            <p className="mt-6 rounded-2xl bg-[#d6f2dc] px-5 py-4 font-display text-[26px] leading-tight text-[#14532a]">
              “Lucro de {moeda(EX.precoAtual - custoCabeca)} por pote!”
            </p>
          </div>

          <div className="rounded-[26px] bg-choco p-7 text-creme">
            <p className="text-sm font-bold uppercase tracking-wide text-manteiga">🧾 A conta de verdade</p>
            <ul className="mt-4 grid gap-2 text-lg">
              {NA_REAL.map(([t, v, esquecido]) => (
                <li key={t} className="flex justify-between gap-3 border-b border-dashed border-creme/20 pb-2">
                  <span>
                    {t}
                    {esquecido && (
                      <span className="ml-2 rounded-full bg-manteiga px-2 py-0.5 align-middle text-[11px] font-bold uppercase text-choco">
                        esquecido
                      </span>
                    )}
                  </span>
                  <span className="font-bold whitespace-nowrap tabular-nums">{moeda(v)}</span>
                </li>
              ))}
            </ul>
            <p className="mt-4 flex justify-between text-lg">
              Custo real <strong className="tabular-nums">{moeda(custoReal)}</strong>
            </p>
            <p className="mt-6 rounded-2xl bg-morango px-5 py-4 font-display text-[26px] leading-tight text-white">
              Prejuízo de {moeda(EX_DIAG.valor)} por pote
            </p>
          </div>
        </div>

        <p className="mt-12 text-center font-display text-[clamp(28px,4.4vw,44px)] leading-[1.15]">
          Quanto mais vende, <span className="text-morango">mais perde.</span>
          <br />E ela nem sabe.
        </p>
      </Section>

      {/* COMO FUNCIONA */}
      <Section color={C.manteiga}>
        <p className="kicker text-center">Como funciona</p>
        <h2 className="text-center">Três passos, nenhuma conta</h2>
        <ol className="mt-14 grid list-none grid-cols-3 gap-[22px] p-0 max-tab:grid-cols-1 max-tab:gap-11">
          {PASSOS.map((p, i) => (
            <li key={p.t} className="relative rounded-[26px] bg-creme px-[30px] py-[34px]">
              <span
                aria-hidden="true"
                className="absolute -top-[26px] left-7 grid size-[60px] place-items-center rounded-full bg-morango font-display text-[30px] text-white"
              >
                {i + 1}
              </span>
              <h3 className="mt-[18px] mb-2 text-[28px]">{p.t}</h3>
              <p className="text-choco-2">{p.p}</p>
            </li>
          ))}
        </ol>
      </Section>

      {/* O QUE A CALCULADORA FAZ */}
      <Section color={C.creme}>
        <p className="kicker">O que a calculadora faz</p>
        <h2>Tudo o que entra no preço do seu doce</h2>
        <div className="mt-10 grid grid-cols-3 gap-[18px] max-tab:grid-cols-1">
          {FUNCOES.map((f) => (
            <div key={f.t} className={`rounded-[22px] p-6 ${f.mock ? "bg-rosa" : "bg-white"}`}>
              {f.mock && (
                <div aria-hidden="true" className="mb-5">
                  {f.mock}
                </div>
              )}
              <h3 className="mb-1.5 text-2xl">{f.t}</h3>
              <p className="text-[15px] text-choco-2">{f.p}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* ANCORAGEM HONESTA */}
      <Section color={C.choco} className="text-creme" style={focoClaro}>
        <div className="mx-auto max-w-[820px] text-center">
          <p className="kicker text-manteiga!">Faça a conta</p>
          <h2 className="text-creme">
            {moeda(PERDA_EX)} por doce parece pouco
          </h2>
          <div className="mt-10 grid grid-cols-3 items-center gap-4 max-cel:grid-cols-1">
            <div className="rounded-[22px] bg-choco-claro p-5">
              <p className="font-display text-[clamp(30px,4vw,42px)] leading-none whitespace-nowrap text-manteiga">{moeda(PERDA_EX)}</p>
              <p className="mt-1 text-sm">perdidos por doce</p>
            </div>
            <div className="rounded-[22px] bg-choco-claro p-5">
              <p className="font-display text-[clamp(30px,4vw,42px)] leading-none whitespace-nowrap text-manteiga">× {VENDAS_EX}</p>
              <p className="mt-1 text-sm">doces vendidos no mês</p>
            </div>
            <div className="rounded-[22px] bg-morango p-5">
              <p className="font-display text-[clamp(30px,4vw,42px)] leading-none whitespace-nowrap">{moeda(PERDA_EX * VENDAS_EX)}</p>
              <p className="mt-1 text-sm">por mês indo embora</p>
            </div>
          </div>
          <p className="mt-10 text-[clamp(20px,2.6vw,26px)]">
            São {moeda(PERDA_EX * VENDAS_EX * 12)} em um ano. A calculadora custa{" "}
            <strong className="text-manteiga">R$ {PRECO}, uma vez só</strong>.
          </p>
          <p className="mt-8">
            <Button href={CHECKOUT} className={CTA_CEL}>{CTA}</Button>
          </p>
        </div>
      </Section>

      {/* PARA QUEM É */}
      <Section color={C.morango} className="text-creme" style={focoClaro}>
        <p className="kicker text-manteiga!">Para quem é</p>
        <h2 className="text-creme">Feita para quem vive de doce</h2>
        <ul className="mt-[34px] flex list-none flex-wrap gap-3 p-0">
          {PUBLICO.map((t) => (
            <li key={t} className="rounded-full bg-creme px-[22px] py-3.5 text-[17px] font-bold text-choco">
              {t}
            </li>
          ))}
        </ul>
        <p className="mt-8 max-w-[640px] text-lg">
          Vende salgado também? A lógica é a mesma, então a calculadora serve para coxinha, empada e kit festa.
        </p>
      </Section>

      {/* DEPOIMENTOS (oculto até ter depoimentos reais) */}
      {CONFIG.mostrarDepoimentos && DEPOIMENTOS.length > 0 && (
        <Section color={C.creme}>
          <p className="kicker text-center">Quem já usa</p>
          <h2 className="text-center">O que as confeiteiras dizem</h2>
          <div className="mt-10 grid grid-cols-3 gap-[18px] max-tab:grid-cols-1">
            {DEPOIMENTOS.map((d) => (
              <figure key={d.nome} className="rounded-[22px] bg-white p-6">
                <blockquote className="text-lg">“{d.texto}”</blockquote>
                <figcaption className="mt-4 font-bold">
                  {d.nome} <span className="font-normal text-choco-2">· {d.negocio}</span>
                </figcaption>
              </figure>
            ))}
          </div>
        </Section>
      )}

      {/* OFERTA */}
      <Section color={C.rosa} id="oferta">
        <div className="relative mx-auto max-w-[760px] rounded-[36px] bg-white px-12 py-14 text-center shadow-[0_30px_60px_rgba(59,31,23,.12)] max-tab:px-[22px] max-tab:pt-[54px] max-tab:pb-[34px]">
          <Starburst
            rotate={12}
            className="absolute -top-[50px] -right-[30px] w-[150px] text-[13px] max-tab:-right-2 max-tab:w-[120px]"
          >
            PAGA<b className="block font-display text-[30px] leading-none font-normal max-tab:text-[24px]">1 vez</b>SÓ
          </Starburst>
          <p className="kicker">Oferta</p>
          <h2 className="text-[clamp(32px,5vw,50px)]">Calculadora de Precificação para Confeitaria</h2>
          <ul className="mx-auto mt-8 mb-8 grid max-w-[520px] list-none gap-3 p-0 text-left text-[17px] font-medium">
            {INCLUI.map((t) => (
              <li key={t} className="flex items-start gap-3">
                <Check />
                {t}
              </li>
            ))}
          </ul>
          <p className="mx-auto mb-8 max-w-[520px] rounded-[22px] bg-manteiga px-6 py-4 font-medium">
            🎁 <strong>Bônus:</strong> teste grátis do CatálogoPlace, seu cardápio online com pedidos direto no WhatsApp
          </p>
          <p className="font-display text-[clamp(64px,11vw,104px)] leading-none text-morango">
            <small className="mr-1.5 align-[.9em] text-[.4em]">R$</small>
            {PRECO}
          </p>
          <ul className="mx-auto mt-3 mb-7 flex max-w-[560px] list-none flex-wrap justify-center gap-x-4 gap-y-1 p-0 text-choco-2">
            {DETALHES.map((d) => (
              <li key={d}>✓ {d}</li>
            ))}
          </ul>
          <Button href={CHECKOUT} size="lg" className={CTA_CEL}>
            {CTA}
          </Button>
          <p className="mt-4 text-sm text-choco-2">{ENTREGA}.</p>
          <div className="mx-auto mt-[34px] flex max-w-[520px] items-center gap-[18px] rounded-[22px] bg-creme px-6 py-5 text-left max-cel:flex-col max-cel:text-center">
            <div className="grid size-[74px] flex-none place-items-center rounded-full bg-choco text-center text-[11px] leading-[1.1] font-bold tracking-[.06em] text-manteiga">
              <div>
                <b className="block font-display text-[30px] font-normal">7</b>DIAS
              </div>
            </div>
            <p>
              <strong>Garantia de 7 dias.</strong> Se não gostar, peça o reembolso dentro do prazo e você recebe seu dinheiro
              de volta.
            </p>
          </div>
        </div>
      </Section>

      {/* FAQ */}
      <Section color={C.creme}>
        <p className="kicker text-center">Dúvidas</p>
        <h2 className="text-center">Perguntas frequentes</h2>
        <Faq items={FAQ} />
      </Section>

      {/* CHAMADA FINAL */}
      <Section color={C.choco} className="pt-[100px]! pb-[120px]! text-center text-creme" style={focoClaro}>
        <h2 className="mb-[18px] text-[clamp(38px,6.6vw,68px)] text-creme">
          Pare de adivinhar.
          <br />
          Cobre o <em className="not-italic text-manteiga">preço certo</em>.
        </h2>
        <p className="mx-auto mb-[34px] max-w-[560px] text-[19px] opacity-85">
          Em 2 minutos você descobre quanto custa de verdade cada doce e por quanto vender. {ENTREGA}.
        </p>
        <Button href={CHECKOUT} className={CTA_CEL}>{CTA}</Button>
      </Section>

      <footer className="bg-rodape px-4 pt-7 pb-[100px] text-center text-[13px] text-[#c9a99f]">
        Calculadora de Precificação para Confeitaria · iFood é marca de seus respectivos donos. Este produto não é afiliado
        ao iFood.
      </footer>

      <MobileBar href={CHECKOUT}>Precificar certo · R$ {PRECO_CURTO}</MobileBar>
    </>
  );
}
