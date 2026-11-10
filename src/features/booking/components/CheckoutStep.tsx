import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  CreditCard,
  Building2,
  CalendarDays,
  Clock,
  Users,
  CheckCircle2,
  ShieldCheck,
  Smartphone,
  Landmark,
  ArrowLeft,
  Lock,
} from "lucide-react";
import { format } from "date-fns";
import type { Temple } from "@/data/temples";
import type { DarshanCategory, DevoteeMember, AddonService } from "../constants";

interface Props {
  temple: Temple;
  category: DarshanCategory;
  visitDate: Date;
  visitTime: string;
  devotees: DevoteeMember[];
  contactEmail: string;
  contactPhone: string;
  specialAssistance: boolean;
  selectedServices: Array<{ service: AddonService; qty: number }>;
  onConfirmPayment: (paymentMethod: string) => void;
  onBack: () => void;
  isProcessing: boolean;
}

const PAYMENT_METHODS = [
  {
    id: "upi",
    name: "UPI (Google Pay / PhonePe / Paytm / BHIM)",
    desc: "Instant approval via UPI app",
    icon: Smartphone,
    popular: true,
  },
  {
    id: "card",
    name: "Debit / Credit Card",
    desc: "Visa, Mastercard, RuPay",
    icon: CreditCard,
  },
  {
    id: "netbanking",
    name: "Net Banking",
    desc: "All major Indian banks",
    icon: Landmark,
  },
];

