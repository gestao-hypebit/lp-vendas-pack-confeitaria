import Image from "next/image";
import type { CSSProperties } from "react";
import { CONFIG } from "@/config";
import { Gallery } from "@/components/Gallery";
import { Button, Faq, Marquee, MobileBar, Section, Starburst } from "@/components/ui";

const C = {
  choco: "var(--color-choco)",
  morango: "var(--color-morango)",
  rosa: "var(--color-rosa)",
  manteiga: "var(--color-manteiga)",
  creme: "var(--color-creme)",
};

/** seções escuras: anel de foco em manteiga para continuar visível */
const focoClaro = { "--focus": "var(--color-manteiga)" } as CSSProperties;

const MARQUEE = ["Bolos", "Brigadeiros", "Encomendas", "Promoções", "Datas especiais", "Cardápio", "Depoimentos", "Kit festa"];

const DORES = [
  { n: 1, bg: "bg-rosa", t: "Falta tempo", p: "Entre fornada, recheio e entrega, sobra pouco tempo para pensar no que postar." },
  { n: 2, bg: "bg-manteiga", t: "Falta ideia", p: "Todo dia a mesma dúvida: postar o quê? Promoção, cardápio, bastidores?" },
  { n: 3, bg: "bg-rosa", t: "Falta design", p: "O doce é caprichado, mas o post não mostra isso e o cliente passa direto." },
];

const CATS = [
  { n: 10, t: "Vendas", p: "Novidade, promoção, kit festa, sabor do mês, frete grátis, combo, encomendas e últimas vagas." },
  { n: 5, t: "Relacionamento", p: "Depoimentos, quem faz, bastidores e agradecimento." },
  { n: 4, t: "Datas especiais", p: "Dia das Mães, Dia dos Namorados, Páscoa e Natal." },
  { n: 4, t: "Engajamento", p: "Enquetes “isso ou aquilo” e frases que geram comentário." },
  { n: 4, t: "Informativos", p: "Como encomendar, horário, dica de conservação e curiosidade." },
  { n: 3, t: "Cardápio", p: "Cardápio de bolos, vitrine do dia e sabores de brigadeiro." },
];

const PASSOS = [
  { t: "Compre", p: "Pagamento seguro e acesso liberado na hora, direto no seu e-mail." },
  { t: "Abra no Canva", p: "Clique no link e o pack aparece na sua conta do Canva, pronto para editar." },
  { t: "Personalize e poste", p: "Arraste suas fotos por cima, troque textos e preços, baixe e publique." },
];

const INCLUI = [
  "30 artes no formato 4:5, o tamanho ideal do feed",
  "Funciona no Canva grátis, sem elementos pagos",
  "Fotos de exemplo incluídas, para você substituir pelas suas",
  "Cores, textos e preços 100% editáveis",
  "Passo a passo de uso junto com o acesso",
  "Use quantas vezes quiser na sua confeitaria",
];

const PUBLICO = ["Confeitarias", "Docerias", "Boleiras", "Quem vende bolo caseiro", "Brigadeiros gourmet", "Delivery de doces", "Confeiteiras iniciantes"];

const FAQ: [string, string][] = [
  ["Preciso pagar o Canva?", "Não. O pack funciona na versão gratuita do Canva. Basta ter uma conta, que é criada em poucos segundos."],
  ["Preciso saber design?", "Não. Você só troca as fotos, os textos e os preços. Para trocar uma foto, basta arrastar a sua em cima da foto de exemplo."],
  ["Como recebo o pack?", "Logo após a confirmação do pagamento, você recebe por e-mail o acesso com o link do Canva e o passo a passo."],
  ["Posso mudar as cores e as fontes?", "Sim. Tudo é editável: cores, fontes, textos, preços e fotos. Dá para deixar com a identidade da sua marca."],
  ["As fotos são minhas para usar?", "As fotos que vêm no pack são ilustrativas. O ideal é trocar pelas fotos dos seus próprios doces, que é o que mais vende."],
  ["Funciona no celular?", "Sim. Você pode editar pelo app do Canva no celular ou pelo computador."],
  ["E se eu não gostar?", "Você tem 7 dias de garantia. É só pedir o reembolso pela plataforma de pagamento dentro do prazo."],
];

const COLAGEM = [
  { src: "/img/post-02.jpg", cls: "left-0 top-[60px] w-[58%] -rotate-7" },
  { src: "/img/post-01.jpg", cls: "right-0 top-0 z-[2] w-[58%] rotate-5" },
  { src: "/img/post-14.jpg", cls: "left-[20%] top-[210px] z-[3] w-[54%] -rotate-1" },
];

function Check() {
  return (
    <span aria-hidden="true" className="mt-px grid size-[26px] flex-none place-items-center rounded-full bg-manteiga">
      <svg viewBox="0 0 24 24" className="size-4">
        <path d="M6 12.5l4 4 8-9" fill="none" stroke="#3B1F17" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  );
}

