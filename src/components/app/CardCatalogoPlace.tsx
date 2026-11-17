import { CONFIG } from "@/config";

export function CardCatalogoPlace() {
  return (
    <a
      href={CONFIG.catalogoPlace}
      target="_blank"
      rel="noopener"
      className="block rounded-[22px] bg-morango p-5 text-white no-underline shadow-[0_5px_0_var(--color-morango-escuro)] active:translate-y-1 print:hidden"
    >
      <p className="text-sm font-bold uppercase tracking-wide text-manteiga">Próximo passo</p>
      <p className="mt-1 font-display text-[24px] leading-[1.15]">
        Agora que seus preços estão certos, monte seu cardápio online
      </p>
      <p className="mt-2 text-[15px] text-white/90">Seus clientes escolhem os doces e o pedido chega pronto no seu WhatsApp.</p>
      <span className="mt-4 inline-flex min-h-12 items-center rounded-2xl bg-white px-5 font-bold text-morango">
        Teste grátis do CatálogoPlace →
      </span>
    </a>
  );
}
