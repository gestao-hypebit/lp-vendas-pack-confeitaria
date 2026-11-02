"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { FILTROS, POSTS, postSrc, type Categoria } from "@/data/posts";

type Post = (typeof POSTS)[number];

export function Gallery() {
  const [filtro, setFiltro] = useState<Categoria | "todos">("todos");
  const [aberto, setAberto] = useState<Post | null>(null);
  const lbRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!aberto) return;
    lbRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setAberto(null);
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      triggerRef.current?.focus();
    };
  }, [aberto]);

  return (
    <>
      <div className="mt-[30px] mb-[34px] flex flex-wrap gap-2.5" role="group" aria-label="Filtrar posts">
        {FILTROS.map((f) => (
          <button
            key={f.id}
            type="button"
            aria-pressed={filtro === f.id}
            onClick={() => setFiltro(f.id)}
            className="min-h-11 cursor-pointer rounded-full bg-choco-claro px-[18px] py-3 text-sm font-bold uppercase tracking-[.06em] text-creme aria-pressed:bg-manteiga aria-pressed:text-choco"
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-5 gap-3.5 max-tab:grid-cols-3 max-tab:gap-2.5 max-cel:grid-cols-2">
        {POSTS.map((p) => {
          const [n, cat, titulo] = p;
          const visivel = filtro === "todos" || cat === filtro;
          return (
            <button
              key={n}
              type="button"
              hidden={!visivel}
              onClick={(e) => {
                triggerRef.current = e.currentTarget;
                setAberto(p);
              }}
              aria-label={`Ampliar post: ${titulo}`}
              className="block cursor-zoom-in overflow-hidden rounded-[10px] bg-choco-claro transition-transform duration-200 hover:scale-[1.03]"
            >
              <Image
                src={postSrc(n)}
                alt={`Post: ${titulo}`}
                width={540}
                height={675}
                loading="lazy"
                sizes="(max-width: 520px) 50vw, (max-width: 900px) 33vw, 216px"
                className="h-auto w-full"
              />
            </button>
          );
        })}
      </div>

      {aberto && (
        <div
          ref={lbRef}
          tabIndex={-1}
          role="dialog"
          aria-modal="true"
          aria-label="Post ampliado"
          onClick={() => setAberto(null)}
          className="fixed inset-0 z-50 grid cursor-zoom-out place-items-center bg-[rgba(30,14,10,.92)] p-5 outline-none"
        >
          <Image
            src={postSrc(aberto[0])}
            alt={`Post: ${aberto[2]}`}
            width={540}
            height={675}
            sizes="(max-width: 600px) 100vw, 540px"
            className="h-auto max-h-[90vh] w-auto rounded-xl"
          />
        </div>
      )}
    </>
  );
}
