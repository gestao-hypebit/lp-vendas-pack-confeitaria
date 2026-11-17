"use client";

import { useEffect } from "react";
import { track } from "@/lib/pixel";

/** Dispara ViewContent uma vez ao abrir a página de vendas. */
export function TrackViewContent({ nome, valor }: { nome: string; valor: string }) {
  useEffect(() => {
    track("ViewContent", {
      content_name: nome,
      content_type: "product",
      value: Number(valor.replace(",", ".")),
      currency: "BRL",
    });
  }, [nome, valor]);
  return null;
}
