import { useTranslation } from "react-i18next";
import {
  ClipboardList,
  ShieldCheck,
  Lock,
  Loader2,
  CreditCard,
  Building2,
  Wallet,
  Smartphone,
  Info,
  Eye,
  FileCheck2,
  HelpCircle,
} from "lucide-react";
import type { Temple } from "@/data/temples";
import { CAUSES, PAYMENT_METHODS, frequencyLabel } from "../constants";

interface Props {
  templeObj: Temple;
  cause: string;
  frequency: string;
  pledgeDate: string;
  amount: number;
  paymentMethod: string;
  setPaymentMethod: (m: string) => void;
  isProcessing: boolean;
  canSubmit: boolean;
  onPay: () => void;
}

const fmt = (n: number) => `₹${n.toLocaleString("en-IN")}`;

function UpiLogo() {
  return (
    <div className="flex items-center gap-1 bg-white border border-slate-200 rounded px-1.5 py-0.5 shadow-2xs shrink-0">
      <svg className="h-3.5 w-auto" viewBox="0 0 46 16" fill="none">
        <path d="M11 0L6 16H0L5 0H11Z" fill="#097939" />
        <path d="M17 0L12 16H6L11 0H17Z" fill="#ED752E" />
        <text
          x="20"
          y="13"
          fontFamily="system-ui, -apple-system, sans-serif"
          fontWeight="900"
          fontSize="12.5"
          fill="#231F20"
          letterSpacing="0.02em"
        >
          UPI
        </text>
      </svg>
    </div>
  );
}

