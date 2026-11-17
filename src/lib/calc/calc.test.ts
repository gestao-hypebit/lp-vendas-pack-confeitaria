import { describe, expect, it } from "vitest";
import {
  arredondarPreco,
  converter,
  custoEmbalagemUnit,
  custoFixoPorUnidade,
  custoPorBase,
  custoReceita,
  diagnostico,
  lucroLiquido,
  maoDeObra,
  precificar,
  precoSugerido,
  somaFixos,
  valorHora,
} from ".";
import { lerNumero, moeda } from "../formato";

describe("converter", () => {
  it("converte massa e volume", () => {
    expect(converter(1, "kg", "g")).toBe(1000);
    expect(converter(250, "g", "kg")).toBe(0.25);
    expect(converter(1.5, "L", "ml")).toBe(1500);
    expect(converter(395, "g", "g")).toBe(395);
    expect(converter(12, "un", "un")).toBe(12);
  });
  it("recusa unidades incompatíveis", () => {
    expect(converter(100, "g", "ml")).toBeNull();
    expect(converter(1, "un", "kg")).toBeNull();
  });
  it("trata quantidade inválida como zero", () => {
    expect(converter(NaN, "kg", "g")).toBe(0);
    expect(converter(-3, "kg", "g")).toBe(0);
  });
});

describe("custos unitários", () => {
  it("custo por grama de farinha de 1 kg a R$ 6", () => {
    expect(custoPorBase({ preco: 6, qtdEmbalagem: 1, unidade: "kg" })).toBeCloseTo(0.006);
  });
  it("leite condensado 395 g a R$ 7,90", () => {
    expect(custoPorBase({ preco: 7.9, qtdEmbalagem: 395, unidade: "g" })).toBeCloseTo(0.02);
  });
  it("sem preço ou sem quantidade → null", () => {
    expect(custoPorBase({ preco: null, qtdEmbalagem: 1, unidade: "kg" })).toBeNull();
    expect(custoPorBase({ preco: 5, qtdEmbalagem: 0, unidade: "kg" })).toBeNull();
  });
  it("embalagem em pacote", () => {
    expect(custoEmbalagemUnit({ preco: 8, qtdPacote: 100 })).toBeCloseTo(0.08);
    expect(custoEmbalagemUnit({ preco: 1.2, qtdPacote: null })).toBe(1.2);
    expect(custoEmbalagemUnit({ preco: null, qtdPacote: 10 })).toBeNull();
  });
});

describe("perfil", () => {
  it("valor da hora", () => {
    expect(valorHora(3000, 200)).toBe(15);
    expect(valorHora(3000, 0)).toBe(0);
    expect(valorHora(null, 160)).toBe(0);
  });
  it("custo fixo rateado", () => {
    const total = somaFixos({ gas: 120, energia: 150, internet: 100, mei: 76, aluguel: null });
    expect(total).toBe(446);
    expect(custoFixoPorUnidade(total, 400)).toBeCloseTo(1.115);
    expect(custoFixoPorUnidade(total, 0)).toBe(0);
  });
  it("mão de obra", () => {
    expect(maoDeObra(90, 20)).toBe(30);
    expect(maoDeObra(null, 20)).toBe(0);
  });
});

describe("custoReceita", () => {
  const leite = { preco: 7.9, qtdEmbalagem: 395, unidade: "g" as const };
  const choc = { preco: 50, qtdEmbalagem: 1, unidade: "kg" as const };
  const forminha = { preco: 8, qtdPacote: 100 };

  it("soma ingredientes (com conversão), embalagem, mão de obra e fixo", () => {
    const r = custoReceita(
      {
        rendimento: 25,
        itens: [
          { nome: "Leite condensado", qtd: 395, unidade: "g", ingrediente: leite },
          { nome: "Chocolate", qtd: 0.1, unidade: "kg", ingrediente: choc }, // 100 g → R$ 5
        ],
        embalagens: [{ nome: "Forminha", qtd: 1, embalagem: forminha }],
        tempoMin: 60,
      },
      { valorHora: 20, fixoPorUnidade: 0.3 },
    );
    expect(r.lote.ingredientes).toBeCloseTo(12.9);
    expect(r.porUnidade.ingredientes).toBeCloseTo(0.516);
    expect(r.porUnidade.embalagem).toBeCloseTo(0.08);
    expect(r.porUnidade.maoDeObra).toBeCloseTo(0.8);
    expect(r.porUnidade.fixo).toBeCloseTo(0.3);
    expect(r.porUnidade.total).toBeCloseTo(1.696);
    expect(r.lote.total).toBeCloseTo(42.4);
    expect(r.pendencias).toEqual([]);
  });

  it("não quebra com campos vazios e lista pendências", () => {
    const r = custoReceita(
      {
        rendimento: null,
        itens: [
          { nome: "Farinha", qtd: 200, unidade: "g", ingrediente: { preco: null, qtdEmbalagem: 1, unidade: "kg" } },
          { nome: "Leite", qtd: 100, unidade: "ml", ingrediente: leite }, // ml vs g
          { nome: "Ovo", qtd: 2, unidade: "un", ingrediente: null },
          { nome: "Vazio", qtd: null, unidade: "g", ingrediente: leite },
        ],
        embalagens: [{ nome: "Caixa", qtd: 1, embalagem: { preco: null, qtdPacote: 1 } }],
        tempoMin: null,
      },
      { valorHora: 0, fixoPorUnidade: 0 },
    );
    expect(r.porUnidade.total).toBe(0);
    expect(Number.isFinite(r.porUnidade.total)).toBe(true);
    expect(r.pendencias).toHaveLength(5);
  });
});