export default function Home() {
  return (
    <>
      <div className="bg-choco px-4 py-2.5 text-center text-[13px] font-bold uppercase tracking-[.14em] text-manteiga">
        Acesso imediato · Editável no Canva grátis
      </div>

      {/* HERO */}
      <header className="overflow-hidden bg-rosa pt-14 pb-[120px] max-tab:pt-9 max-tab:pb-[90px]">
        <div className="wrap grid grid-cols-[1.05fr_.95fr] items-center gap-10 max-tab:grid-cols-1">
          <div>
            <p className="kicker">Pack para confeitarias e docerias</p>
            <h1 className="text-[clamp(44px,7.4vw,86px)] text-choco">
              30 posts prontos para sua confeitaria <em className="not-italic text-morango">vender mais</em>
            </h1>
            <p className="mt-[22px] mb-8 max-w-[520px] text-[clamp(18px,2.2vw,21px)] text-choco-2">
              Artes profissionais e editáveis no Canva. Troque a foto, ajuste o texto e poste em minutos, sem precisar
              saber design.
            </p>
            <Button href="#oferta" className="max-cel:w-full">
              Quero meu pack
            </Button>
            <div className="mt-7 flex flex-wrap gap-2.5">
              {["30 artes 4:5", "Canva grátis", "Acesso na hora"].map((c) => (
                <span key={c} className="rounded-full bg-creme px-4 py-2 text-sm font-bold">
                  {c}
                </span>
              ))}
            </div>
          </div>

          <div
            aria-hidden="true"
            className="relative h-[560px] max-tab:mx-auto max-tab:mt-2.5 max-tab:h-[420px] max-tab:w-full max-tab:max-w-[460px] max-cel:h-[360px]"
          >
            {COLAGEM.map((img) => (
              <Image
                key={img.src}
                src={img.src}
                alt=""
                width={540}
                height={675}
                preload
                sizes="(max-width: 900px) 270px, 310px"
                className={`absolute h-auto rounded-md border-[10px] border-white shadow-[0_24px_50px_rgba(59,31,23,.25)] ${img.cls}`}
              />
            ))}
            <Starburst
              rotate={10}
              className="absolute right-[-6px] bottom-[30px] z-[4] w-[168px] text-[13px] max-tab:w-[130px]"
            >
              SÃO<b className="block font-display text-[50px] leading-none font-normal max-tab:text-[38px]">30</b>POSTS
            </Starburst>
          </div>
        </div>
      </header>

      <Marquee items={MARQUEE} />

      {/* DOR */}
      <Section color={C.creme}>
        <p className="kicker text-center">Você conhece essa rotina?</p>
        <h2 className="text-center">Doce lindo, post sem graça</h2>
        <div className="mt-11 grid grid-cols-3 gap-[22px] max-tab:grid-cols-1">
          {DORES.map((d) => (
            <div key={d.n} className="rounded-[26px] bg-white p-[30px]">
              <div className={`mb-[18px] grid size-14 place-items-center rounded-full font-display text-[26px] ${d.bg}`}>
                {d.n}
              </div>
              <h3 className="mb-2 text-[26px]">{d.t}</h3>
              <p className="text-choco-2">{d.p}</p>
            </div>
          ))}
        </div>
        <p className="mt-14 text-center font-display text-[clamp(30px,4.6vw,48px)] leading-[1.15]">
          Você faz o doce.
          <br />
          <span className="text-morango">O pack faz o post.</span>
        </p>
      </Section>

      {/* O QUE VEM NO PACK */}
      <Section color={C.manteiga}>
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="kicker">O que vem no pack</p>
            <h2>
              Um mês inteiro
              <br />
              de conteúdo
            </h2>
          </div>
          <p className="max-w-[420px] text-lg">
            Cada post foi pensado para uma situação real da sua confeitaria: vender, apresentar o cardápio, aproveitar as
            datas e criar relacionamento.
          </p>
        </div>
        <div className="mt-10 grid grid-cols-3 gap-[18px] max-tab:grid-cols-1">
          {CATS.map((c) => (
            <div key={c.t} className="flex items-start gap-[18px] rounded-[22px] bg-creme p-[26px]">
              <div className="min-w-16 font-display text-5xl leading-[.9] text-morango">{c.n}</div>
              <div>
                <h3 className="mb-1.5 text-2xl">{c.t}</h3>
                <p className="text-[15px] text-choco-2">{c.p}</p>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* GALERIA */}
      <Section color={C.choco} id="galeria" className="text-creme" style={focoClaro}>
        <p className="kicker text-manteiga!">Veja todos os posts</p>
        <h2 className="text-creme">As 30 artes do pack</h2>
        <Gallery />
        <p className="mt-10 text-center">
          <Button href="#oferta">Quero todos os 30</Button>
        </p>
      </Section>

      {/* COMO FUNCIONA */}
      <Section color={C.creme}>
        <p className="kicker text-center">Como funciona</p>
        <h2 className="text-center">Simples como seguir receita</h2>
        <ol className="mt-11 grid list-none grid-cols-3 gap-[22px] p-0 max-tab:grid-cols-1 max-tab:gap-11">
          {PASSOS.map((p, i) => (
            <li key={p.t} className="relative rounded-[26px] bg-rosa px-[30px] py-[34px]">
              <span
                aria-hidden="true"
                className="absolute -top-[26px] left-7 grid size-[60px] place-items-center rounded-full bg-morango font-display text-[30px] text-white"
              >
                {i + 1}
              </span>
              <h3 className="mt-[18px] mb-2 text-[28px]">{p.t}</h3>
              <p>{p.p}</p>
            </li>
          ))}
        </ol>
        <ul className="mt-14 grid list-none grid-cols-2 gap-x-[30px] gap-y-3.5 p-0 max-tab:grid-cols-1">
          {INCLUI.map((t) => (
            <li key={t} className="flex items-start gap-3.5 text-lg font-medium">
              <Check />
              {t}
            </li>
          ))}
        </ul>
      </Section>

      {/* PARA QUEM É */}
      <Section color={C.morango} className="text-creme" style={focoClaro}>
        <p className="kicker text-manteiga!">Para quem é</p>
        <h2 className="text-creme">Feito para quem vive de doce</h2>
        <ul className="mt-[34px] flex list-none flex-wrap gap-3 p-0">
          {PUBLICO.map((t) => (
            <li key={t} className="rounded-full bg-creme px-[22px] py-3.5 text-[17px] font-bold text-choco">
              {t}
            </li>
          ))}
        </ul>
      </Section>

      {/* OFERTA */}
      <Section color={C.rosa} id="oferta">
        <div className="relative mx-auto max-w-[760px] rounded-[36px] bg-white px-12 py-14 text-center shadow-[0_30px_60px_rgba(59,31,23,.12)] max-tab:px-[22px] max-tab:pt-[54px] max-tab:pb-[34px]">
          <Starburst
            rotate={12}
            className="absolute -top-[50px] -right-[30px] w-[150px] text-[13px] max-tab:-right-2 max-tab:w-[120px]"
          >
            ACESSO<b className="block font-display text-[34px] leading-none font-normal max-tab:text-[28px]">já!</b>
          </Starburst>
          <p className="kicker">Pack completo</p>
          <h2 className="text-[clamp(34px,5vw,52px)]">30 posts para confeitaria</h2>
          <ul className="mx-auto mt-[26px] mb-[30px] grid list-none justify-items-center gap-2 p-0 font-medium">
            <li>30 artes editáveis no Canva</li>
            <li>6 tipos de post para o mês inteiro</li>
            <li>Fotos de exemplo e passo a passo</li>
          </ul>
          <p className="mx-auto mb-[30px] max-w-[520px] rounded-[22px] bg-manteiga px-6 py-4 font-medium">
            🎁 <strong>Bônus:</strong> teste grátis do CatálogoPlace, seu cardápio online com pedidos direto no WhatsApp
          </p>
          {CONFIG.ancoraValor && <p className="text-lg text-choco-2">{CONFIG.ancoraValor}</p>}
          <p className="mt-1.5 mb-1 font-display text-[clamp(64px,11vw,104px)] leading-none text-morango">
            <span className="sr-only">Preço atual: </span>
            <small className="mr-1.5 align-[.9em] text-[.4em]">R$</small>
            {CONFIG.preco}
          </p>
          <p className="mb-7 text-choco-2">pagamento único · sem mensalidade</p>
          <Button href={CONFIG.checkout} size="lg">
            Quero meu pack agora
          </Button>
          <div className="mx-auto mt-[34px] flex max-w-[520px] items-center gap-[18px] rounded-[22px] bg-creme px-6 py-5 text-left max-cel:flex-col max-cel:text-center">
            <div className="grid size-[74px] flex-none place-items-center rounded-full bg-choco text-center text-[11px] leading-[1.1] font-bold tracking-[.06em] text-manteiga">
              <div>
                <b className="block font-display text-[30px] font-normal">7</b>DIAS
              </div>
            </div>
            <p>
              <strong>Garantia de 7 dias.</strong> Se não gostar, peça o reembolso dentro do prazo e você recebe seu
              dinheiro de volta.
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
      <Section
        color={C.choco}
        className="pt-[100px]! pb-[120px]! text-center text-creme"
        style={focoClaro}
      >
        <h2 className="mb-[18px] text-[clamp(40px,7vw,72px)] text-creme">
          Seu feed tão gostoso
          <br />
          quanto seus <em className="not-italic text-manteiga">doces</em>
        </h2>
        <p className="mb-[34px] text-[19px] opacity-85">30 posts prontos, editáveis no Canva, com acesso na hora.</p>
        <Button href={CONFIG.checkout}>Quero meu pack</Button>
      </Section>

      <footer className="bg-rodape px-4 pt-7 pb-[100px] text-center text-[13px] text-[#c9a99f]">
        Pack 30 Posts para Confeitaria · Canva é marca registrada de Canva Pty Ltd. Este produto não é afiliado ao Canva.
      </footer>

      <MobileBar preco={CONFIG.preco} />
    </>
  );
}
