import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { HeartHandshake } from "lucide-react";
import { temples } from "@/data/temples";
import { useTranslation } from "react-i18next";
import { DonationForm } from "@/features/donations/components/DonationForm";
import { DonationSummary } from "@/features/donations/components/DonationSummary";
import { DonationReceipt } from "@/features/donations/components/DonationReceipt";

export const Route = createFileRoute("/_app/donations")({
  head: () => ({ meta: [{ title: "Donations — OMG Smart Temple" }] }),
  component: DonationsPage,
});

// Gopuram photo for the header banner (falls back to the temple's own image).
const HERO_IMAGES: Record<string, string> = {
  tiruvannamalai: "/temples/tiruvannamalai/donation-hero.jpg",
};

function DonationsPage() {
  const { t: tStr } = useTranslation();
  const [temple, setTemple] = useState("tiruvannamalai");
  const [done, setDone] = useState(false);
  const [cause, setCause] = useState("general");
  const [amount, setAmount] = useState<number>(501);
  const [customAmount, setCustomAmount] = useState<string>("");
  const [paymentMethod, setPaymentMethod] = useState("upi");
  const [frequency, setFrequency] = useState("one-time"); // one-time | pledge | 15days | 30days | custom-N
  const [pledgeDate, setPledgeDate] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const t = temples.find((x) => x.slug === temple)!;
  const activeAmount = customAmount ? parseInt(customAmount) || 0 : amount;
  const canSubmit =
    activeAmount > 0 &&
    (frequency !== "pledge" || !!pledgeDate) &&
    (!frequency.startsWith("custom") || Number(frequency.split("-")[1]) > 0);
  const hero = HERO_IMAGES[temple] ?? t.image;

  const handlePay = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setDone(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 2500);
  };

  const reset = () => {
    setDone(false);
    setAmount(501);
    setCustomAmount("");
    setFrequency("one-time");
    setPledgeDate("");
  };

  return (
    <div className="min-h-screen bg-[#fdf8f6] pb-10">
      {/* Header banner */}
      <header className="relative overflow-hidden">
        {hero && (
          <div className="absolute inset-y-0 right-0 w-full md:w-3/5 pointer-events-none" aria-hidden>
            <img src={hero} alt="" className="w-full h-full object-cover object-[center_25%] opacity-60 md:opacity-90" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#fdf8f6] via-[#fdf8f6]/40 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#fdf8f6] to-transparent" />
          </div>
        )}
        <div className="relative max-w-6xl mx-auto px-4 lg:px-8 pt-8 pb-10">
          <div className="flex items-center gap-2 text-saffron mb-2">
            <HeartHandshake className="w-5 h-5" />
            <span className="text-xs font-bold tracking-widest uppercase">{tStr("Secure Temple Donations")}</span>
          </div>
          <h1 className="font-serif text-3xl lg:text-4xl font-bold text-slate-900">{tStr("Make an Offering")}</h1>
          <p className="text-sm text-slate-600 mt-2 max-w-md">{tStr("Support temple services, annadhanam and a range of sacred activities.")}</p>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 lg:px-8 -mt-2">
        {done ? (
          <div className="max-w-xl mx-auto">
            <DonationReceipt
              templeObj={t}
              cause={cause}
              paymentMethod={paymentMethod}
              frequency={frequency}
              pledgeDate={pledgeDate}
              getActiveAmount={() => activeAmount}
              onReset={reset}
            />
          </div>
        ) : (
          <div className="grid lg:grid-cols-[minmax(0,1fr)_400px] gap-6 items-stretch">
            <DonationForm
              temple={temple} setTemple={setTemple}
              cause={cause} setCause={setCause}
              amount={amount} setAmount={setAmount}
              customAmount={customAmount} setCustomAmount={setCustomAmount}
              frequency={frequency} setFrequency={setFrequency}
              pledgeDate={pledgeDate} setPledgeDate={setPledgeDate}
            />
            <aside className="flex flex-col">
              <DonationSummary
                templeObj={t}
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
        )}
      </div>
    </div>
  );
}
