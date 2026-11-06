import { useTranslation } from "react-i18next";
import { ClipboardList } from "lucide-react";
import { format } from "date-fns";
import type { BookingCart } from "../constants";
import { computeBookingTotals, formatINR } from "../utils/totals";

interface Props {
  cart: BookingCart;
  details: { categoryId: string; persons: number };
  visitDate: Date | null;
  visitTime: string;
}

/** Sticky sidebar on the Select Services step — subtotal updates live as services are toggled. */
export function BookingCartSummary({ cart, details, visitDate, visitTime }: Props) {
  const { t: tStr } = useTranslation();
  const { category, darshan, services, total } = computeBookingTotals(cart, details);

  const rows: [string, string][] = [
    [tStr("Darshan Category"), category ? tStr(category.name) : "—"],
    [tStr("Date"), visitDate ? format(visitDate, "d MMM yyyy") : "—"],
    [tStr("Time"), visitTime || "—"],
    [tStr("Devotees"), String(details.persons || 1)],
  ];

  return (
    <div className="bg-white border border-rose-100 rounded-3xl p-5 shadow-sm">
      <h3 className="font-serif text-lg font-bold text-slate-900 flex items-center gap-2 mb-4">
        <ClipboardList className="w-5 h-5 text-saffron" /> {tStr("Booking Summary")}
      </h3>

      <dl className="space-y-2.5 text-sm pb-4 border-b border-rose-100">
        {rows.map(([k, v]) => (
          <div key={k} className="flex justify-between gap-3">
            <dt className="text-slate-500">{k}</dt>
            <dd className="font-semibold text-slate-800 text-right">{v}</dd>
          </div>
        ))}
      </dl>

      <div className="py-4 border-b border-rose-100 text-sm">
        <div className="font-bold text-slate-900 mb-2.5">{tStr("Selected Services")} ({services.length})</div>
        {services.length === 0 ? (
          <p className="text-xs text-slate-400">{tStr("No services added yet.")}</p>
        ) : (
          <ul className="space-y-2">
            {services.map((l) => (
              <li key={l.id} className="flex justify-between gap-3">
                <span className="flex items-start gap-2 text-slate-700">
                  <span className="w-1.5 h-1.5 rounded-full bg-saffron mt-1.5 shrink-0" />
                  <span>{tStr(l.label)}{l.note && <span className="text-slate-400 text-xs"> · {l.note}</span>}</span>
                </span>
                <span className="font-semibold text-slate-800 shrink-0">{formatINR(l.amount)}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {darshan && (
        <div className="flex justify-between gap-3 text-sm pt-3 text-slate-600">
          <span>{tStr("Darshan")} <span className="text-xs text-slate-400">({darshan.note})</span></span>
          <span className="font-semibold text-slate-800">{formatINR(darshan.amount)}</span>
        </div>
      )}

      <div className="mt-3 flex justify-between items-center bg-rose-50 border border-rose-100 rounded-2xl px-4 py-3">
        <span className="font-bold text-slate-900">{tStr("Subtotal")}</span>
        <span className="text-xl font-black text-saffron tabular-nums">{formatINR(total)}</span>
      </div>
    </div>
  );
}
