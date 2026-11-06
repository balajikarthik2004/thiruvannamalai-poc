import { memo, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import QRCode from "react-qr-code";
import {
  ScanLine,
  CheckCircle2,
  ShieldCheck,
  Users,
  CalendarDays,
  Clock,
  Ticket as TicketIcon,
  Smartphone,
  RefreshCw,
} from "lucide-react";

/** Everything the gate scanner reads out of the QR code. */
export interface TicketPayload {
  v: 1;
  id: string;
  name: string;
  temple: string;
  templeSlug: string;
  date: string;
  slot: string;
  persons: number;
  darshan: string;
  issued: string;
}

export const buildPayload = (p: Omit<TicketPayload, "v">): TicketPayload => ({ v: 1, ...p });

/** Compact, scanner-friendly encoding: pipe-delimited, no whitespace. */
export const encodePayload = (p: TicketPayload) =>
  [
    "OMG1",
    p.id,
    p.templeSlug,
    p.date,
    p.slot.replace(/\s+/g, ""),
    String(p.persons),
    p.darshan.replace(/\s+/g, "-"),
    p.name.toUpperCase().replace(/\s+/g, "-"),
  ].join("|");

/**
 * The devotee's e-ticket QR, plus a simulated view of what the gate terminal
 * sees when it is scanned. Nothing is transmitted — the "scan" is a local
 * animation over the same payload the QR encodes.
 */
export const QrTicket = memo(function QrTicket({
  payload,
  size = 112,
}: {
  payload: TicketPayload;
  size?: number;
}) {
  const { t } = useTranslation();
  const [scanned, setScanned] = useState(false);
  const [scanning, setScanning] = useState(false);

  const encoded = useMemo(() => encodePayload(payload), [payload]);

  const runScan = () => {
    if (scanning) return;
    setScanning(true);
    setScanned(false);
    window.setTimeout(() => {
      setScanning(false);
      setScanned(true);
    }, 1400);
  };

  return (
    <div className="grid sm:grid-cols-2 gap-4">
      {/* The devotee's code */}
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white p-4">
        <div className="bg-white p-2.5 rounded-xl shadow-sm border border-slate-100">
          <QRCode value={encoded} size={size} fgColor="#1e293b" level="M" />
        </div>
        <div className="font-mono text-[11px] font-bold tracking-widest text-slate-500 mt-3">
          {payload.id}
        </div>
        <p className="mt-2 text-center text-[11px] leading-snug text-slate-500">
          {t("Show this code at the gate scanner. It works offline.")}
        </p>
        <button
          type="button"
          onClick={runScan}
          className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-slate-300 px-3 py-1.5 text-[11px] font-bold text-slate-700 hover:border-saffron hover:text-saffron transition-colors"
        >
          {scanned ? <RefreshCw className="w-3.5 h-3.5" /> : <ScanLine className="w-3.5 h-3.5" />}
          {scanned ? t("Scan again") : t("Simulate gate scan")}
        </button>
      </div>

      {/* Gate terminal preview */}
      <div className="relative overflow-hidden rounded-2xl bg-[#0b1226] p-4 text-left">
        <div className="flex items-center justify-between gap-2 border-b border-white/10 pb-2.5">
          <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
            <Smartphone className="w-3.5 h-3.5" /> {t("Gate terminal")}
          </span>
          <span className="text-[10px] font-mono text-slate-500">EAST-LANE-1</span>
        </div>

        {scanning && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-[#0b1226]/95">
            <ScanLine className="w-8 h-8 text-emerald-400 animate-pulse" />
            <div className="mt-3 h-0.5 w-32 overflow-hidden rounded-full bg-white/10">
              <div className="h-full w-1/3 animate-[ping_1s_ease-in-out_infinite] rounded-full bg-emerald-400" />
            </div>
            <p className="mt-3 text-[11px] font-semibold text-slate-400">{t("Reading QR…")}</p>
          </div>
        )}

        {scanned ? (
          <div className="pt-3 animate-in fade-in zoom-in-95 duration-300">
            <div className="flex items-center gap-2 rounded-lg bg-emerald-500/15 border border-emerald-500/30 px-3 py-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              <div className="min-w-0">
                <div className="text-xs font-black uppercase tracking-wider text-emerald-300">
                  {t("Entry granted")}
                </div>
                <div className="text-[10px] text-emerald-400/80">
                  {t("Verified in")} 2.1s · {t("Scanner")} #1
                </div>
              </div>
            </div>
            <dl className="mt-3 space-y-1.5">
              <ScanRow icon={TicketIcon} label={t("Booking")} value={payload.id} mono />
              <ScanRow icon={ShieldCheck} label={t("Devotee")} value={payload.name || "—"} />
              <ScanRow icon={CalendarDays} label={t("Date")} value={payload.date} />
              <ScanRow icon={Clock} label={t("Slot")} value={payload.slot} />
              <ScanRow icon={Users} label={t("Persons")} value={String(payload.persons)} />
              <ScanRow icon={TicketIcon} label={t("Darshan")} value={payload.darshan} />
            </dl>
          </div>
        ) : (
          <div className="pt-6 pb-4 text-center">
            <ScanLine className="mx-auto w-8 h-8 text-slate-600" />
            <p className="mt-2 text-[11px] text-slate-500 leading-relaxed px-2">
              {t("Waiting for a QR code. Press “Simulate gate scan” to see what the volunteer at the turnstile reads.")}
            </p>
          </div>
        )}
      </div>
    </div>
  );
});

function ScanRow({
  icon: Icon,
  label,
  value,
  mono = false,
}: {
  icon: typeof Users;
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="flex items-center gap-2 text-[11px]">
      <Icon className="w-3 h-3 shrink-0 text-slate-500" />
      <dt className="w-16 shrink-0 text-slate-500">{label}</dt>
      <dd className={`min-w-0 truncate font-semibold text-slate-200 ${mono ? "font-mono" : ""}`}>
        {value}
      </dd>
    </div>
  );
}
