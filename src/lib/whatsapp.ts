import { moeda } from "./formato";

const EMOJIS = ["🍫", "🧁", "🍰", "🍓", "🍬", "🎂", "🍪", "🥥"];

/** Tabela de preços de uma receita (para mandar para clientes). */
export function textoReceita(loja: string, nome: string, preco: number | null, precoApp?: number | null): string {
  const linhas = [`🧁 *${nome}*${loja ? ` – ${loja}` : ""}`, ""];
  linhas.push(`💰 ${preco === null ? "Consulte" : moeda(preco)} a unidade`);
  if (precoApp) linhas.push(`🛵 No app de delivery: ${moeda(precoApp)}`);
  linhas.push("", "📲 Faça seu pedido por aqui!");
  return linhas.join("\n");
}

/** Cardápio com todas as receitas. */
export function textoCardapio(loja: string, itens: { nome: string; preco: number | null }[]): string {
  const linhas = [`✨ *Cardápio${loja ? ` – ${loja}` : ""}* ✨`, ""];
  itens.forEach((it, i) => {
    linhas.push(`${EMOJIS[i % EMOJIS.length]} ${it.nome}: *${it.preco === null ? "consulte" : moeda(it.preco)}*`);
  });
  linhas.push("", "📲 Encomendas pelo WhatsApp", "💛 Feito com carinho");
  return linhas.join("\n");
}

/** Copia texto; funciona também em navegadores antigos. */
export async function copiar(texto: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(texto);
    return true;
  } catch {
    try {
      const ta = document.createElement("textarea");
      ta.value = texto;
      ta.setAttribute("readonly", "");
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      const ok = document.execCommand("copy");
      ta.remove();
      return ok;
    } catch {
      return false;
    }
  }
}

export function linkWhatsApp(texto: string): string {
  return `https://wa.me/?text=${encodeURIComponent(texto)}`;
}
