declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}

/**
 * Dispara um evento padrão do Meta Pixel. O script do pixel carrega depois da
 * hidratação, então se o fbq ainda não existe, tenta de novo por até ~5 s.
 */
export function track(evento: string, params?: Record<string, unknown>) {
  if (typeof window === "undefined") return;
  let tentativas = 0;
  const tentar = () => {
    if (window.fbq) window.fbq("track", evento, params);
    else if (++tentativas < 25) setTimeout(tentar, 200);
  };
  tentar();
}
