import { useTranslation } from "react-i18next";
import { Link } from "@tanstack/react-router";
import { Users, UserRound, Hourglass, Gauge, CalendarClock, ArrowUp, ArrowDown, CheckCircle2, AlertTriangle, TrendingUp, Lightbulb, CalendarDays, Footprints, ChevronRight, ListChecks, Info } from "lucide-react";
import type { ReactNode } from "react";
import { Area, ComposedChart, Line, ReferenceDot, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from "recharts";
import { AnimatedNumber } from "./AnimatedNumber";
import { formatHour, formatWait, type Level, type LiveZone, type TrendPoint } from "../hooks/useLiveCrowd";

const nf = new Intl.NumberFormat("en-IN");

export function LevelPill({ level }: { level: Level }) {
  const { t: tStr } = useTranslation();
  return (
    <span className="inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-0.5 rounded-full border" style={{ color: "#1f2937", borderColor: `${level.color}66`, background: `${level.color}1f` }}>
      <span className="w-1.5 h-1.5 rounded-full" style={{ background: level.color }} />
      {tStr(level.label)}
    </span>
  );
}

function Panel({ title, icon: Icon, children, className = "", right }: { title: string; icon: typeof Users; children: ReactNode; className?: string; right?: ReactNode }) {
  return (
    <section className={`bg-white border border-rose-100 rounded-3xl p-4 shadow-sm ${className}`}>
      <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-2 mb-3">
        <h2 className="font-serif text-base font-bold text-slate-900 flex items-center gap-2">
          <Icon className="w-5 h-5 text-saffron" /> {title}
        </h2>
        {right}
      </div>
      {children}
    </section>
  );
}

// ---------------------------------------------------------------------------
// KPI row
// ---------------------------------------------------------------------------
interface KpiProps {
  totalToday: number;
  vsTypicalPct: number;
  weekday: string;
  liveCrowd: number;
  occupancy: number;
  avgWait: number;
  waitDelta: number;
  overall: Level;
  statusNote: string;
  peakWindow: string;
  peakIsTomorrow: boolean;
  isClosed?: boolean;
  openTime: string;
}

/** Icon + label on one line, one bold value that never wraps, one footer line. */
function Kpi({ icon: Icon, label, value, footer, className = "" }: { icon: typeof Users; label: string; value: ReactNode; footer: ReactNode; className?: string }) {
  return (
    <div className={`bg-white border border-rose-100 rounded-2xl p-4 shadow-sm min-w-0 flex flex-col gap-2.5 hover:shadow-md hover:border-rose-200 transition-all ${className}`}>
      <div className="flex items-center gap-2 min-w-0">
        <span className="w-8 h-8 rounded-lg bg-rose-50 text-saffron flex items-center justify-center shrink-0">
          <Icon className="w-4 h-4" />
        </span>
        <span className="text-xs font-semibold text-slate-500 truncate" title={label}>{label}</span>
      </div>
      <div className="text-2xl font-black text-slate-900 tabular-nums leading-none whitespace-nowrap truncate">{value}</div>
      <div className="min-h-[22px] flex items-center min-w-0 text-[11px]">{footer}</div>
    </div>
  );
}

/** Small delta chip: good = green, bad = red; arrow + sign so it never relies on colour alone. */
function Delta({ good, up, children }: { good: boolean; up: boolean; children: ReactNode }) {
  return (
    <span className={`inline-flex items-center gap-0.5 font-bold px-1.5 py-0.5 rounded-md shrink-0 ${good ? "bg-emerald-50 text-[#006300]" : "bg-rose-50 text-rose-700"}`}>
      {up ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
      {children}
    </span>
  );
}

const Muted = ({ children }: { children: ReactNode }) => <span className="text-slate-500 truncate">{children}</span>;

export function KpiRow(p: KpiProps) {
  const { t: tStr } = useTranslation();
  const up = p.vsTypicalPct >= 0;
  const waitUp = p.waitDelta > 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 xl:grid-cols-5 gap-3">
      <Kpi
        className="lg:col-span-2 xl:col-span-1"
        icon={Users}
        label={tStr("Total Visitors (Today)")}
        value={<AnimatedNumber value={p.totalToday} format={(n) => nf.format(Math.round(n))} />}
        footer={
          <span className="flex items-center gap-1.5 min-w-0">
            <Delta good={up} up={up}>{Math.abs(p.vsTypicalPct)}%</Delta>
            <Muted><span title={`${tStr("vs. a typical")} ${tStr(p.weekday)}`}>{tStr("vs. typical")} {tStr(p.weekday.slice(0, 3))}</span></Muted>
          </span>
        }
      />

      <Kpi
        className="lg:col-span-2 xl:col-span-1"
        icon={UserRound}
        label={tStr("Current Crowd")}
        value={<AnimatedNumber value={p.liveCrowd} format={(n) => nf.format(Math.round(n))} upIsGood={false} />}
        footer={
          <span className="flex items-center gap-2 w-full min-w-0">
            <span className="flex-1 h-1.5 rounded-full bg-slate-100 overflow-hidden" role="meter" aria-valuenow={p.occupancy} aria-valuemin={0} aria-valuemax={100} aria-label={tStr("Capacity used")}>
              <span className="block h-full rounded-full" style={{ width: `${Math.max(2, p.occupancy)}%`, background: p.overall.color }} />
            </span>
            <span className="text-slate-600 font-semibold tabular-nums shrink-0"><AnimatedNumber value={p.occupancy} format={(n) => `${Math.round(n)}%`} upIsGood={false} /> {tStr("of capacity")}</span>
          </span>
        }
      />

      <Kpi
        className="lg:col-span-2 xl:col-span-1"
        icon={Hourglass}
        label={tStr("Avg. Darshan Wait")}
        value={p.isClosed ? tStr("Closed") : <AnimatedNumber value={Math.round(p.avgWait)} format={(n) => formatWait(n)} upIsGood={false} />}
        footer={
          p.isClosed ? (
            <Muted>{tStr("Reopens at")} <strong className="text-slate-700">{p.openTime}</strong></Muted>
          ) : (
            <span className="flex items-center gap-1.5 min-w-0">
              <Delta good={!waitUp} up={waitUp}>{Math.abs(p.waitDelta)} min</Delta>
              <Muted>{tStr("vs. an hour ago")}</Muted>
            </span>
          )
        }
      />

      <Kpi
        className="lg:col-span-3 xl:col-span-1"
        icon={Gauge}
        label={tStr("Crowd Status")}
        value={
          <span className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full shrink-0" style={{ background: p.overall.color }} aria-hidden />
            {tStr(p.overall.label)}
          </span>
        }
        footer={<Muted><span title={p.statusNote}>{p.statusNote}</span></Muted>}
      />

      <Kpi
        className="sm:col-span-2 lg:col-span-3 xl:col-span-1"
        icon={CalendarClock}
        label={tStr("Peak Expected")}
        value={p.peakWindow}
        footer={
          <span className="flex items-center gap-1.5 min-w-0">
            <span className="font-bold px-1.5 py-0.5 rounded-md bg-rose-50 text-saffron shrink-0">{p.peakIsTomorrow ? tStr("Tomorrow") : tStr("Today")}</span>
            <Muted>{tStr("typical day")}</Muted>
          </span>
        }
      />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Insights + tips
// ---------------------------------------------------------------------------
export function InsightsPanel({ overall, hottest, busyGates, gates, closedNote }: { overall: Level; hottest?: LiveZone; busyGates: LiveZone[]; gates: LiveZone[]; closedNote?: string }) {
  const { t: tStr } = useTranslation();
  const calm = overall.key === "low" || overall.key === "moderate";
  const items: { icon: ReactNode; text: string }[] = [
    ...(closedNote ? [{ icon: <Info className="w-4 h-4 text-slate-500" />, text: closedNote }] : []),
    { icon: calm ? <CheckCircle2 className="w-4 h-4 text-[#0ca30c]" /> : <AlertTriangle className="w-4 h-4 text-[#d03b3b]" />, text: `${tStr("Crowd is")} ${tStr(overall.label)} ${tStr("overall")}` },
  ];
  if (hottest && !closedNote) items.push({ icon: <ArrowUp className="w-4 h-4 text-[#d03b3b]" />, text: `${tStr("Highest crowd at")} ${hottest.name} (${hottest.pct}%)` });
  busyGates.slice(0, 2).forEach((g) => items.push({ icon: <span className="w-3 h-3 rounded-full" style={{ background: g.level.color }} />, text: `${g.name} ${tStr("is busy")} (${g.pct}%)` }));
  if (gates.length > busyGates.length) items.push({ icon: <CheckCircle2 className="w-4 h-4 text-[#0ca30c]" />, text: tStr("Other gates are within limits") });

  return (
    <Panel title={tStr("Real-time Insights")} icon={TrendingUp}>
      <ul className="space-y-2">
        {items.map((it, i) => (
          <li key={i} className="flex items-center gap-2.5 bg-rose-50/50 border border-rose-100/70 rounded-xl px-3 py-2 text-[13px] leading-snug text-slate-700">
            <span className="w-4 flex justify-center shrink-0">{it.icon}</span>
            {it.text}
          </li>
        ))}
      </ul>
    </Panel>
  );
}

export function TipsPanel({ slug, bestWindow, quietestGate, nextEvent, onSelectZone }: { slug: string; bestWindow: string | null; quietestGate?: LiveZone; nextEvent?: { title: string; date: string }; onSelectZone: (id: string) => void }) {
  const { t: tStr } = useTranslation();
  const row = "w-full flex items-center gap-2.5 rounded-xl px-2.5 py-2 text-left text-[13px] leading-snug text-slate-700 hover:bg-rose-50 transition-colors";
  return (
    <Panel title={tStr("Tips for Devotees")} icon={Lightbulb}>
      <div className="space-y-1">
        {bestWindow && (
          <Link to="/booking/$slug" params={{ slug }} className={row}>
            <CalendarDays className="w-4 h-4 text-saffron shrink-0" />
            <span className="flex-1">{tStr("Best time for shorter queues:")} <strong className="text-slate-900">{bestWindow}</strong></span>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </Link>
        )}
        {quietestGate && (
          <button type="button" onClick={() => onSelectZone(quietestGate.id)} className={row}>
            <Footprints className="w-4 h-4 text-saffron shrink-0" />
            <span className="flex-1">{tStr("Use")} <strong className="text-slate-900">{quietestGate.name}</strong> {tStr("for quicker entry")}</span>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </button>
        )}
        {nextEvent && (
          <Link to="/booking/$slug" params={{ slug }} className={row}>
            <Users className="w-4 h-4 text-saffron shrink-0" />
            <span className="flex-1">{tStr("Expect higher crowd during")} <strong className="text-slate-900">{tStr(nextEvent.title)}</strong> ({tStr(nextEvent.date)})</span>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </Link>
        )}
      </div>
    </Panel>
  );
}

// ---------------------------------------------------------------------------
// Gate-wise table
// ---------------------------------------------------------------------------
export function GateTable({ zones, selectedId, onSelect, isClosed }: { zones: LiveZone[]; selectedId: string | null; onSelect: (id: string) => void; isClosed?: boolean }) {
  const { t: tStr } = useTranslation();
  return (
    <Panel title={tStr("Gate-wise Crowd Details")} icon={ListChecks}>
      <div className="overflow-x-auto -mx-2">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs text-slate-500 border-b border-rose-100">
              <th className="font-semibold py-2 px-2">{tStr("Gate / Area")}</th>
              <th className="font-semibold py-2 px-2">{tStr("Crowd Level")}</th>
              <th className="font-semibold py-2 px-2 text-right">{tStr("Current Load")}</th>
              <th className="font-semibold py-2 px-2 text-right">{tStr("Est. Wait Time")}</th>
              <th className="py-2 px-2 w-6"><span className="sr-only">{tStr("Show on map")}</span></th>
            </tr>
          </thead>
          <tbody>
            {zones.map((z) => (
              <tr
                key={z.id}
                onClick={() => onSelect(z.id)}
                className={`border-b border-rose-50 last:border-0 cursor-pointer transition-colors ${selectedId === z.id ? "bg-rose-50" : "hover:bg-rose-50/50"}`}
              >
                <td className="py-2.5 px-2 font-medium text-slate-800">{z.name}</td>
                <td className="py-2.5 px-2"><LevelPill level={z.level} /></td>
                <td className="py-2.5 px-2 text-right tabular-nums text-slate-800">{z.pct}%</td>
                <td className="py-2.5 px-2 text-right tabular-nums text-slate-800">{z.waitMin > 0 && !isClosed ? formatWait(z.waitMin) : "—"}</td>
                <td className="py-2.5 px-2">
                  <button type="button" onClick={(e) => { e.stopPropagation(); onSelect(z.id); }} aria-label={`${tStr("Show on map")}: ${z.name}`} className="text-slate-400 hover:text-saffron">
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Panel>
  );
}

// ---------------------------------------------------------------------------
// Crowd trend
// ---------------------------------------------------------------------------
const CURRENT = "#e32c26";
const TYPICAL = "#64748b";
/** Semi-transparent violet for the "same time last week" overlay. */
const HISTORICAL = "#8b5cf6";

function TrendTooltip({ active, payload }: any) {
  const { t: tStr } = useTranslation();
  if (!active || !payload?.length) return null;
  const p: TrendPoint = payload[0].payload;
  return (
    <div className="bg-slate-900 text-white rounded-lg px-3 py-2 text-xs shadow-lg">
      <div className="font-bold mb-1">{formatHour(p.h)}</div>
      {p.current !== undefined && (
        <div className="flex items-center gap-2"><span className="w-3 h-0.5" style={{ background: CURRENT }} />{tStr("Current")}: <strong className="tabular-nums">{nf.format(p.current)}</strong></div>
      )}
      <div className="flex items-center gap-2"><span className="w-3 border-t border-dashed" style={{ borderColor: "#cbd5e1" }} />{tStr("Typical")}: <strong className="tabular-nums">{nf.format(p.typical)}</strong></div>
    </div>
  );
}

export function CrowdTrendChart({ trend, nowH, liveCrowd, showHistorical = false }: { trend: TrendPoint[]; nowH: number; liveCrowd: number; showHistorical?: boolean }) {
  const { t: tStr } = useTranslation();
  const ticks = [6, 10, 14, 18, 22];
  // Round y-axis steps (5K for big temples, 1K for small ones).
  const maxY = Math.max(...trend.map((p) => Math.max(p.typical, p.current ?? 0, showHistorical ? p.lastWeek : 0)));
  const step = maxY > 10000 ? 5000 : maxY > 2000 ? 1000 : 200;
  const yTicks = Array.from({ length: Math.ceil(maxY / step) + 1 }, (_, i) => i * step);
  return (
    <Panel
      className="xl:flex-1 xl:flex xl:flex-col"
      title={tStr("Crowd Trend (Today)")}
      icon={TrendingUp}
      right={
        <div className="flex items-center gap-4 text-xs text-slate-600">
          <span className="flex items-center gap-1.5"><span className="w-4 h-0.5 rounded" style={{ background: CURRENT }} />{tStr("Current")}</span>
          <span className="flex items-center gap-1.5"><span className="w-4 border-t-2 border-dashed" style={{ borderColor: TYPICAL }} />{tStr("Typical day")}</span>
          {showHistorical && (
            <span className="flex items-center gap-1.5"><span className="w-4 h-0.5 rounded" style={{ background: HISTORICAL }} />{tStr("Last week")}</span>
          )}
        </div>
      }
    >
      <div className="h-[260px] xl:h-auto xl:flex-1 xl:min-h-[260px]" role="img" aria-label={`${tStr("Crowd trend today")}: ${nf.format(liveCrowd)} ${tStr("devotees at")} ${formatHour(nowH)}`}>
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={trend} margin={{ top: 28, right: 12, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="trend-fill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={CURRENT} stopOpacity={0.22} />
                <stop offset="100%" stopColor={CURRENT} stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} stroke="#f1f5f9" />
            <XAxis dataKey="h" type="number" domain={[6, 22]} ticks={ticks} tickFormatter={(h) => formatHour(h)} tick={{ fontSize: 11, fill: "#64748b" }} axisLine={{ stroke: "#e2e8f0" }} tickLine={false} />
            <YAxis domain={[0, yTicks[yTicks.length - 1]]} ticks={yTicks} tickFormatter={(v) => (v >= 1000 ? `${Math.round(v / 1000)}K` : String(v))} tick={{ fontSize: 11, fill: "#64748b" }} axisLine={false} tickLine={false} width={40} />
            <Tooltip content={<TrendTooltip />} cursor={{ stroke: "#94a3b8", strokeDasharray: "3 3" }} />
            {showHistorical && (
              <Area dataKey="lastWeek" type="monotone" stroke={HISTORICAL} strokeWidth={1.75} fill={HISTORICAL} fillOpacity={0.1} dot={false} activeDot={{ r: 4, stroke: "#fff", strokeWidth: 2 }} isAnimationActive={false} />
            )}
            <Line dataKey="typical" type="monotone" stroke={TYPICAL} strokeWidth={2} strokeDasharray="6 5" dot={false} activeDot={{ r: 4, stroke: "#fff", strokeWidth: 2 }} isAnimationActive={false} />
            <Area dataKey="current" type="monotone" stroke={CURRENT} strokeWidth={2} fill="url(#trend-fill)" dot={false} activeDot={{ r: 5, stroke: "#fff", strokeWidth: 2 }} connectNulls={false} isAnimationActive={false} />
            <ReferenceLine x={nowH} stroke={CURRENT} strokeDasharray="3 3" strokeOpacity={0.6} />
            <ReferenceDot
              x={nowH}
              y={liveCrowd}
              r={5}
              fill={CURRENT}
              stroke="#fff"
              strokeWidth={2}
              label={{ value: `${formatHour(nowH)} · ${nf.format(liveCrowd)}`, position: nowH > 19 ? "left" : "top", fontSize: 11, fontWeight: 700, fill: "#0f172a", offset: 10 }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </Panel>
  );
}