describe("preço sugerido", () => {
  it("custo ÷ (1 − (margem + taxa))", () => {
    expect(precoSugerido(10, 30, 0)).toBeCloseTo(14.2857);
    expect(precoSugerido(10, 30, 5)).toBeCloseTo(15.3846);
    expect(precoSugerido(10, 30, 27)).toBeCloseTo(23.2558);
  });
  it("margem + taxa ≥ 100% → null", () => {
    expect(precoSugerido(10, 80, 20)).toBeNull();
    expect(precoSugerido(10, 90, 30)).toBeNull();
  });
  it("campos vazios = 0%", () => {
    expect(precoSugerido(10, null, null)).toBe(10);
  });
  it("com o preço sugerido, sobra exatamente a margem", () => {
    const p = precoSugerido(8, 30, 4)!;
    expect(lucroLiquido(p, 8, 4)).toBeCloseTo(p * 0.3);
  });
});

describe("arredondamento", () => {
  it("centavos", () => {
    expect(arredondarPreco(4.3749)).toBe(4.37);
    expect(arredondarPreco(4.375)).toBe(4.38);
  });
  it("para cima em R$ 0,50", () => {
    expect(arredondarPreco(4.37, "cima50")).toBe(4.5);
    expect(arredondarPreco(4.5, "cima50")).toBe(4.5);
    expect(arredondarPreco(4.51, "cima50")).toBe(5);
    expect(arredondarPreco(4.0, "cima50")).toBe(4);
    expect(arredondarPreco(0.1 + 0.2 + 4.2, "cima50")).toBe(4.5); // 4.500000000000001
  });
});

describe("diagnóstico", () => {
  it("perdendo", () => {
    const d = diagnostico(12, 11.96, 27, precoSugerido(11.96, 30, 27));
    expect(d.status).toBe("perdendo");
    expect(d.valor).toBeCloseTo(3.2);
  });
  it("ganhando menos do que deveria", () => {
    const sug = precoSugerido(2, 30, 0)!; // 2,857
    const d = diagnostico(2.5, 2, 0, sug);
    expect(d.status).toBe("abaixo");
    expect(d.valor).toBeCloseTo(sug - 2.5);
  });
  it("saudável", () => {
    const d = diagnostico(3, 2, 0, precoSugerido(2, 30, 0));
    expect(d.status).toBe("saudavel");
    expect(d.valor).toBeCloseTo(1);
  });
  it("margem impossível não quebra", () => {
    expect(diagnostico(3, 2, 0, null).status).toBe("saudavel");
  });
});

describe("precificar", () => {
  it("balcão e app com arredondamento", () => {
    const p = precificar(2, { margem: 30, taxaCartao: 4, taxaApp: 27, modo: "cima50" });
    expect(p.balcao).toBe(3.5); // 3,03 → 3,50
    expect(p.app).toBe(5); // 4,65 → 5,00
    expect(p.lucroBalcao).toBeCloseTo(3.5 * 0.96 - 2);
  });
  it("margem impossível → null", () => {
    const p = precificar(2, { margem: 80, taxaCartao: 4, taxaApp: 27, modo: "centavos" });
    expect(p.balcao).toBe(2 / 0.16);
    expect(p.app).toBeNull();
    expect(p.lucroApp).toBeNull();
  });
});

describe("formato", () => {
  it("lê números digitados em pt-BR", () => {
    expect(lerNumero("4,50")).toBe(4.5);
    expect(lerNumero("4.50")).toBe(4.5);
    expect(lerNumero("R$ 1.234,56")).toBe(1234.56);
    expect(lerNumero("1.000")).toBe(1000);
    expect(lerNumero("")).toBeNull();
    expect(lerNumero("abc")).toBeNull();
  });
  it("formata reais", () => {
    expect(moeda(4.5)).toBe("R$ 4,50");
    expect(moeda(NaN)).toBe("R$ 0,00");
  });
});
