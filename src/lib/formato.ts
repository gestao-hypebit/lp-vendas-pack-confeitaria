const BRL = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });

/** R$ 4,50 (com espaço normal, para copiar no WhatsApp sem caractere estranho). */
export function moeda(v: number | null | undefined): string {
  const x = typeof v === "number" && Number.isFinite(v) ? v : 0;
  return BRL.format(x).replace(/ /g, " ");
}

/** Custo de g/ml muito pequeno: mostra mais casas (R$ 0,0234). */
export function moedaFina(v: number): string {
  if (v >= 0.1) return moeda(v);
  return "R$ " + v.toLocaleString("pt-BR", { minimumFractionDigits: 4, maximumFractionDigits: 4 });
}

export function numeroBR(v: number | null | undefined, casas = 2): string {
  if (typeof v !== "number" || !Number.isFinite(v)) return "";
  return v.toLocaleString("pt-BR", { maximumFractionDigits: casas });
}

/**
 * Lê o que a pessoa digitou: "4,50", "4.50", "1.234,56", "R$ 10" → número.
 * Vazio ou lixo → null.
 */
export function lerNumero(s: string): number | null {
  let t = s.replace(/[^\d.,-]/g, "");
  if (!t) return null;
  if (t.includes(",")) t = t.replace(/\./g, "").replace(",", ".");
  else if (/^\d{1,3}(\.\d{3})+$/.test(t)) t = t.replace(/\./g, ""); // 1.000 = mil
  const v = Number(t);
  return Number.isFinite(v) ? v : null;
}
