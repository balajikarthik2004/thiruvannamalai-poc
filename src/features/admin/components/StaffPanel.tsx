import { memo } from "react";
import { useTranslation } from "react-i18next";
import { Users, Megaphone, LifeBuoy, ClipboardList, CheckCircle2, Loader2, Clock } from "lucide-react";
import { toast } from "sonner";
import { shifts, zoneDeployment, volunteerSummary } from "@/data/operations";
import { Panel, StatusPill, Meter, toneForPct } from "./AdminPrimitives";

const SHIFT_ICON = {
  done: CheckCircle2,
  active: Loader2,
  upcoming: Clock,
} as const;

export const StaffPanel = memo(function StaffPanel() {
  const { t } = useTranslation();

  const totalAssigned = zoneDeployment.reduce((s, z) => s + z.assigned, 0);
  const totalPresent = zoneDeployment.reduce((s, z) => s + z.present, 0);
  const fillPct = Math.round((totalPresent / totalAssigned) * 100);

  const quickActions = [
    {
      label: t("Send Alert"),
      icon: Megaphone,
      run: () =>
        toast.success(t("Alert sent to all on-duty volunteers"), {
          description: t("Delivered to 118 handsets on the afternoon shift."),
        }),
    },
    {
      label: t("Request Backup"),
      icon: LifeBuoy,
      run: () =>
        toast.info(t("Backup requested"), {
          description: t("HR&CE district office notified — 20 reserve volunteers on standby."),
        }),
    },
    {
      label: t("Log Incident"),
      icon: ClipboardList,
      run: () =>
        toast.success(t("Incident log opened"), {
          description: t("A new incident reference has been reserved for this shift."),
        }),
    },
  ];

  return (
    <Panel
      title={t("Staff & Volunteers")}
      icon={Users}
      action={
        <StatusPill tone={fillPct >= 90 ? "ok" : "warn"}>
          {volunteerSummary.deployed}/{volunteerSummary.sanctioned} {t("deployed")}
        </StatusPill>
      }
    >
      {/* Shift status */}
      <div className="grid gap-2 sm:grid-cols-3 mb-5">
        {shifts.map((s) => {
          const Icon = SHIFT_ICON[s.status];
          const tone = s.status === "active" ? "ok" : s.status === "done" ? "idle" : "info";
          return (
            <div
              key={s.id}
              className={`rounded-xl border p-3 ${
                s.status === "active"
                  ? "border-emerald-500/40 bg-emerald-500/10"
                  : "border-white/10 bg-white/5"
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-bold text-slate-100">{t(s.name)}</span>
                <Icon
                  className={`w-3.5 h-3.5 shrink-0 ${
                    s.status === "active" ? "text-emerald-400 animate-spin" : "text-slate-400"
                  }`}
                />
              </div>
              <div className="text-[11px] text-slate-400 mt-0.5">{s.window}</div>
              <div className="mt-2 flex items-center justify-between">
                <StatusPill tone={tone} className="!px-2 !py-0.5">
                  {s.status === "active" ? t("Active") : s.status === "done" ? t("Completed") : t("Upcoming")}
                </StatusPill>
                <span className="text-xs font-bold text-slate-200 tabular-nums">{s.strength}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Zone deployment */}
      <div className="overflow-x-auto -mx-5 px-5">
        <table className="w-full min-w-[420px] text-sm border-collapse">
          <thead>
            <tr className="text-[10px] uppercase tracking-wider text-slate-400 border-b border-white/10">
              <th className="text-left font-bold pb-2">{t("Zone")}</th>
              <th className="text-right font-bold pb-2">{t("Assigned")}</th>
              <th className="text-right font-bold pb-2">{t("Present")}</th>
              <th className="text-right font-bold pb-2">{t("Gap")}</th>
              <th className="text-right font-bold pb-2 w-24">{t("Fill")}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {zoneDeployment.map((z) => {
              const gap = z.assigned - z.present;
              const pct = Math.round((z.present / z.assigned) * 100);
              // A staffing shortfall is the inverse of a crowd percentage.
              const tone = toneForPct(100 - pct);
              return (
                <tr key={z.zone} className="hover:bg-white/5 transition-colors">
                  <td className="py-2 pr-3 font-semibold text-slate-100">{t(z.zone)}</td>
                  <td className="py-2 text-right tabular-nums text-slate-400">{z.assigned}</td>
                  <td className="py-2 text-right tabular-nums text-slate-200">{z.present}</td>
                  <td
                    className={`py-2 text-right tabular-nums font-bold ${
                      gap === 0 ? "text-emerald-400" : gap >= 5 ? "text-rose-400" : "text-amber-400"
                    }`}
                  >
                    {gap === 0 ? "—" : `-${gap}`}
                  </td>
                  <td className="py-2 pl-3">
                    <div className="flex items-center justify-end gap-2">
                      <span className="text-[11px] tabular-nums text-slate-400">{pct}%</span>
                      <Meter value={pct} tone={tone} className="w-12" />
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-5 pt-4 border-t border-white/10">
        {quickActions.map(({ label, icon: Icon, run }) => (
          <button
            key={label}
            type="button"
            onClick={run}
            className="inline-flex items-center justify-center gap-2 h-10 rounded-xl border border-white/15 bg-white/5 text-xs font-bold text-slate-200 hover:bg-white/10 hover:border-white/25 active:scale-[0.98] transition-all"
          >
            <Icon className="w-4 h-4 text-amber-400" />
            {label}
          </button>
        ))}
      </div>
    </Panel>
  );
});
