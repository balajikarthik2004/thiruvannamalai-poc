import { useTranslation } from "react-i18next";
import { CheckCircle2, Download, Printer, ArrowLeft, ShieldCheck, HeartHandshake } from "lucide-react";
import type { Temple } from "@/data/temples";
import { CAUSES, PAYMENT_METHODS, frequencyLabel } from "../constants";

interface Props {
  templeObj: Temple;
  cause: string;
  paymentMethod: string;
  frequency: string;
  pledgeDate?: string;
  amount: number;
  donorName: string;
  donorPhone: string;
  donorEmail?: string;
  isAnonymous?: boolean;
  dedicationMessage?: string;
  onReset: () => void;
}

export function DonationReceipt({
  templeObj,
  cause,
  paymentMethod,
  frequency,
  pledgeDate,
  amount,
  donorName,
  donorPhone,
  donorEmail,
  isAnonymous,
  dedicationMessage,
  onReset,
}: Props) {
  const { t } = useTranslation();
  const causeItem = CAUSES.find((c) => c.id === cause) || CAUSES[0];
  const paymentItem = PAYMENT_METHODS.find((m) => m.id === paymentMethod) || PAYMENT_METHODS[0];
  const isPledge = frequency === "pledge";

  const txnId = `OMG${new Date().getFullYear()}${Math.floor(10000000 + Math.random() * 90000000)}`;
  const dateStr = new Date().toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
  const timeStr = new Date().toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    const text = `
--------------------------------------------------
   ARULMIGU ARUNACHALESWARAR TEMPLE, TIRUVANNAMALAI
           OFFICIAL DONATION E-RECEIPT
--------------------------------------------------
Receipt No: ${txnId}
Date & Time: ${dateStr}, ${timeStr}
Temple: ${templeObj.name}
Cause: ${causeItem.title}
Frequency: ${frequencyLabel(frequency)}
Amount: INR ₹${amount.toLocaleString("en-IN")}
Status: Successful (80G Tax Deductible)
Donor Name: ${isAnonymous ? "Anonymous Devotee" : donorName || "Devotee"}
Mobile: ${donorPhone ? `+91 ${donorPhone}` : "N/A"}
${dedicationMessage ? `Dedication: "${dedicationMessage}"\n` : ""}
Tax Exemption: Eligible under Section 80G of Income Tax Act 1961.
May the divine blessings of Lord Annamalaiyar be with you always! 🙏
--------------------------------------------------
    `;
    const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `Donation-Receipt-${txnId}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-white rounded-3xl border border-[#E8E2D5] p-6 sm:p-8 shadow-sm space-y-6 animate-in fade-in zoom-in-95 duration-300">
      {/* Success Badge & Blessing */}
      <div className="text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#F0FDF4] text-[#15803D] ring-8 ring-[#DCFCE7]/60 shadow-xs">
          <CheckCircle2 className="h-9 w-9" strokeWidth={2.5} />
        </div>
        <h2 className="mt-4 font-serif text-2xl sm:text-3xl font-bold text-[#0B2F25]">
          {isPledge ? t("Pledge Confirmed") : t("Offering Completed Successfully")}
        </h2>
        <p className="mt-1 font-serif text-sm font-semibold text-[#C48437]">
          {t("May Lord Arunachaleswarar & Unnamulai Amman bless you & your family! 🙏")}
        </p>
      </div>

      {/* Official Tax 80G Digital Receipt Card */}
      <div className="rounded-2xl border-2 border-[#E8E2D5] bg-[#FAF6F0]/40 p-5 sm:p-6 relative overflow-hidden">
        {/* Top green accent border */}
        <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-[#0B2F25] via-[#C48437] to-[#0B2F25]" />

        {/* Receipt Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-dashed border-[#E8E2D5] pb-4 mb-4">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500 block">
              {t("Official Temple E-Receipt")}
            </span>
            <span className="font-serif text-base font-bold text-slate-900 block mt-0.5">
              {t(templeObj.name)}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 rounded-full bg-[#F0FDF4] border border-[#BBF7D0] px-2.5 py-1 text-[11px] font-bold text-[#15803D]">
              <ShieldCheck className="w-3.5 h-3.5" /> {t("80G Tax Deductible")}
            </span>
            <span className="rounded-lg bg-white border border-[#E8E2D5] px-2.5 py-1 text-xs font-mono font-bold text-slate-700 shadow-2xs">
              {dateStr}
            </span>
          </div>
        </div>

        {/* Key Values */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3.5 gap-x-6 text-xs sm:text-sm">
          <div>
            <span className="text-slate-400 font-medium block text-[11px] uppercase tracking-wider">{t("Receipt / Txn ID")}</span>
            <span className="font-mono font-bold text-slate-900 block mt-0.5">{txnId}</span>
          </div>

          <div>
            <span className="text-slate-400 font-medium block text-[11px] uppercase tracking-wider">{t("Amount Offered")}</span>
            <span className="font-serif text-xl font-black text-[#15803D] block mt-0.5">
              ₹{amount.toLocaleString("en-IN")}
            </span>
          </div>

          <div>
            <span className="text-slate-400 font-medium block text-[11px] uppercase tracking-wider">{t("Cause")}</span>
            <span className="font-bold text-slate-900 block mt-0.5">{t(causeItem.title)}</span>
          </div>

          <div>
            <span className="text-slate-400 font-medium block text-[11px] uppercase tracking-wider">{t("Frequency")}</span>
            <span className="font-bold text-slate-900 block mt-0.5">{t(frequencyLabel(frequency))}</span>
          </div>

          <div>
            <span className="text-slate-400 font-medium block text-[11px] uppercase tracking-wider">{t("Donor Name")}</span>
            <span className="font-bold text-slate-900 block mt-0.5">
              {isAnonymous ? t("Anonymous Devotee") : donorName || t("Devotee")}
            </span>
          </div>

          <div>
            <span className="text-slate-400 font-medium block text-[11px] uppercase tracking-wider">{t("Payment Mode")}</span>
            <span className="font-bold text-slate-900 block mt-0.5">{t(paymentItem.label.split(" (")[0])}</span>
          </div>

          {dedicationMessage && (
            <div className="sm:col-span-2 pt-2 border-t border-dashed border-[#E8E2D5]">
              <span className="text-slate-400 font-medium block text-[11px] uppercase tracking-wider">{t("Offering Dedication")}</span>
              <p className="font-serif italic text-slate-700 text-xs sm:text-sm mt-0.5">
                "{dedicationMessage}"
              </p>
            </div>
          )}
        </div>

        {/* Footer Note */}
        <div className="mt-4 pt-3 border-t border-dashed border-[#E8E2D5] text-[11px] text-slate-500 leading-snug">
          {t("Issued by Arulmigu Arunachaleswarar Temple Devasthanam, HR&CE Department. Retain this digital receipt for tax deduction under Section 80G.")}
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-2">
        <button
          type="button"
          onClick={handleDownload}
          className="flex-1 h-12 rounded-full bg-[#0B2F25] hover:bg-[#073C2C] active:scale-[0.99] text-white font-bold text-sm shadow-md flex items-center justify-center gap-2 transition-all"
        >
          <Download className="w-4 h-4" />
          <span>{t("Download Tax Receipt (PDF)")}</span>
        </button>

        <button
          type="button"
          onClick={handlePrint}
          className="h-12 px-6 rounded-full bg-white hover:bg-slate-50 active:scale-[0.99] text-slate-700 border border-[#E8E2D5] font-bold text-sm shadow-xs flex items-center justify-center gap-2 transition-all"
        >
          <Printer className="w-4 h-4 text-slate-500" />
          <span>{t("Print")}</span>
        </button>

        <button
          type="button"
          onClick={onReset}
          className="h-12 px-6 rounded-full bg-[#FAF6F0] hover:bg-[#FAF6F0]/80 active:scale-[0.99] text-[#0B2F25] border border-[#E8E2D5] font-bold text-sm flex items-center justify-center gap-1.5 transition-all"
        >
          <HeartHandshake className="w-4 h-4 text-[#C48437]" />
          <span>{t("Make Another Offering")}</span>
        </button>
      </div>
    </div>
  );
}