export function DonationSummary({
  templeObj,
  cause,
  frequency,
  pledgeDate,
  amount,
  paymentMethod,
  setPaymentMethod,
  isProcessing,
  canSubmit,
  onPay,
}: Props) {
  const { t } = useTranslation();
  const causeTitle = CAUSES.find((c) => c.id === cause)?.title ?? "General Hundi";
  const isPledge = frequency === "pledge";

  const rows: [string, string][] = [
    [t("Temple"), t(templeObj.name)],
    [t("Cause"), t(causeTitle)],
    [t("Frequency"), t(frequencyLabel(frequency))],
    ...(isPledge && pledgeDate
      ? [
          [
            t("Pledge by"),
            new Date(pledgeDate).toLocaleDateString("en-IN", {
              day: "numeric",
              month: "short",
              year: "numeric",
            }),
          ] as [string, string],
        ]
      : []),
    [t("Amount"), amount > 0 ? fmt(amount) : "—"],
    [t("Processing Fee"), "₹0"],
  ];

  const ctaText = isPledge
    ? `${t("Confirm Pledge of")} ${amount > 0 ? fmt(amount) : ""}`
    : `${t("Proceed to Pay")} ${amount > 0 ? fmt(amount) : ""}`;

  return (
    <div className="space-y-4">
      {/* 1. Donation Summary Card */}
      <div className="bg-white rounded-3xl border border-[#E8E2D5] p-5 sm:p-6 shadow-xs">
        <div className="flex items-center gap-2 mb-4">
          <ClipboardList className="w-5 h-5 text-[#C48437]" strokeWidth={2} />
          <h2 className="font-serif text-base sm:text-lg font-bold text-slate-900 tracking-tight">
            {t("Donation Summary")}
          </h2>
        </div>

        <dl className="space-y-2.5 text-xs sm:text-sm">
          {rows.map(([k, v]) => (
            <div key={k} className="flex justify-between items-center gap-3">
              <dt className="text-slate-500 font-medium flex items-center gap-1">
                {k}
                {k === t("Processing Fee") && (
                  <span
                    title={t("Zero processing fee. Covered entirely by temple trust under HR&CE.")}
                    className="cursor-help text-slate-400"
                  >
                    <Info className="w-3.5 h-3.5 inline" />
                  </span>
                )}
              </dt>
              <dd className="font-semibold text-slate-900 text-right truncate max-w-[210px]">{v}</dd>
            </div>
          ))}
        </dl>

        {/* Total Payable Green Highlight Banner */}
        <div className="mt-4 pt-3.5 border-t border-[#E8E2D5]">
          <div className="flex items-center justify-between rounded-xl bg-[#F0FDF4] border border-[#BBF7D0]/70 px-4 py-3">
            <span className="font-serif text-sm font-bold text-[#0B2F25]">
              {isPledge ? t("Total Pledged") : t("Total Payable")}
            </span>
            <span className="font-serif text-2xl font-black text-[#15803D] tabular-nums">
              {amount > 0 ? fmt(amount) : "—"}
            </span>
          </div>
        </div>
      </div>

      {/* 2. Pay Securely Card */}
      <div className="bg-white rounded-3xl border border-[#E8E2D5] p-5 sm:p-6 shadow-xs">
        <div className="flex items-center gap-2 mb-4">
          <ShieldCheck className="w-5 h-5 text-[#C48437]" strokeWidth={2} />
          <h2 className="font-serif text-base sm:text-lg font-bold text-slate-900 tracking-tight">
            {t("Pay Securely")}
          </h2>
        </div>

        {/* Payment Methods Radio List */}
        <div role="radiogroup" aria-label={t("Payment Methods")} className="space-y-2 mb-5">
          {PAYMENT_METHODS.map((m) => {
            const isSelected = paymentMethod === m.id;
            return (
              <button
                key={m.id}
                type="button"
                role="radio"
                aria-checked={isSelected}
                onClick={() => setPaymentMethod(m.id)}
                className={`w-full flex items-center justify-between gap-3 px-3.5 py-3 rounded-2xl border text-left transition-all ${
                  isSelected
                    ? "border-[#0B2F25] bg-[#F0FDF4]/50 shadow-2xs"
                    : "border-[#E8E2D5] bg-white hover:border-[#0B2F25]/40 hover:bg-[#FAF6F0]/30"
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  {/* Custom Radio Icon */}
                  <span
                    className={`flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded-full border-2 transition-colors ${
                      isSelected ? "border-[#0B2F25] bg-white" : "border-slate-300 bg-white"
                    }`}
                  >
                    {isSelected && <span className="h-2.5 w-2.5 rounded-full bg-[#0B2F25]" />}
                  </span>
                  <span className="font-semibold text-xs sm:text-sm text-slate-900 truncate">
                    {t(m.label)}
                  </span>
                </div>

                {/* Right Badge/Icon */}
                <div className="shrink-0">
                  {m.id === "upi" ? (
                    <UpiLogo />
                  ) : m.id === "card" ? (
                    <CreditCard className="w-4.5 h-4.5 text-slate-500" />
                  ) : m.id === "netbanking" ? (
                    <Building2 className="w-4.5 h-4.5 text-slate-500" />
                  ) : (
                    <Wallet className="w-4.5 h-4.5 text-slate-500" />
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* CTA Button */}
        <button
          type="button"
          onClick={onPay}
          disabled={!canSubmit || isProcessing}
          className="w-full h-13 sm:h-14 rounded-full bg-[#0B2F25] hover:bg-[#073C2C] active:scale-[0.99] text-white font-bold text-sm sm:text-base shadow-md shadow-[#0B2F25]/20 flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed select-none"
        >
          {isProcessing ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>{t("Processing Offering…")}</span>
            </>
          ) : (
            <>
              <Lock className="w-4 h-4" />
              <span>{ctaText}</span>
            </>
          )}
        </button>

        {/* Trust Note */}
        <div className="mt-3 flex items-center justify-center gap-1.5 text-center text-xs text-emerald-800/80 font-medium">
          <ShieldCheck className="w-4 h-4 text-[#16A34A] shrink-0" />
          <span>{t("Your payment is secure and encrypted.")}</span>
        </div>
      </div>

      {/* 3. Why Donate with OMG Devotee? Card */}
      <div className="bg-white rounded-3xl border border-[#E8E2D5] p-5 sm:p-6 shadow-xs">
        <div className="flex items-center gap-2 mb-3.5">
          <HelpCircle className="w-5 h-5 text-[#C48437]" strokeWidth={2} />
          <h2 className="font-serif text-sm sm:text-base font-bold text-slate-900 tracking-tight">
            {t("Why Donate with OMG Devotee?")}
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-1">
          {/* Feature 1 */}
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5 mb-1 text-slate-900 font-bold text-xs">
              <FileCheck2 className="w-4 h-4 text-[#C48437] shrink-0" />
              <span>{t("Digital Receipt")}</span>
            </div>
            <p className="text-[11px] text-slate-500 leading-snug">
              {t("Instant 80G tax exemption receipt with transaction ID.")}
            </p>
          </div>

          {/* Feature 2 */}
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5 mb-1 text-slate-900 font-bold text-xs">
              <Eye className="w-4 h-4 text-[#C48437] shrink-0" />
              <span>{t("Transparency")}</span>
            </div>
            <p className="text-[11px] text-slate-500 leading-snug">
              {t("Know how your support helps temple activities.")}
            </p>
          </div>

          {/* Feature 3 */}
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5 mb-1 text-slate-900 font-bold text-xs">
              <ShieldCheck className="w-4 h-4 text-[#C48437] shrink-0" />
              <span>{t("Secure Payment")}</span>
            </div>
            <p className="text-[11px] text-slate-500 leading-snug">
              {t("Safe and reliable payment with multiple options.")}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
