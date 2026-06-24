import type { ReactNode } from "react";

interface PanelProps {
  eyebrow?: string;
  title: string;
  description: string;
  children: ReactNode;
  className?: string;
}

export function Panel({
  eyebrow,
  title,
  description,
  children,
  className = "",
}: PanelProps) {
  return (
    <section
      className={`rounded-[2rem] border border-black/10 bg-white/85 p-8 shadow-[0_24px_80px_rgba(18,18,18,0.12)] backdrop-blur-xl ${className}`}
    >
      <div className="mb-6 space-y-2">
        {eyebrow ? (
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-amber-700">
            {eyebrow}
          </p>
        ) : null}
        <h1 className="text-3xl font-semibold tracking-tight text-slate-950">
          {title}
        </h1>
        <p className="max-w-xl text-sm leading-6 text-slate-600">
          {description}
        </p>
      </div>
      {children}
    </section>
  );
}
