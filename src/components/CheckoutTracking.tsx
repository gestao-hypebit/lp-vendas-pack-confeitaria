"use client";

import { useEffect } from "react";
import { CHECKOUTS, linkPendente } from "@/config";
import { track } from "@/lib/pixel";

/** No clique em um link de checkout: repassa as UTMs da página e dispara o InitiateCheckout. */
export function CheckoutTracking() {
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (!(e.target instanceof Element)) return;
      const link = e.target.closest<HTMLAnchorElement>("a[href]");
      if (!link) return;
      const href = link.getAttribute("href") ?? "";
      const checkout = CHECKOUTS.find((c) => href.startsWith(c.url));
      if (!checkout) return;

      if (!linkPendente(checkout.url)) {
        const url = new URL(link.href);
        new URLSearchParams(window.location.search).forEach((valor, chave) => {
          url.searchParams.set(chave, valor);
        });
        link.href = url.toString();
      }

      track("InitiateCheckout", { value: checkout.valor, currency: "BRL" });
    };

    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  return null;
}
