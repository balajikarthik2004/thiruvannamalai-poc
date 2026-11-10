import { useTranslation } from "react-i18next";
import {
  Sparkles,
  Plus,
  Minus,
  Check,
  ArrowRight,
  ArrowLeft,
  Flame,
  Utensils,
  Hotel,
} from "lucide-react";
import { ADDON_SERVICES, type AddonService } from "../constants";

interface Props {
  selectedServices: Array<{ service: AddonService; qty: number }>;
  onUpdateServiceQty: (service: AddonService, qty: number) => void;
  onContinue: () => void;
  onBack: () => void;
}

export function ServicesStep({
  selectedServices,
  onUpdateServiceQty,
  onContinue,
  onBack,
}: Props) {
  const { t } = useTranslation();

  const getQty = (id: string) => {
    return selectedServices.find((s) => s.service.id === id)?.qty || 0;
  };

  const totalServicesAmount = selectedServices.reduce(
    (sum, s) => sum + s.service.price * s.qty,
    0
  );

  return (
    <div className="rounded-2xl border border-[#E8E2D5] bg-white p-5 sm:p-7 shadow-xs">
      {/* Header */}
      <div className="mb-6 flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#FAF6F0] text-[#A86221]">
          <Sparkles className="h-6 w-6 text-[#A86221]" />
        </div>
        <div>
          <h2 className="font-serif text-xl font-bold tracking-tight text-[#073C2C] sm:text-2xl">
            {t("Optional Poojas & Seva Services")}
          </h2>
          <p className="mt-0.5 text-xs font-medium text-slate-500 sm:text-sm">
            {t("Add sacred pooja offerings, holy prasadam and temple guest accommodations.")}
          </p>
        </div>
      </div>

      {/* Services List */}
      <div className="space-y-3.5 mb-6">
        {ADDON_SERVICES.map((srv) => {
          const qty = getQty(srv.id);
          const isAdded = qty > 0;

          return (
            <div
              key={srv.id}
              className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3.5 rounded-xl border p-4 transition-all ${
                isAdded
                  ? "border-[#16A34A] bg-[#F0FDF4]/40 shadow-xs"
                  : "border-slate-200 bg-white hover:border-slate-300"
              }`}
            >
              <div className="flex items-start gap-3.5">
                <div
                  className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
                    srv.category === "pooja"
                      ? "bg-amber-50 text-amber-700"
                      : srv.category === "prasadam"
                      ? "bg-emerald-50 text-emerald-700"
                      : srv.category === "stay"
                      ? "bg-blue-50 text-blue-700"
                      : "bg-rose-50 text-rose-700"
                  }`}
                >
                  {srv.category === "pooja" ? (
                    <Sparkles className="h-4.5 w-4.5" />
                  ) : srv.category === "prasadam" ? (
                    <Utensils className="h-4.5 w-4.5" />
                  ) : srv.category === "stay" ? (
                    <Hotel className="h-4.5 w-4.5" />
                  ) : (
                    <Flame className="h-4.5 w-4.5" />
                  )}
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-serif text-sm font-bold text-slate-900">
                      {t(srv.name)}
                    </h3>
                    {srv.tamilName && (
                      <span className="text-[11px] font-medium text-slate-500">
                        ({srv.tamilName})
                      </span>
                    )}
                  </div>
                  <p className="mt-0.5 text-xs text-slate-500">{t(srv.desc)}</p>
                  <div className="mt-1 flex items-baseline gap-1 text-xs">
                    <span className="font-bold text-[#16A34A]">₹{srv.price}</span>
                    <span className="text-[10px] text-slate-400">/{srv.unit}</span>
                  </div>
                </div>
              </div>

              {/* Quantity selector / Add button */}
              <div className="flex items-center justify-end sm:shrink-0">
                {isAdded ? (
                  <div className="flex items-center rounded-lg border border-[#16A34A] bg-white shadow-xs">
                    <button
                      type="button"
                      aria-label={t("Decrease quantity")}
                      onClick={() => onUpdateServiceQty(srv, qty - 1)}
                      className="flex h-8 w-8 items-center justify-center text-slate-600 hover:text-slate-900"
                    >
                      <Minus className="h-3.5 w-3.5" />
                    </button>
                    <span className="w-8 text-center text-xs font-bold text-[#073C2C]">
                      {qty}
                    </span>
                    <button
                      type="button"
                      aria-label={t("Increase quantity")}
                      onClick={() => onUpdateServiceQty(srv, qty + 1)}
                      className="flex h-8 w-8 items-center justify-center text-slate-600 hover:text-slate-900"
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => onUpdateServiceQty(srv, 1)}
                    className="flex h-8 items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 text-xs font-bold text-slate-700 shadow-xs transition-colors hover:border-[#16A34A] hover:text-[#16A34A]"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    {t("Add")}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Subtotal note */}
      {selectedServices.length > 0 && (
        <div className="mb-6 flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3 text-xs">
          <span className="font-medium text-slate-600">
            {t("Total Add-on Services")}:
          </span>
          <span className="font-bold text-[#16A34A]">
            ₹{totalServicesAmount}
          </span>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex items-center justify-between border-t border-slate-100 pt-5">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-2.5 text-xs font-bold text-slate-700 transition-colors hover:bg-slate-50"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          {t("Back to Devotee Details")}
        </button>

        <button
          type="button"
          onClick={onContinue}
          className="inline-flex items-center gap-2 rounded-xl bg-[#073C2C] px-6 py-2.5 text-xs font-bold text-white shadow-sm transition-all hover:bg-[#06432A] hover:shadow-md"
        >
          {t("Continue to Checkout")}
          <ArrowRight className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}

