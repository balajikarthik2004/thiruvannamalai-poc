import { memo, type ReactNode } from "react";
import type { LucideIcon } from "lucide-react";

/**
 * Dark control-room primitives.
 *
 * The admin centre deliberately uses its own palette (deep navy panels, light
 * text, traffic-light status) so a trustee can tell at a glance that they are
 * looking at the operations console and not a devotee-facing screen.
 */

export const ADMIN_BG = "#070b1a";
export const PANEL = "bg-[#101936]/80 border border-white/10 backdrop-blur-sm";

export function Panel({
  title,
  icon: Icon,
  action,
  children,
  className = "",
  bodyClassName = "",
}: {
  title?: string;
  icon?: LucideIcon;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
  bodyClassName?: string;
}) {
  return (
    <section className={`${PANEL} rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.35)] ${className}`}>
      {title && (
        <header className="flex items-center justify-between gap-3 px-5 py-3.5 border-b border-white/10">
          <h2 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-slate-200">
            {Icon && <Icon className="w-4 h-4 text-amber-400" />}
            {title}
          </h2>
          {action}
        </header>
      )}
      <div className={`p-5 ${bodyClassName}`}>{children}</div>
    </section>
  );
}

export type StatusTone = "ok" | "warn" | "bad" | "idle" | "info";

const TONE_CLASS: Record<StatusTone, string> = {
  ok: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
  warn: "bg-amber-500/15 text-amber-300 border-amber-500/30",
  bad: "bg-rose-500/15 text-rose-300 border-rose-500/30",
  idle: "bg-slate-500/15 text-slate-300 border-slate-500/30",
  info: "bg-indigo-500/15 text-indigo-300 border-indigo-500/30",
};

const DOT_CLASS: Record<StatusTone, string> = {
  ok: "bg-emerald-400",
  warn: "bg-amber-400",
  bad: "bg-rose-400",
  idle: "bg-slate-400",
  info: "bg-indigo-400",
};

export const StatusPill = memo(function StatusPill({
  tone,
  children,
  pulse = false,
  className = "",
}: {
  tone: StatusTone;
  children: ReactNode;
  pulse?: boolean;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-bold ${TONE_CLASS[tone]} ${className}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${DOT_CLASS[tone]} ${pulse ? "animate-pulse" : ""}`} />
      {children}
    </span>
  );
});

/** Thin progress bar with a tone-driven fill. */
export const Meter = memo(function Meter({
  value,
  max = 100,
  tone = "ok",
  className = "",
  height = "h-1.5",
}: {
  value: number;
  max?: number;
  tone?: StatusTone;
  className?: string;
  height?: string;
}) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100));
  return (
    <div
      className={`w-full ${height} rounded-full bg-white/10 overflow-hidden ${className}`}
      role="progressbar"
      aria-valuenow={Math.round(pct)}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div
        className={`h-full rounded-full transition-[width] duration-700 ${DOT_CLASS[tone]}`}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
});

export const toneForPct = (pct: number): StatusTone =>
  pct >= 95 ? "bad" : pct >= 80 ? "warn" : pct >= 60 ? "info" : "ok";
