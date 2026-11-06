import { Suspense, type ReactNode } from "react";

/**
 * Suspense boundary for below-the-fold panels that are code-split.
 *
 * Charts pull in the whole Recharts/d3 bundle, so every page that showed one
 * had to download it before becoming interactive. Wrapping those panels in
 * `React.lazy` + this boundary lets the page paint first and stream the chart
 * in behind a skeleton.
 */
export function LazyPanel({
  children,
  height = "h-72",
  dark = false,
  label,
}: {
  children: ReactNode;
  /** Tailwind height class matching the real panel, to avoid layout shift. */
  height?: string;
  dark?: boolean;
  label?: string;
}) {
  return <Suspense fallback={<PanelSkeleton height={height} dark={dark} label={label} />}>{children}</Suspense>;
}

export function PanelSkeleton({
  height = "h-72",
  dark = false,
  label,
}: {
  height?: string;
  dark?: boolean;
  label?: string;
}) {
  const shell = dark
    ? "bg-[#101936]/80 border-white/10"
    : "bg-white border-rose-100";
  const bar = dark ? "bg-white/10" : "bg-slate-100";

  return (
    <div
      className={`${height} w-full rounded-3xl border ${shell} p-5 animate-pulse`}
      role="status"
      aria-busy="true"
      aria-label={label ?? "Loading"}
    >
      <div className={`h-4 w-40 rounded-full ${bar}`} />
      <div className={`mt-2 h-3 w-24 rounded-full ${bar}`} />
      <div className="mt-6 flex items-end gap-2 h-1/2">
        {[55, 80, 42, 95, 68, 74, 50].map((h, i) => (
          <div key={i} className={`flex-1 rounded-t-lg ${bar}`} style={{ height: `${h}%` }} />
        ))}
      </div>
    </div>
  );
}
