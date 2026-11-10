import { useState, type ReactNode } from "react";
import { useTranslation } from "react-i18next";
import {
  Landmark,
  CalendarDays,
  Layers,
  IndianRupee,
  User,
  Phone,
  Mail,
  PenLine,
  Check,
  ChevronDown,
  Info,
  CalendarClock,
  Sparkles,
  HelpCircle,
} from "lucide-react";
import { temples } from "@/data/temples";
import { CAUSES, FREQUENCIES, PRESET_AMOUNTS, frequencyGroup } from "../constants";

interface Props {
  temple: string;
  setTemple: (t: string) => void;
  cause: string;
  setCause: (c: string) => void;
  frequency: string;
  setFrequency: (f: string) => void;
  recurringInterval: string;
  setRecurringInterval: (r: string) => void;
  pledgeDate: string;
  setPledgeDate: (d: string) => void;
  amount: number;
  setAmount: (a: number) => void;
  customAmount: string;
  setCustomAmount: (a: string) => void;
  donorName: string;
  setDonorName: (n: string) => void;
  donorPhone: string;
  setDonorPhone: (p: string) => void;
  donorEmail: string;
  setDonorEmail: (e: string) => void;
  isAnonymous: boolean;
  setIsAnonymous: (a: boolean) => void;
  dedicationMessage: string;
  setDedicationMessage: (m: string) => void;
  onOpenDetailsModal: () => void;
}

function SectionHeader({
  icon: Icon,
  title,
  rightAction,
}: {
  icon: any;
  title: string;
  rightAction?: ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-3 mb-3.5">
      <h2 className="flex items-center gap-2 font-serif text-base sm:text-lg font-bold text-slate-900 tracking-tight">
        <Icon className="w-5 h-5 text-[#C48437] shrink-0" strokeWidth={2} />
        {title}
      </h2>
      {rightAction}
    </div>
  );
}