export function CheckoutStep({
  temple,
  category,
  visitDate,
  visitTime,
  devotees,
  contactEmail,
  contactPhone,
  specialAssistance,
  selectedServices,
  onConfirmPayment,
  onBack,
  isProcessing,
}: Props) {
  const { t } = useTranslation();
  const [selectedMethod, setSelectedMethod] = useState("upi");
  const [agreeTerms, setAgreeTerms] = useState(true);

  // Financial calculations
  const devoteeCount = Math.max(1, devotees.length);
  const darshanSubtotal = category.price * devoteeCount;
  const servicesSubtotal = selectedServices.reduce(
    (sum, s) => sum + s.service.price * s.qty,
    0
  );
  const grandTotal = darshanSubtotal + servicesSubtotal;

  if (isProcessing) {
    return (
      <div className="rounded-2xl border border-[#E8E2D5] bg-white p-8 sm:p-12 text-center shadow-xs">
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-[#F0FDF4] text-[#16A34A] animate-pulse">
          <Lock className="h-8 w-8 text-[#16A34A]" />
        </div>
        <h2 className="font-serif text-xl font-bold text-[#073C2C]">
          {t("Processing Your Darshan Booking...")}
        </h2>
        <p className="mt-1 text-xs text-slate-500">
          {t("Connecting to secure temple gateway. Generating your digital e-Pass.")}
        </p>
        <div className="mt-6 flex items-center justify-center gap-2 text-xs font-semibold text-slate-600">
          <ShieldCheck className="h-4 w-4 text-[#16A34A]" />
          {t("100% Verified Temple Gateway")}
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-[#E8E2D5] bg-white p-5 sm:p-7 shadow-xs">
      {/* Header */}
      <div className="mb-6 flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#FAF6F0] text-[#A86221]">
          <ShieldCheck className="h-6 w-6 text-[#A86221]" />
        </div>
        <div>
          <h2 className="font-serif text-xl font-bold tracking-tight text-[#073C2C] sm:text-2xl">
            {t("Review & Checkout")}
          </h2>
          <p className="mt-0.5 text-xs font-medium text-slate-500 sm:text-sm">
            {t("Please review your booking details before completing the reservation.")}
          </p>
        </div>
      </div>

      {/* Booking Summary Box */}
      <div className="mb-6 rounded-xl border border-slate-200 bg-slate-50/50 p-4 sm:p-5">
        <div className="mb-4 grid gap-3 sm:grid-cols-2 text-xs">
          <div>
            <span className="text-slate-500">{t("Temple")}:</span>
            <p className="font-bold text-slate-900">
              {temple.slug === "tiruvannamalai"
                ? "Tiruvannamalai Arunachaleswarar Temple"
                : t(temple.name)}
            </p>
          </div>

          <div>
            <span className="text-slate-500">{t("Darshan Category")}:</span>
            <p className="font-bold text-slate-900">
              {t(category.name)} ({category.price > 0 ? `₹${category.price} / devotee` : t("Free")})
            </p>
          </div>

          <div>
            <span className="text-slate-500">{t("Date & Time Slot")}:</span>
            <p className="font-bold text-slate-900">
              {format(visitDate, "d MMMM yyyy")} · {visitTime}
            </p>
          </div>

          <div>
            <span className="text-slate-500">{t("Devotee Count")}:</span>
            <p className="font-bold text-slate-900">
              {devoteeCount} {t("devotee(s)")}
            </p>
          </div>

          <div>
            <span className="text-slate-500">{t("Lead Devotee")}:</span>
            <p className="font-bold text-slate-900">
              {devotees[0]?.name || t("Devotee")} (+91 {contactPhone})
            </p>
          </div>

          {specialAssistance && (
            <div>
              <span className="text-slate-500">{t("Special Assistance")}:</span>
              <p className="font-bold text-[#16A34A]">{t("Wheelchair Requested")}</p>
            </div>
          )}
        </div>

        {/* Itemized Price Breakdown */}
        <div className="border-t border-slate-200 pt-3 text-xs space-y-1.5">
          <div className="flex justify-between text-slate-600">
            <span>
              {t(category.name)} (x{devoteeCount})
            </span>
            <span className="font-semibold text-slate-900">
              ₹{darshanSubtotal}
            </span>
          </div>

          {selectedServices.map((s) => (
            <div key={s.service.id} className="flex justify-between text-slate-600">
              <span>
                {s.service.name} (x{s.qty})
              </span>
              <span className="font-semibold text-slate-900">
                ₹{s.service.price * s.qty}
              </span>
            </div>
          ))}

          <div className="flex justify-between border-t border-slate-200 pt-2 text-sm font-bold text-slate-900">
            <span>{t("Total Payable Amount")}</span>
            <span className="text-base text-[#16A34A]">
              {grandTotal > 0 ? `₹${grandTotal}` : t("Free")}
            </span>
          </div>
        </div>
      </div>

      {/* Payment Method Selector */}
      {grandTotal > 0 ? (
        <div className="mb-6">
          <label className="mb-3 block text-xs font-bold text-slate-800">
            {t("Choose Payment Method")}
          </label>
          <div className="space-y-2.5">
            {PAYMENT_METHODS.map((pm) => {
              const Icon = pm.icon;
              const isSelected = selectedMethod === pm.id;

              return (
                <label
                  key={pm.id}
                  className={`flex items-center justify-between rounded-xl border p-3.5 cursor-pointer transition-all ${
                    isSelected
                      ? "border-[#16A34A] bg-[#F0FDF4]/50 shadow-xs"
                      : "border-slate-200 bg-white hover:border-slate-300"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="payment-method"
                      value={pm.id}
                      checked={isSelected}
                      onChange={() => setSelectedMethod(pm.id)}
                      className="h-4 w-4 text-[#16A34A] focus:ring-[#16A34A]"
                    />
                    <Icon className="h-5 w-5 text-slate-500" />
                    <div>
                      <span className="block text-xs font-bold text-slate-900">
                        {pm.name}
                      </span>
                      <span className="block text-[11px] text-slate-500">
                        {pm.desc}
                      </span>
                    </div>
                  </div>

                  {pm.popular && (
                    <span className="rounded-md bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800">
                      {t("Recommended")}
                    </span>
                  )}
                </label>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="mb-6 rounded-xl border border-emerald-200 bg-emerald-50/50 p-4 text-xs font-medium text-emerald-900 flex items-center gap-2">
          <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
          <span>
            {t("This darshan category is complimentary. No payment is required.")}
          </span>
        </div>
      )}

      {/* Terms Agreement */}
      <div className="mb-6">
        <label className="flex items-start gap-2.5 text-xs text-slate-600 cursor-pointer">
          <input
            type="checkbox"
            checked={agreeTerms}
            onChange={(e) => setAgreeTerms(e.target.checked)}
            className="mt-0.5 h-4 w-4 rounded border-slate-300 text-[#16A34A] focus:ring-[#16A34A]"
          />
          <span>
            {t("I confirm that the devotee details are accurate according to government ID, and agree to the temple's traditional dress code & darshan guidelines.")}
          </span>
        </label>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-between border-t border-slate-100 pt-5">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-2.5 text-xs font-bold text-slate-700 transition-colors hover:bg-slate-50"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          {t("Back to Services")}
        </button>

        <button
          type="button"
          disabled={!agreeTerms}
          onClick={() => onConfirmPayment(selectedMethod)}
          className="inline-flex items-center gap-2 rounded-xl bg-[#073C2C] px-7 py-2.5 text-xs font-bold text-white shadow-sm transition-all hover:bg-[#06432A] hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Lock className="h-3.5 w-3.5" />
          {grandTotal > 0 ? `${t("Pay & Book")} (₹${grandTotal})` : t("Confirm Booking")}
        </button>
      </div>
    </div>
  );
}

