/**
 * Confere a chave de acesso do link de entrega (/app?acesso=CHAVE).
 * A chave fica só no servidor (variável de ambiente CALC_ACCESS_KEY).
 * Sem a variável configurada, o app fica aberto (útil em desenvolvimento).
 *
 * Futuro: trocar por login Supabase + webhook "compra aprovada" da Kiwify.
 */
export async function POST(req: Request) {
  const chaveCerta = process.env.CALC_ACCESS_KEY;
  if (!chaveCerta) return Response.json({ ok: true, aberto: true });
  let chave = "";
  try {
    chave = String(((await req.json()) as { chave?: unknown }).chave ?? "");
  } catch {
    /* corpo inválido */
  }
  return Response.json({ ok: chave.trim() === chaveCerta.trim() });
}
