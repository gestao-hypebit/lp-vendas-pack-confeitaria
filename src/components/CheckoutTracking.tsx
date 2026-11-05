"use client";

import { useEffect } from "react";
import { CONFIG } from "@/config";

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}

const VALOR = Number(CONFIG.preco.replace(",", "."));

/** No clique em um link do checkout: repassa as UTMs da página e dispara o InitiateCheckout. */
export function CheckoutTracking() {
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (!(e.target instanceof Element)) return;
      const link = e.target.closest<HTMLAnchorElement>(`a[href^="${CONFIG.checkout}"]`);
      if (!link) return;

      const url = new URL(link.href);
      new URLSearchParams(window.location.search).forEach((valor, chave) => {
        url.searchParams.set(chave, valor);
      });
      link.href = url.toString();

      window.fbq?.("track", "InitiateCheckout", { value: VALOR, currency: "BRL" });
    };

    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  return null;
}
