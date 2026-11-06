import { memo, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Siren,
  ChevronDown,
  Radio,
  DoorOpen,
  DoorClosed,
  ShieldAlert,
  History,
  Send,
} from "lucide-react";
import { toast } from "sonner";
import {
  ALERT_TYPES,
  ALERT_SEVERITIES,
  ALERT_TEMPLATES,
  ALERT_ZONES,
  BROADCAST_CHANNELS,
  pastAlerts,
  gateStats,
  type AlertType,
  type AlertSeverity,
  type PastAlert,
} from "@/data/operations";
import { Panel, StatusPill } from "./AdminPrimitives";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const SEVERITY_TONE: Record<AlertSeverity, "ok" | "info" | "warn" | "bad"> = {
  Low: "ok",
  Medium: "info",
  High: "warn",
  Critical: "bad",
};

/**
 * Emergency broadcast console.
 *
 * Nothing here reaches a real channel — this is the demo surface that shows
 * trustees how a stampede-risk or medical broadcast would be composed, scoped
 * to zones and pushed to app / SMS / PA / signage in one action.
 */
export const EmergencyControl = memo(function EmergencyControl() {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);

  const [type, setType] = useState<AlertType>("Stampede Risk");
  const [severity, setSeverity] = useState<AlertSeverity>("High");
  const [zones, setZones] = useState<string[]>(["East Rajagopuram"]);
  const [channels, setChannels] = useState<string[]>(["App Push Notification", "PA System"]);
  const [message, setMessage] = useState(ALERT_TEMPLATES["Stampede Risk"]);
  const [messageEdited, setMessageEdited] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [log, setLog] = useState<PastAlert[]>(pastAlerts);

  // Gate open/closed state is local so the demo can toggle it live.
  const [gateOpen, setGateOpen] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(gateStats.map((g) => [g.id, g.open]))
  );

  // Swapping the alert type swaps in its template, unless the operator has
  // already typed their own wording.
  useEffect(() => {
    if (!messageEdited) setMessage(ALERT_TEMPLATES[type]);
  }, [type, messageEdited]);

  const toggle = (list: string[], set: (v: string[]) => void, value: string) =>
    set(list.includes(value) ? list.filter((v) => v !== value) : [...list, value]);

  const canBroadcast = zones.length > 0 && channels.length > 0 && message.trim().length > 0;

  const reach = useMemo(
    () => BROADCAST_CHANNELS.filter((c) => channels.includes(c.label)).map((c) => c.reach).join(" · "),
    [channels]
  );

  const broadcast = () => {
    const now = new Date();
    const entry: PastAlert = {
      id: `ALT-${now.getFullYear()}-${String(Math.floor(Math.random() * 9000) + 1000)}`,
      time: now.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true }),
      date: "Today",
      type,
      severity,
      zones: [...zones],
      channels: [...channels],
      status: "Active",
    };
    setLog((prev) => [entry, ...prev]);
    setConfirming(false);
    toast.error(`${t("Emergency broadcast sent")} — ${t(type)}`, {
      description: `${zones.length} ${t("zones")} · ${channels.length} ${t("channels")} · ${entry.id}`,
      icon: <Siren className="w-4 h-4" />,
      duration: 6000,
    });
  };

  const toggleGate = (id: string, name: string) => {
    setGateOpen((prev) => {
      const next = !prev[id];
      toast[next ? "success" : "warning"](
        `${t(name)} — ${next ? t("Opened") : t("Closed")}`,
        { description: t("Gate control command sent to the turnstile controller.") }
      );
      return { ...prev, [id]: next };
    });
  };

  return (
    <Panel
      className="border-rose-500/30"
      title={t("Emergency Control")}
      icon={ShieldAlert}
      action={
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          className="inline-flex items-center gap-1.5 text-[11px] font-bold text-slate-300 hover:text-white px-2.5 py-1 rounded-full border border-white/10 bg-white/5 transition-colors"
        >
          {open ? t("Collapse") : t("Expand")}
          <ChevronDown className={`w-3.5 h-3.5 transition-transform ${open ? "rotate-180" : ""}`} />
        </button>
      }
    >
      {/* The big red button is always visible; the composer expands below it. */}
      <button
        type="button"
        onClick={() => {
          setOpen(true);
          setConfirming(true);
        }}
        className="group w-full rounded-2xl bg-gradient-to-r from-rose-700 via-rose-600 to-red-600 px-5 py-4 text-left shadow-[0_10px_40px_rgba(225,29,72,0.35)] hover:brightness-110 active:scale-[0.99] transition-all"
      >
        <span className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white/15 ring-2 ring-white/25 shrink-0">
            <Siren className="w-6 h-6 text-white animate-pulse" />
          </span>
          <span className="min-w-0">
            <span className="block text-base font-black uppercase tracking-wider text-white leading-tight">
              {t("Emergency Broadcast")}
            </span>
            <span className="block text-[11px] text-white/80 leading-snug mt-0.5">
              {t("Push an alert to every devotee handset, PA zone and display board.")}
            </span>
          </span>
        </span>
      </button>

      {open && (
        <div className="mt-5 space-y-5">
          {/* Composer */}
          <div className="grid gap-4 lg:grid-cols-2">
            <div className="space-y-4">
              <Field label={t("Alert type")}>
                <select
                  value={type}
                  onChange={(e) => {
                    setType(e.target.value as AlertType);
                    setMessageEdited(false);
                  }}
                  className="w-full h-10 rounded-xl border border-white/15 bg-[#0b1226] px-3 text-sm text-slate-100 outline-none focus:border-amber-400/60 focus:ring-2 focus:ring-amber-400/20"
                >
                  {ALERT_TYPES.map((a) => (
                    <option key={a} value={a} className="bg-[#0b1226]">
                      {t(a)}
                    </option>
                  ))}
                </select>
              </Field>

              <Field label={t("Severity")}>
                <div className="grid grid-cols-4 gap-1.5">
                  {ALERT_SEVERITIES.map((s) => {
                    const active = severity === s;
                    const colors: Record<AlertSeverity, string> = {
                      Low: "border-emerald-500/50 bg-emerald-500/20 text-emerald-200",
                      Medium: "border-indigo-500/50 bg-indigo-500/20 text-indigo-200",
                      High: "border-amber-500/50 bg-amber-500/20 text-amber-200",
                      Critical: "border-rose-500/60 bg-rose-500/25 text-rose-200",
                    };
                    return (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setSeverity(s)}
                        aria-pressed={active}
                        className={`h-9 rounded-lg border text-[11px] font-bold transition-all ${
                          active
                            ? colors[s]
                            : "border-white/10 bg-white/5 text-slate-400 hover:text-slate-200"
                        }`}
                      >
                        {t(s)}
                      </button>
                    );
                  })}
                </div>
              </Field>

              <Field label={`${t("Affected zones")} (${zones.length})`}>
                <div className="max-h-36 overflow-y-auto rounded-xl border border-white/10 bg-[#0b1226] p-2 grid grid-cols-1 sm:grid-cols-2 gap-1">
                  {ALERT_ZONES.map((z) => (
                    <label
                      key={z}
                      className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-[12px] text-slate-300 hover:bg-white/5 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={zones.includes(z)}
                        onChange={() => toggle(zones, setZones, z)}
                        className="h-3.5 w-3.5 rounded border-white/30 bg-transparent accent-amber-400"
                      />
                      <span className="truncate">{t(z)}</span>
                    </label>
                  ))}
                </div>
              </Field>
            </div>

            <div className="space-y-4">
              <Field
                label={t("Message")}
                hint={messageEdited ? t("Edited") : t("Template for this alert type")}
              >
                <textarea
                  value={message}
                  onChange={(e) => {
                    setMessage(e.target.value);
                    setMessageEdited(true);
                  }}
                  rows={6}
                  className="w-full rounded-xl border border-white/15 bg-[#0b1226] p-3 text-[13px] leading-relaxed text-slate-100 outline-none resize-none focus:border-amber-400/60 focus:ring-2 focus:ring-amber-400/20"
                />
                <div className="flex items-center justify-between mt-1.5">
                  <span className="text-[11px] text-slate-500">
                    {message.length} {t("characters")} · {Math.ceil(message.length / 160)} SMS
                  </span>
                  {messageEdited && (
                    <button
                      type="button"
                      onClick={() => {
                        setMessage(ALERT_TEMPLATES[type]);
                        setMessageEdited(false);
                      }}
                      className="text-[11px] font-bold text-amber-400 hover:text-amber-300"
                    >
                      {t("Reset to template")}
                    </button>
                  )}
                </div>
              </Field>

              <Field label={`${t("Broadcast channels")} (${channels.length})`}>
                <div className="grid grid-cols-2 gap-1.5">
                  {BROADCAST_CHANNELS.map((c) => {
                    const active = channels.includes(c.label);
                    return (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => toggle(channels, setChannels, c.label)}
                        aria-pressed={active}
                        className={`rounded-xl border px-3 py-2 text-left transition-all ${
                          active
                            ? "border-amber-400/60 bg-amber-400/15"
                            : "border-white/10 bg-white/5 hover:border-white/25"
                        }`}
                      >
                        <span className={`block text-[11px] font-bold ${active ? "text-amber-200" : "text-slate-300"}`}>
                          {t(c.label)}
                        </span>
                        <span className="block text-[10px] text-slate-500 mt-0.5">{c.reach}</span>
                      </button>
                    );
                  })}
                </div>
              </Field>

              <button
                type="button"
                disabled={!canBroadcast}
                onClick={() => setConfirming(true)}
                className="w-full h-11 rounded-xl bg-rose-600 text-sm font-black uppercase tracking-wider text-white shadow-lg shadow-rose-900/40 hover:bg-rose-500 disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.99] transition-all inline-flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" /> {t("Broadcast now")}
              </button>
            </div>
          </div>

          {/* Gate control */}
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <h3 className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-300 mb-3">
              <DoorOpen className="w-4 h-4 text-amber-400" /> {t("Gate Control")}
            </h3>
            <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
              {gateStats.map((g) => {
                const isOpen = gateOpen[g.id];
                return (
                  <div
                    key={g.id}
                    className="flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-[#0b1226] px-3 py-2.5"
                  >
                    <div className="min-w-0">
                      <div className="text-xs font-semibold text-slate-100 truncate">{t(g.shortName)}</div>
                      <div className="text-[10px] text-slate-500">{t(g.direction)}</div>
                    </div>
                    <button
                      type="button"
                      onClick={() => toggleGate(g.id, g.name)}
                      className={`shrink-0 inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-bold transition-colors ${
                        isOpen
                          ? "bg-emerald-500/20 text-emerald-300 hover:bg-rose-500/20 hover:text-rose-300"
                          : "bg-rose-500/20 text-rose-300 hover:bg-emerald-500/20 hover:text-emerald-300"
                      }`}
                    >
                      {isOpen ? <DoorOpen className="w-3.5 h-3.5" /> : <DoorClosed className="w-3.5 h-3.5" />}
                      {isOpen ? t("Close") : t("Open")}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Alert log */}
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <h3 className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-300 mb-3">
              <History className="w-4 h-4 text-amber-400" /> {t("Recent Alerts")}
            </h3>
            <ul className="space-y-2 max-h-56 overflow-y-auto pr-1">
              {log.map((a) => (
                <li
                  key={a.id}
                  className="rounded-xl border border-white/10 bg-[#0b1226] px-3 py-2.5"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-bold text-slate-100">{t(a.type)}</span>
                        <StatusPill tone={SEVERITY_TONE[a.severity]} className="!px-2 !py-0.5">
                          {t(a.severity)}
                        </StatusPill>
                      </div>
                      <div className="text-[11px] text-slate-500 mt-1 truncate">
                        {a.zones.map((z) => t(z)).join(", ")}
                      </div>
                      <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                        {a.channels.map((c) => (
                          <span
                            key={c}
                            className="inline-flex items-center gap-1 text-[10px] text-slate-400 bg-white/5 rounded px-1.5 py-0.5"
                          >
                            <Radio className="w-2.5 h-2.5" /> {t(c)}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="text-[11px] font-bold tabular-nums text-slate-300">{a.time}</div>
                      <div className="text-[10px] text-slate-500">{t(a.date)}</div>
                      <StatusPill
                        tone={a.status === "Resolved" ? "ok" : a.status === "Active" ? "bad" : "warn"}
                        className="mt-1 !px-2 !py-0.5"
                        pulse={a.status === "Active"}
                      >
                        {t(a.status)}
                      </StatusPill>
                    </div>
                  </div>
                  <div className="text-[10px] font-mono text-slate-600 mt-1.5">{a.id}</div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      <AlertDialog open={confirming} onOpenChange={setConfirming}>
        <AlertDialogContent className="border-rose-500/40">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-rose-600">
              <Siren className="w-5 h-5" /> {t("Confirm emergency broadcast")}
            </AlertDialogTitle>
            <AlertDialogDescription asChild>
              <div className="space-y-3 text-left">
                <p>
                  {t("This sends an immediate alert. It cannot be recalled once dispatched.")}
                </p>
                <dl className="rounded-xl border border-border bg-muted/40 p-3 text-xs space-y-1.5">
                  <Row label={t("Type")} value={`${t(type)} · ${t(severity)}`} />
                  <Row label={t("Zones")} value={zones.map((z) => t(z)).join(", ") || "—"} />
                  <Row label={t("Channels")} value={channels.map((c) => t(c)).join(", ") || "—"} />
                  <Row label={t("Estimated reach")} value={reach || "—"} />
                </dl>
                <p className="rounded-lg bg-muted/60 p-2.5 text-xs italic leading-relaxed">
                  “{message}”
                </p>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("Cancel")}</AlertDialogCancel>
            <AlertDialogAction
              onClick={broadcast}
              disabled={!canBroadcast}
              className="bg-rose-600 hover:bg-rose-700"
            >
              {t("Send broadcast")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Panel>
  );
});

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="flex items-baseline justify-between gap-2 mb-1.5">
        <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400">{label}</label>
        {hint && <span className="text-[10px] text-slate-500">{hint}</span>}
      </div>
      {children}
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-3">
      <dt className="w-28 shrink-0 font-semibold text-muted-foreground">{label}</dt>
      <dd className="min-w-0 font-medium">{value}</dd>
    </div>
  );
}