export function DonationForm({
  temple,
  setTemple,
  cause,
  setCause,
  frequency,
  setFrequency,
  recurringInterval,
  setRecurringInterval,
  pledgeDate,
  setPledgeDate,
  amount,
  setAmount,
  customAmount,
  setCustomAmount,
  donorName,
  setDonorName,
  donorPhone,
  setDonorPhone,
  donorEmail,
  setDonorEmail,
  isAnonymous,
  setIsAnonymous,
  dedicationMessage,
  setDedicationMessage,
  onOpenDetailsModal,
}: Props) {
  const { t } = useTranslation();
  const [templeDropdownOpen, setTempleDropdownOpen] = useState(false);
  const selectedTemple = temples.find((x) => x.slug === temple) || temples[0];
  const group = frequencyGroup(frequency);

  const handleCustomAmountChange = (val: string) => {
    const cleaned = val.replace(/[^0-9]/g, "");
    setCustomAmount(cleaned);
    if (cleaned) {
      setAmount(parseInt(cleaned, 10));
    }
  };

  const handlePresetSelect = (preset: number) => {
    setAmount(preset);
    setCustomAmount("");
  };

  return (
    <div className="bg-white rounded-3xl border border-[#E8E2D5] p-5 sm:p-7 shadow-xs space-y-7">
      {/* 1. Select Temple */}
      <section>
        <SectionHeader icon={Landmark} title={t("Select Temple")} />

        <div className="relative">
          <button
            type="button"
            onClick={() => setTempleDropdownOpen((o) => !o)}
            className="w-full flex items-center justify-between gap-3 rounded-2xl border border-[#E8E2D5] bg-[#FAF6F0]/30 hover:border-[#0B2F25]/40 hover:bg-[#FAF6F0]/60 p-2.5 sm:p-3 transition-all text-left group"
          >
            <div className="flex items-center gap-3 min-w-0">
              <img
                src={selectedTemple.image || "/temples/tiruvannamalai/rajagopuram.jpg"}
                alt=""
                className="w-11 h-11 rounded-xl object-cover border border-[#E8E2D5] shrink-0 shadow-xs"
              />
              <div className="min-w-0">
                <span className="block font-serif text-[15px] font-bold text-slate-900 truncate group-hover:text-[#0B2F25] transition-colors">
                  {t(selectedTemple.name)}
                </span>
                <span className="block text-xs text-slate-500 truncate">
                  {t(selectedTemple.city)}, {t(selectedTemple.state)}
                </span>
              </div>
            </div>
            <ChevronDown className="w-5 h-5 text-slate-400 group-hover:text-slate-700 transition-transform duration-200 shrink-0 mr-1" />
          </button>

          {templeDropdownOpen && (
            <div className="absolute left-0 right-0 top-full z-30 mt-1.5 max-h-72 overflow-y-auto rounded-2xl border border-[#E8E2D5] bg-white shadow-xl py-1.5 animate-in fade-in slide-in-from-top-2">
              {temples.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    setTemple(item.slug);
                    setTempleDropdownOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 text-left transition-colors ${
                    item.slug === temple
                      ? "bg-[#FAF6F0] font-bold text-[#0B2F25]"
                      : "hover:bg-[#FAF6F0]/60 text-slate-700"
                  }`}
                >
                  <img
                    src={item.image}
                    alt=""
                    className="w-8 h-8 rounded-lg object-cover border border-[#E8E2D5] shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-semibold truncate">{t(item.name)}</div>
                    <div className="text-[11px] text-slate-400 truncate">{t(item.city)}</div>
                  </div>
                  {item.slug === temple && <Check className="w-4 h-4 text-[#0B2F25] shrink-0 ml-auto" />}
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 2. Donation Frequency */}
      <section>
        <SectionHeader icon={CalendarDays} title={t("Donation Frequency")} />

        <div role="radiogroup" aria-label={t("Donation Frequency")} className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {FREQUENCIES.map((f) => {
            const active = group === f.id;
            const Icon = f.icon;
            return (
              <button
                key={f.id}
                type="button"
                role="radio"
                aria-checked={active}
                onClick={() => {
                  setFrequency(f.id === "recurring" ? recurringInterval || "monthly" : f.id);
                }}
                className={`flex items-start gap-3 p-3.5 rounded-2xl border text-left transition-all relative overflow-hidden select-none ${
                  active
                    ? "bg-[#0B2F25] border-[#0B2F25] text-white shadow-sm ring-1 ring-[#0B2F25]"
                    : "bg-white border-[#E8E2D5] text-slate-800 hover:border-[#0B2F25]/40 hover:bg-[#FAF6F0]/30"
                }`}
              >
                <div
                  className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full mt-0.5 transition-colors ${
                    active ? "bg-white/20 text-white" : "bg-[#FAF6F0] text-[#C48437]"
                  }`}
                >
                  {active && f.id === "one-time" ? (
                    <Check className="w-4 h-4" strokeWidth={3} />
                  ) : (
                    <Icon className="w-4 h-4" strokeWidth={2} />
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <span className={`block font-serif text-[15px] font-bold leading-tight ${active ? "text-white" : "text-slate-900"}`}>
                    {t(f.title)}
                  </span>
                  <span className={`block text-[11px] leading-snug mt-1 ${active ? "text-emerald-100/80" : "text-slate-500"}`}>
                    {t(f.subtitle)}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Recurring sub-options */}
        {group === "recurring" && (
          <div className="mt-3.5 p-4 rounded-2xl bg-[#FAF6F0] border border-[#E8E2D5] space-y-2.5 animate-in fade-in slide-in-from-top-1">
            <span className="text-xs font-bold text-slate-700 block">
              {t("Choose recurring interval:")}
            </span>
            <div className="flex flex-wrap gap-2">
              {[
                { id: "monthly", label: "Monthly" },
                { id: "quarterly", label: "Quarterly" },
                { id: "yearly", label: "Yearly" },
              ].map((opt) => {
                const isSelected = frequency === opt.id || recurringInterval === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => {
                      setRecurringInterval(opt.id);
                      setFrequency(opt.id);
                    }}
                    className={`px-4 py-2 rounded-full text-xs font-bold border transition-all ${
                      isSelected
                        ? "bg-[#0B2F25] text-white border-[#0B2F25] shadow-xs"
                        : "bg-white text-slate-700 border-[#E8E2D5] hover:border-[#0B2F25]/40"
                    }`}
                  >
                    {t(opt.label)}
                  </button>
                );
              })}
            </div>
            <p className="text-[11px] text-slate-500 flex items-center gap-1.5 mt-1">
              <Info className="w-3.5 h-3.5 text-[#C48437] shrink-0" />
              {t("Auto-debits can be managed or paused at any time from your profile.")}
            </p>
          </div>
        )}

        {/* Pledge date sub-option */}
        {group === "pledge" && (
          <div className="mt-3.5 p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80 space-y-2.5 animate-in fade-in slide-in-from-top-1">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-xs font-bold text-amber-900 block">
                  {t("Pledge fulfillment date:")}
                </span>
                <span className="text-[11px] text-amber-800">
                  {t("We will send a courteous reminder before your chosen date.")}
                </span>
              </div>
              <input
                type="date"
                min={new Date().toISOString().split("T")[0]}
                value={pledgeDate}
                onChange={(e) => setPledgeDate(e.target.value)}
                className="rounded-xl border border-amber-300 bg-white px-3 py-2 text-xs font-bold text-slate-900 outline-none focus:border-[#0B2F25]"
              />
            </div>
          </div>
        )}
      </section>

      {/* 3. Choose Where Your Offering Goes */}
      <section>
        <SectionHeader
          icon={Layers}
          title={t("Choose Where Your Offering Goes")}
          rightAction={
            <button
              type="button"
              onClick={onOpenDetailsModal}
              className="inline-flex items-center gap-1 text-xs font-bold text-[#C48437] hover:text-[#9A6224] transition-colors"
            >
              <span>{t("View Details")}</span>
              <Info className="w-3.5 h-3.5" />
            </button>
          }
        />

        <div role="radiogroup" aria-label={t("Choose Where Your Offering Goes")} className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
          {CAUSES.map((c) => {
            const isSelected = cause === c.id;
            return (
              <button
                key={c.id}
                type="button"
                role="radio"
                aria-checked={isSelected}
                onClick={() => setCause(c.id)}
                className={`relative flex flex-col rounded-2xl border text-left overflow-hidden transition-all duration-200 group ${
                  isSelected
                    ? "border-2 border-[#0B2F25] bg-[#F0FDF4]/30 shadow-sm"
                    : "border-[#E8E2D5] bg-white hover:border-[#0B2F25]/40 hover:shadow-xs"
                }`}
              >
                {/* Image header */}
                <div className="relative aspect-[16/9] w-full overflow-hidden bg-slate-100">
                  <img
                    src={c.image}
                    alt={t(c.title)}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  {/* Active top right checkmark badge */}
                  {isSelected && (
                    <span className="absolute top-2 right-2 w-5 h-5 rounded-full bg-[#0B2F25] text-white flex items-center justify-center shadow-md animate-in zoom-in-75 duration-200">
                      <Check className="w-3.5 h-3.5" strokeWidth={3} />
                    </span>
                  )}
                </div>

                {/* Card Content */}
                <div className="p-3.5 flex flex-col flex-1">
                  <h3 className="font-serif text-[15px] font-bold text-slate-900 group-hover:text-[#0B2F25] transition-colors leading-tight">
                    {t(c.title)}
                  </h3>
                  <p className="mt-1 text-xs text-slate-500 leading-snug line-clamp-2">
                    {t(c.desc)}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* 4. Select Amount */}
      <section>
        <SectionHeader icon={IndianRupee} title={t("Select Amount")} />

        {/* 5 Preset Pills in a row */}
        <div role="radiogroup" aria-label={t("Select Amount")} className="grid grid-cols-3 sm:grid-cols-5 gap-2.5 mb-3">
          {PRESET_AMOUNTS.map((val) => {
            const isSelected = amount === val && !customAmount;
            const isMostChosen = val === 501;

            return (
              <div key={val} className="relative flex flex-col items-center">
                {isMostChosen && (
                  <span className="absolute -top-2.5 z-10 rounded-full bg-[#C48437] px-2 py-0.5 text-[9px] font-black uppercase tracking-wider text-white shadow-xs">
                    {t("Most Chosen")}
                  </span>
                )}
                <button
                  type="button"
                  role="radio"
                  aria-checked={isSelected}
                  onClick={() => handlePresetSelect(val)}
                  className={`w-full h-12 rounded-xl border text-sm font-bold tabular-nums transition-all flex items-center justify-center select-none ${
                    isSelected
                      ? "bg-[#0B2F25] border-[#0B2F25] text-white shadow-sm ring-1 ring-[#0B2F25]"
                      : "bg-white border-[#E8E2D5] text-slate-800 hover:border-[#0B2F25]/40 hover:bg-[#FAF6F0]/40"
                  }`}
                >
                  ₹{val.toLocaleString("en-IN")}
                </button>
              </div>
            );
          })}
        </div>

        {/* Custom Amount Input */}
        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400">
            <span className="font-serif text-base font-semibold">₹</span>
          </div>
          <input
            type="text"
            inputMode="numeric"
            value={customAmount}
            onChange={(e) => handleCustomAmountChange(e.target.value)}
            placeholder={t("Enter custom amount")}
            className="w-full h-12 rounded-xl border border-[#E8E2D5] bg-[#FAF6F0]/30 pl-9 pr-4 text-sm font-semibold text-slate-900 placeholder:text-slate-400 outline-none transition-all focus:border-[#0B2F25] focus:bg-white focus:ring-2 focus:ring-[#0B2F25]/10"
          />
        </div>
      </section>

      {/* 5. Donor Information */}
      <section>
        <SectionHeader icon={User} title={t("Donor Information")} />

        <div className="space-y-3.5">
          {/* Row 1: Full Name & Mobile */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                {t("Full Name")} <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  value={donorName}
                  onChange={(e) => setDonorName(e.target.value)}
                  placeholder={t("Enter your name")}
                  disabled={isAnonymous}
                  className="w-full h-11 rounded-xl border border-[#E8E2D5] bg-white pl-10 pr-3.5 text-xs sm:text-sm font-medium text-slate-900 placeholder:text-slate-400 outline-none transition-all focus:border-[#0B2F25] focus:ring-2 focus:ring-[#0B2F25]/10 disabled:bg-slate-100 disabled:text-slate-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                {t("Mobile Number")} <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-600 font-semibold text-xs sm:text-sm">
                  <Phone className="w-4 h-4 mr-1 text-slate-400" />
                  +91
                </div>
                <input
                  type="tel"
                  maxLength={10}
                  value={donorPhone}
                  onChange={(e) => setDonorPhone(e.target.value.replace(/\D/g, ""))}
                  placeholder={t("Enter mobile number")}
                  className="w-full h-11 rounded-xl border border-[#E8E2D5] bg-white pl-18 pr-3.5 text-xs sm:text-sm font-medium text-slate-900 placeholder:text-slate-400 outline-none transition-all focus:border-[#0B2F25] focus:ring-2 focus:ring-[#0B2F25]/10"
                />
              </div>
            </div>
          </div>

          {/* Row 2: Email & Anonymous Checkbox */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 items-end">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                {t("Email Address (Optional)")}
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  value={donorEmail}
                  onChange={(e) => setDonorEmail(e.target.value)}
                  placeholder={t("Enter email address")}
                  className="w-full h-11 rounded-xl border border-[#E8E2D5] bg-white pl-10 pr-3.5 text-xs sm:text-sm font-medium text-slate-900 placeholder:text-slate-400 outline-none transition-all focus:border-[#0B2F25] focus:ring-2 focus:ring-[#0B2F25]/10"
                />
              </div>
            </div>

            <div className="h-11 flex items-center">
              <label className="inline-flex items-center gap-2.5 cursor-pointer select-none text-xs sm:text-sm font-semibold text-slate-800">
                <input
                  type="checkbox"
                  checked={isAnonymous}
                  onChange={(e) => setIsAnonymous(e.target.checked)}
                  className="h-4 w-4 rounded border-slate-300 text-[#0B2F25] focus:ring-[#0B2F25] accent-[#0B2F25]"
                />
                <span>{t("Donate Anonymously")}</span>
                <span
                  title={t("Your name will be kept private and not displayed on public donor lists.")}
                  className="text-slate-400 hover:text-slate-600"
                >
                  <HelpCircle className="w-3.5 h-3.5 inline" />
                </span>
              </label>
            </div>
          </div>

          {/* Row 3: Dedication / Offering Message */}
          <div>
            <div className="flex items-center justify-between gap-2 mb-1.5">
              <label className="text-xs font-bold text-slate-700">
                {t("Dedication / Offering Message (Optional)")}
              </label>
              <span className="text-[11px] font-medium text-slate-400 tabular-nums">
                {dedicationMessage.length}/200
              </span>
            </div>
            <div className="relative">
              <div className="pointer-events-none absolute top-3 left-3 text-slate-400">
                <PenLine className="w-4 h-4" />
              </div>
              <textarea
                maxLength={200}
                rows={2}
                value={dedicationMessage}
                onChange={(e) => setDedicationMessage(e.target.value)}
                placeholder={t("E.g., For family well-being, health, peace, etc.")}
                className="w-full rounded-xl border border-[#E8E2D5] bg-white pl-10 pr-3.5 py-2.5 text-xs sm:text-sm font-medium text-slate-900 placeholder:text-slate-400 outline-none transition-all focus:border-[#0B2F25] focus:ring-2 focus:ring-[#0B2F25]/10 resize-none"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
