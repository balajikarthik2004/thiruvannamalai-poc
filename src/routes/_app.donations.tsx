import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { HeartHandshake, X, ShieldCheck, Check } from "lucide-react";
import { temples } from "@/data/temples";
import { useTranslation } from "react-i18next";
import { DonationForm } from "@/features/donations/components/DonationForm";
import { DonationSummary } from "@/features/donations/components/DonationSummary";
import { DonationReceipt } from "@/features/donations/components/DonationReceipt";
import { CAUSES } from "@/features/donations/constants";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/donations")({
  head: () => ({
    meta: [
      { title: "Make an Offering — Arulmigu Arunachaleswarar Temple" },
      {
        name: "description",
        content:
          "Support temple services, annadhanam and sacred rituals at Tiruvannamalai Arunachaleswarar Temple with instant 80G tax receipt.",
      },
    ],
  }),
  component: DonationsPage,
});

function DonationsPage() {
  const { t } = useTranslation();
  const [temple, setTemple] = useState("tiruvannamalai");
  const [cause, setCause] = useState("general");
  const [frequency, setFrequency] = useState("one-time");
  const [recurringInterval, setRecurringInterval] = useState("monthly");
  const [pledgeDate, setPledgeDate] = useState("");
  const [amount, setAmount] = useState<number>(501);
  const [customAmount, setCustomAmount] = useState<string>("");

  // Donor Details
  const [donorName, setDonorName] = useState("");
  const [donorPhone, setDonorPhone] = useState("");
  const [donorEmail, setDonorEmail] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [dedicationMessage, setDedicationMessage] = useState("");

  const [paymentMethod, setPaymentMethod] = useState("upi");
  const [isProcessing, setIsProcessing] = useState(false);
  const [done, setDone] = useState(false);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);

  const tObj = temples.find((x) => x.slug === temple) || temples[0];
  const activeAmount = customAmount ? parseInt(customAmount, 10) || 0 : amount;

  const canSubmit =
    activeAmount > 0 &&
    (frequency !== "pledge" || Boolean(pledgeDate)) &&
    (isAnonymous || Boolean(donorName.trim())) &&
    donorPhone.trim().length >= 10;

  const handlePay = () => {
    if (!canSubmit) {
      if (!isAnonymous && !donorName.trim()) {
        toast.error(t("Please enter your full name."));
        return;
      }
      if (donorPhone.trim().length < 10) {
        toast.error(t("Please enter a valid 10-digit mobile number for receipt delivery."));
        return;
      }
      if (frequency === "pledge" && !pledgeDate) {
        toast.error(t("Please choose a pledge fulfillment date."));
        return;
      }
      if (activeAmount <= 0) {
        toast.error(t("Please choose or enter a valid donation amount."));
        return;
      }
    }

    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setDone(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
      toast.success(t("Offering submitted successfully! 🙏"));
    }, 1800);
  };

  const handleReset = () => {
    setDone(false);
    setAmount(501);
    setCustomAmount("");
    setFrequency("one-time");
    setPledgeDate("");
    setDedicationMessage("");
  };

  return (
    <div className="min-h-screen bg-[#FAF6F0] pb-16">
      {/* 1. Hero Banner */}
      <header className="relative w-full overflow-hidden border-b border-[#E8E2D5] bg-[#FAF6F0]">
        {/* Right background panoramic artwork of temple corridor and oil lamps in HD */}
        <div
          className="pointer-events-none absolute inset-y-0 right-0 w-full sm:w-3/5 lg:w-1/2 overflow-hidden"
          aria-hidden
        >
          <img
            src="/donation_banner_temple_lamps_hd.jpg"
            alt=""
            className="h-full w-full object-cover object-right brightness-95"
            onError={(e) => {
              (e.target as HTMLElement).src = "/donation_banner_art_hd.jpg";
            }}
          />
          {/* Subtle gradient blending left into the warm cream background */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#FAF6F0] via-[#FAF6F0]/60 to-transparent" />
        </div>

        <div className="relative mx-auto max-w-[1400px] px-4 py-5 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 sm:gap-5">
            {/* Golden Trishul icon in HD */}
            <div className="flex h-14 w-12 sm:h-16 sm:w-14 shrink-0 items-center justify-center">
              <img
                src="/trishul_gold_hd.png"
                alt="Trishul"
                className="h-13 sm:h-15 w-auto object-contain drop-shadow-[0_2px_8px_rgba(217,119,6,0.35)]"
                onError={(e) => {
                  (e.target as HTMLElement).src = "/trishul_gold.png";
                }}
              />
            </div>

            {/* Title & Description */}
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-[#C48437]">
                <HeartHandshake className="w-3.5 h-3.5" />
                <span>{t("SECURE TEMPLE DONATIONS")}</span>
              </div>
              <h1 className="font-serif text-2xl font-bold leading-tight tracking-tight text-[#0B2F25] sm:text-3xl lg:text-4xl">
                {t("Make an Offering")}
              </h1>
              <p className="mt-1 max-w-xl text-xs sm:text-sm text-slate-600 leading-snug">
                {t(
                  "Support temple services, annadhanam and a range of sacred activities at Thiruvanamalai Arunachaleswarar Temple."
                )}
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* 2. Main Body Content */}
      <main className="mx-auto max-w-[1400px] px-4 pt-6 sm:px-6 lg:px-8">
        {done ? (
          <div className="max-w-2xl mx-auto">
            <DonationReceipt
              templeObj={tObj}
              cause={cause}
              paymentMethod={paymentMethod}
              frequency={frequency}
              pledgeDate={pledgeDate}
              amount={activeAmount}
              donorName={donorName}
              donorPhone={donorPhone}
              donorEmail={donorEmail}
              isAnonymous={isAnonymous}
              dedicationMessage={dedicationMessage}
              onReset={handleReset}
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Column (Inputs) */}
            <div className="lg:col-span-7">
              <DonationForm
                temple={temple}
                setTemple={setTemple}
                cause={cause}
                setCause={setCause}
                frequency={frequency}
                setFrequency={setFrequency}
                recurringInterval={recurringInterval}
                setRecurringInterval={setRecurringInterval}
                pledgeDate={pledgeDate}
                setPledgeDate={setPledgeDate}
                amount={amount}
                setAmount={setAmount}
                customAmount={customAmount}
                setCustomAmount={setCustomAmount}
                donorName={donorName}
                setDonorName={setDonorName}
                donorPhone={donorPhone}
                setDonorPhone={setDonorPhone}
                donorEmail={donorEmail}
                setDonorEmail={setDonorEmail}
                isAnonymous={isAnonymous}
                setIsAnonymous={setIsAnonymous}
                dedicationMessage={dedicationMessage}
                setDedicationMessage={setDedicationMessage}
                onOpenDetailsModal={() => setDetailsModalOpen(true)}
              />
            </div>

            {/* Right Column (Summary & Payment) */}
            <div className="lg:col-span-5">
              <aside className="sticky top-20">
                <DonationSummary
                  templeObj={tObj}
                  cause={cause}
                  frequency={frequency}
                  pledgeDate={pledgeDate}
                  amount={activeAmount}
                  paymentMethod={paymentMethod}
                  setPaymentMethod={setPaymentMethod}
                  isProcessing={isProcessing}
                  canSubmit={canSubmit}
                  onPay={handlePay}
                />
              </aside>
            </div>
          </div>
        )}
      </main>

      {/* 3. Details Modal for Causes */}
      {detailsModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
        >
          <div className="relative w-full max-w-2xl rounded-3xl bg-white border border-[#E8E2D5] p-6 sm:p-7 shadow-2xl animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-[#E8E2D5]">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-[#C48437]" />
                <h2 className="font-serif text-lg font-bold text-slate-900">
                  {t("Where Your Offering Goes")}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setDetailsModalOpen(false)}
                className="h-8 w-8 rounded-full flex items-center justify-center text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-4 space-y-4">
              {CAUSES.map((c) => (
                <div key={c.id} className="p-4 rounded-2xl bg-[#FAF6F0] border border-[#E8E2D5] flex gap-4">
                  <img
                    src={c.image}
                    alt={t(c.title)}
                    className="w-20 h-20 rounded-xl object-cover shrink-0 border border-[#E8E2D5]"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-serif font-bold text-slate-900 text-sm sm:text-base">
                      {t(c.title)}
                    </h3>
                    <p className="mt-1 text-xs text-slate-600 leading-relaxed">
                      {t(c.details)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-5 p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 flex items-start gap-2.5">
              <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>
                {t(
                  "All contributions are regulated under the Tamil Nadu HR&CE Act and are eligible for tax deduction under Section 80G. An official digital receipt is issued immediately."
                )}
              </span>
            </div>

            <div className="mt-5 flex justify-end">
              <button
                type="button"
                onClick={() => setDetailsModalOpen(false)}
                className="h-10 px-6 rounded-full bg-[#0B2F25] text-white text-xs font-bold hover:bg-[#073C2C] transition-colors"
              >
                {t("Close")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
