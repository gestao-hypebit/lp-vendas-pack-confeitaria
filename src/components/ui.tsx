import type { CSSProperties, ReactNode } from "react";

/* ---------- Button ---------- */

const VARIANTS = {
  primary:
    "bg-morango shadow-[0_6px_0_var(--color-morango-escuro)] hover:shadow-[0_4px_0_var(--color-morango-escuro)] active:shadow-[0_0_0_var(--color-morango-escuro)]",
  dark: "bg-choco shadow-[0_6px_0_var(--color-choco-escuro)] hover:shadow-[0_4px_0_var(--color-choco-escuro)] active:shadow-[0_0_0_var(--color-choco-escuro)]",
};

const SIZES = {
  md: "px-[34px] py-5 text-[17px]",
  lg: "w-full max-w-[460px] p-6 text-[19px]",
  bar: "w-full p-[18px] text-[17px]",
};

export function Button({
  href,
  children,
  variant = "primary",
  size = "md",
  className = "",
}: {
  href: string;
  children: ReactNode;
  variant?: keyof typeof VARIANTS;
  size?: keyof typeof SIZES;
  className?: string;
}) {
  return (
    <a
      href={href}
      className={`inline-flex min-h-11 items-center justify-center gap-2.5 rounded-full text-center font-sans font-bold uppercase tracking-[.06em] text-white no-underline transition-[transform,box-shadow] duration-150 hover:translate-y-0.5 active:translate-y-1.5 ${VARIANTS[variant]} ${SIZES[size]} ${className}`}
    >
      {children}
    </a>
  );
}

/* ---------- Starburst ---------- */

/** Polígono em estrela com `n` pontas e raio interno `r` (0–1), igual à estrela() do HTML. */
export function estrela(n: number, r: number) {
  const pts = Array.from({ length: n * 2 }, (_, i) => {
    const a = (Math.PI * i) / n - Math.PI / 2;
    const d = i % 2 ? 50 * r : 50;
    return `${(50 + d * Math.cos(a)).toFixed(2)}% ${(50 + d * Math.sin(a)).toFixed(2)}%`;
  });
  return `polygon(${pts.join(",")})`;
}

const STAR_CLIP = estrela(16, 0.78);

export function Starburst({
  children,
  rotate = 0,
  className = "",
}: {
  children: ReactNode;
  rotate?: number;
  className?: string;
}) {
  return (
    <div
      className={`grid aspect-square place-items-center bg-manteiga text-center font-bold tracking-[.08em] text-choco ${className}`}
      style={{ clipPath: STAR_CLIP, transform: `rotate(${rotate}deg)` }}
    >
      <div>{children}</div>
    </div>
  );
}

/* ---------- Scallop ---------- */

export function Scallop({ color }: { color: string }) {
  return (
    <span
      aria-hidden="true"
      className="pointer-events-none absolute inset-x-0 -top-[25px] h-[26px]"
      style={{
        background: `radial-gradient(circle at 26px 26px, ${color} 25px, transparent 26px) 0 0 / 52px 26px repeat-x`,
      }}
    />
  );
}

/* ---------- Section ---------- */

export function Section({
  color,
  className = "",
  id,
  children,
  style,
}: {
  /** cor de fundo da seção (também usada no Scallop) */
  color: string;
  className?: string;
  id?: string;
  children: ReactNode;
  style?: CSSProperties;
}) {
  return (
    <section
      id={id}
      className={`relative py-[88px] max-tab:py-[72px] ${className}`}
      style={{ background: color, ...style }}
    >
      <Scallop color={color} />
      <div className="wrap">{children}</div>
    </section>
  );
}

/* ---------- Marquee ---------- */

export function Marquee({ items }: { items: string[] }) {
  const all = [...items, ...items];
  return (
    <div aria-hidden="true" className="relative overflow-hidden whitespace-nowrap bg-choco py-[18px] text-creme">
      <div className="inline-flex animate-marquee gap-10 font-display text-[30px] motion-reduce:animate-none">
        {all.map((t, i) => (
          <span key={i} className="even:text-manteiga">
            {t}
          </span>
        ))}
      </div>
    </div>
  );
}

/* ---------- Faq ---------- */

export function Faq({ items }: { items: [string, string][] }) {
  return (
    <div className="mx-auto mt-10 grid max-w-[820px] gap-3">
      {items.map(([q, a]) => (
        <details key={q} className="group rounded-[20px] bg-white px-[26px] py-[22px]">
          <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-4 text-[19px] font-bold after:font-display after:text-[28px] after:leading-[.8] after:font-normal after:text-morango after:transition-transform after:duration-200 after:content-['+'] group-open:after:rotate-45 [&::-webkit-details-marker]:hidden">
            {q}
          </summary>
          <p className="mt-3 text-[17px] text-choco-2">{a}</p>
        </details>
      ))}
    </div>
  );
}

/* ---------- MobileBar ---------- */

export function MobileBar({ href, preco }: { href: string; preco: string }) {
  return (
    <div className="fixed inset-x-3 bottom-3 z-40 hidden max-tab:block">
      <Button href={href} size="bar">
        Quero meu pack · R$ {preco}
      </Button>
    </div>
  );
}
