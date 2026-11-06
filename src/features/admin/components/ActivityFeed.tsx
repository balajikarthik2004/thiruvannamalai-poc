import { memo, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Radio, AlertTriangle, HeartPulse, Crown, Info, CheckCircle2 } from "lucide-react";
import { activityFeed, type ActivityEvent } from "@/data/operations";
import { Panel, StatusPill } from "./AdminPrimitives";

const KIND_META: Record<ActivityEvent["kind"], { icon: typeof Info; color: string; ring: string; label: string }> = {
  alert: { icon: AlertTriangle, color: "text-rose-400", ring: "border-rose-500/40 bg-rose-500/10", label: "Alert" },
  medical: { icon: HeartPulse, color: "text-orange-400", ring: "border-orange-500/40 bg-orange-500/10", label: "Medical" },
  vip: { icon: Crown, color: "text-amber-400", ring: "border-amber-500/40 bg-amber-500/10", label: "VIP" },
  info: { icon: Info, color: "text-indigo-400", ring: "border-indigo-500/40 bg-indigo-500/10", label: "Info" },
  ok: { icon: CheckCircle2, color: "text-emerald-400", ring: "border-emerald-500/40 bg-emerald-500/10", label: "Routine" },
};

/** Minutes since midnight, for sorting "10:32 AM" style stamps newest-first. */
const toMinutes = (time: string) => {
  const m = /^(\d{1,2}):(\d{2})\s*(AM|PM)$/i.exec(time.trim());
  if (!m) return 0;
  let h = Number(m[1]) % 12;
  if (m[3].toUpperCase() === "PM") h += 12;
  return h * 60 + Number(m[2]);
};

const FILTERS = ["all", "alert", "medical", "vip", "info", "ok"] as const;

export const ActivityFeed = memo(function ActivityFeed({ events = activityFeed }: { events?: ActivityEvent[] }) {
  const { t } = useTranslation();
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("all");

  const sorted = useMemo(
    () => [...events].sort((a, b) => toMinutes(b.time) - toMinutes(a.time)),
    [events]
  );
  const shown = filter === "all" ? sorted : sorted.filter((e) => e.kind === filter);

  return (
    <Panel
      title={t("Recent Activity")}
      icon={Radio}
      action={
        <StatusPill tone="ok" pulse>
          {t("Live")}
        </StatusPill>
      }
      bodyClassName="pt-4"
    >
      <div className="flex gap-1.5 flex-wrap mb-3">
        {FILTERS.map((f) => {
          const count = f === "all" ? sorted.length : sorted.filter((e) => e.kind === f).length;
          if (count === 0 && f !== "all") return null;
          const active = filter === f;
          return (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              aria-pressed={active}
              className={`px-2.5 py-1 rounded-full text-[11px] font-bold border transition-colors ${
                active
                  ? "bg-amber-400 text-[#0b1020] border-amber-400"
                  : "border-white/10 bg-white/5 text-slate-400 hover:text-slate-200 hover:border-white/25"
              }`}
            >
              {f === "all" ? t("All") : t(KIND_META[f].label)} ({count})
            </button>
          );
        })}
      </div>

      <ol className="relative max-h-[22rem] overflow-y-auto pr-1 space-y-2.5">
        {shown.map((e, i) => {
          const meta = KIND_META[e.kind];
          const Icon = meta.icon;
          return (
            <li key={`${e.time}-${i}`} className="flex gap-3">
              <div className="flex flex-col items-center shrink-0">
                <span className={`flex h-7 w-7 items-center justify-center rounded-full border ${meta.ring}`}>
                  <Icon className={`w-3.5 h-3.5 ${meta.color}`} />
                </span>
                {i < shown.length - 1 && <span className="flex-1 w-px bg-white/10 mt-1" />}
              </div>
              <div className="min-w-0 pb-1">
                <div className="flex items-center gap-2">
                  <time className="text-[11px] font-bold tabular-nums text-slate-400">{e.time}</time>
                  <span className={`text-[10px] font-bold uppercase tracking-wider ${meta.color}`}>
                    {t(meta.label)}
                  </span>
                </div>
                <p className="text-[13px] leading-snug text-slate-200 mt-0.5">{t(e.text)}</p>
              </div>
            </li>
          );
        })}
        {shown.length === 0 && (
          <li className="py-8 text-center text-xs text-slate-500">{t("No events of this type today.")}</li>
        )}
      </ol>
    </Panel>
  );
});
