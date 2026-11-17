import { describe, expect, it } from "vitest";
import { analisarReceita } from "./analise";
import { exportarBackup, importarBackup, normalizar } from "./repositorio";
import { dadosIniciais, removerExemplo, temExemplo } from "./seed";

describe("dados iniciais e receita demo", () => {
  it("demo calcula sem pendências, com perfil vazio", () => {
    const d = dadosIniciais();
    const r = d.receitas[0];
    const a = analisarReceita(d, r);
    expect(a.custo.pendencias).toEqual([]);
    // ingredientes: 7,90 + 1,95 + 4,99 + 1,0425 + 3,87 = 19,7525 → ÷ 25
    expect(a.custo.porUnidade.ingredientes).toBeCloseTo(0.7901);
    expect(a.custo.porUnidade.embalagem).toBeCloseTo(0.099);
    expect(a.balcao).not.toBeNull();
    expect(a.diagBalcao).not.toBeNull();
  });

  it("ingredientes sem preço, exceto os de exemplo", () => {
    const d = dadosIniciais();
    expect(d.ingredientes.filter((i) => i.preco !== null).every((i) => i.exemplo)).toBe(true);
  });

  it("remover exemplo limpa receita e preços de exemplo", () => {
    const d = removerExemplo(dadosIniciais());
    expect(d.receitas).toHaveLength(0);
    expect(temExemplo(d)).toBe(false);
    expect(d.ingredientes.every((i) => i.preco === null)).toBe(true);
  });
});

describe("backup", () => {
  it("exporta e importa de volta igual", () => {
    const d = dadosIniciais();
    expect(importarBackup(exportarBackup(d))).toEqual(d);
  });
  it("recusa arquivo estranho com mensagem amigável", () => {
    expect(() => importarBackup("oi")).toThrow(/não é um backup/);
    expect(() => importarBackup('{"foo":1}')).toThrow(/não é um backup/);
  });
  it("normaliza campos faltando sem quebrar", () => {
    const d = normalizar({ receitas: [{ nome: "Bolo", itens: [{ qtd: "x" }] }] })!;
    expect(d.perfil.margem).toBe(30);
    expect(d.receitas[0].itens[0].qtd).toBeNull();
    expect(d.receitas[0].itens[0].unidade).toBe("g");
  });
});
