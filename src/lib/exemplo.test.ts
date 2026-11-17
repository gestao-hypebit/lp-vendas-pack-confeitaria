import { expect, it } from "vitest";
import { EX, EX_CUSTOS, EX_DIAG, EX_PRECOS, EX_TAXA_APP_VALOR } from "./exemplo-landing";

it("exemplo da landing: bolo de pote perde R$ 3,20 no app", () => {
  expect(EX.valorHora).toBe(15);
  expect(EX_CUSTOS.maoDeObra).toBeCloseTo(3);
  expect(EX_CUSTOS.fixo).toBeCloseTo(1.36);
  expect(EX_CUSTOS.total).toBeCloseTo(11.96);
  expect(EX_TAXA_APP_VALOR).toBeCloseTo(3.24);
  expect(EX_DIAG.status).toBe("perdendo");
  expect(EX_DIAG.valor).toBeCloseTo(3.2);
  expect(EX_PRECOS.balcao).toBe(16);
  expect(EX_PRECOS.app).toBe(23);
});
