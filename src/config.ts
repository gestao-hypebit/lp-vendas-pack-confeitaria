/* ============ EDITE AQUI ============ */
export const CONFIG = {
  /** Produto principal: a calculadora (landing em /) */
  calculadora: {
    checkout: "https://pay.kiwify.com.br/H1g9Tkh",
    preco: "37,00",
  },
  /** Pack de 30 posts (landing em /pack; também é o order bump na Kiwify) */
  pack: {
    checkout: "https://pay.kiwify.com.br/sMqGNtc",
    preco: "27,00",
    ancoraValor: "Uma social media cobraria mais de R$ 300 por 30 posts", // "" esconde a frase
  },
  /** Link do teste grátis do CatálogoPlace (CTA dentro do app e bônus na landing) */
  catalogoPlace: "https://catalogoplace.com.br/teste-gratis",
  /** Vídeo curto do hero (ex.: /video/demo.mp4 em public/). Vazio = mostra o print do app. */
  videoUrl: "",
  /** Mostra a seção de depoimentos na landing. Só ligue com depoimentos REAIS. */
  mostrarDepoimentos: false,
  /** ID do pixel da Meta; vazio = pixel desligado */
  pixelId: "1875732719998905",
};
/* ==================================== */

/** Todos os checkouts, com o valor enviado no InitiateCheckout. */
export const CHECKOUTS = [CONFIG.calculadora, CONFIG.pack].map((p) => ({
  url: p.checkout,
  valor: Number(p.preco.replace(",", ".")),
}));

/** true quando o link ainda é um placeholder "[COLOCAR ...]" */
export const linkPendente = (url: string) => !/^https?:\/\//.test(url);
