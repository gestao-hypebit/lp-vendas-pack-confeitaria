/**
 * Exemplo do bolo de pote usado na landing. Os números saem das MESMAS funções
 * do app, então a conta da página de vendas sempre bate com a calculadora.
 */
import {
  custoFixoPorUnidade,
  diagnostico,
  maoDeObra,
  precificar,
  somaFixos,
  valorHora,
  type Custos,
} from "./calc";

const PRO_LABORE = 3000;
const HORAS_MES = 200;
const FIXOS = { gas: 120, energia: 130, internet: 80, mei: 78 };
const UNIDADES_MES = 300;
const MINUTOS_POR_POTE = 12;

export const EX = {
  nome: "Bolo de pote de ninho",
  precoAtual: 12,
  taxaApp: 27,
  taxaCartao: 3,
  margem: 20,
  vendasMes: 150,
  ingredientes: 5.9,
  pote: 1.1, // o que ela lembra de contar
  embalagemCompleta: 1.7, // pote + colher + etiqueta
  valorHora: valorHora(PRO_LABORE, HORAS_MES),
  minutos: MINUTOS_POR_POTE,
  fixosMes: somaFixos(FIXOS),
};

export const EX_CUSTOS: Custos = (() => {
  const c = {
    ingredientes: EX.ingredientes,
    embalagem: EX.embalagemCompleta,
    maoDeObra: maoDeObra(MINUTOS_POR_POTE, EX.valorHora),
    fixo: custoFixoPorUnidade(EX.fixosMes, UNIDADES_MES),
    total: 0,
  };
  c.total = c.ingredientes + c.embalagem + c.maoDeObra + c.fixo;
  return c;
})();

export const EX_TAXA_APP_VALOR = (EX.precoAtual * EX.taxaApp) / 100;

export const EX_PRECOS = precificar(EX_CUSTOS.total, {
  margem: EX.margem,
  taxaCartao: EX.taxaCartao,
  taxaApp: EX.taxaApp,
  modo: "cima50",
});

/** vendendo a R$ 12 no app de delivery */
export const EX_DIAG = diagnostico(EX.precoAtual, EX_CUSTOS.total, EX.taxaApp, EX_PRECOS.app);
