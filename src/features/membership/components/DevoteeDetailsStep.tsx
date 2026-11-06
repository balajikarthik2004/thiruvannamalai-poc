import { useState } from "react";
import { ArrowRight, ArrowLeft, ChevronDown, Lock } from "lucide-react";
import { useTranslation } from "react-i18next";
import { templeThumb, type Temple } from "@/data/temples";
import { currencyFor, priceFor, formatMoney, type MembershipPlan } from "../data";

export interface DevoteeDetails {
  name: string;
  email: string;
  phone: string;
  nakshatra: string;
  gothram: string;
  pan: string;
  address: string;
}

const NAKSHATRAS = [
  "Ashwini",
  "Bharani",
  "Krittika",
  "Rohini",
  "Mrigashira",
  "Ardra",
  "Punarvasu",
  "Pushya",
  "Ashlesha",
  "Magha",
  "Purva Phalguni",
  "Uttara Phalguni",
  "Hasta",
  "Chitra",
  "Swati",
  "Vishakha",
  "Anuradha",
  "Jyeshtha",
  "Mula",
  "Purva Ashadha",
  "Uttara Ashadha",
  "Shravana",
  "Dhanishta",
  "Shatabhisha",
  "Purva Bhadrapada",
  "Uttara Bhadrapada",
  "Revati",
];

export const EMPTY_DEVOTEE: DevoteeDetails = {
  name: "",
  email: "",
  phone: "",
  nakshatra: "",
  gothram: "",
  pan: "",
  address: "",
};

const PAN_RE = /^[A-Z]{5}[0-9]{4}[A-Z]$/;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function isDevoteeValid(d: DevoteeDetails) {
  return (
    d.name.trim().length >= 3 &&
    EMAIL_RE.test(d.email.trim()) &&
    d.phone.replace(/\D/g, "").length >= 10 &&
    (d.pan.trim() === "" || PAN_RE.test(d.pan.trim().toUpperCase()))
  );
}

export function DevoteeDetailsStep({
  temple,
  plan,
  details,
  setDetails,
  onNext,
  onBack,
}: {
  temple: Temple;
  plan: MembershipPlan;
  details: DevoteeDetails;
  setDetails: (d: DevoteeDetails) => void;
  onNext: () => void;
  onBack: () => void;
}) {
  const { t } = useTranslation();
  const [showOptional, setShowOptional] = useState(false);
  const currency = currencyFor(temple.state);
  const amount = priceFor(plan, currency);
  const valid = isDevoteeValid(details);

  const set = (key: keyof DevoteeDetails) => (value: string) =>
    setDetails({ ...details, [key]: value });

  const phoneDigits = details.phone.replace(/\D/g, "");
  const panError = details.pan.trim() !== "" && !PAN_RE.test(details.pan.trim().toUpperCase());

  return (
    <div className="fade-in max-w-lg mx-auto">
      {/* Order summary */}
      <div className="bg-card border border-border rounded-2xl p-3.5 mb-6 shadow-sm flex items-center gap-3.5">
        <div
          className="w-11 h-11 rounded-xl shrink-0"
          style={{ background: templeThumb(temple) }}
        />
        <div className="min-w-0 flex-1">
          <div className="font-bold text-sm text-foreground truncate">{t(temple.name)}</div>
          <div className="text-xs text-muted-foreground">{t(plan.name)}</div>
        </div>
        <div className="text-right shrink-0">
          <div className="font-serif text-lg font-extrabold text-foreground leading-tight">
            {formatMoney(amount, currency)}
          </div>
          <button onClick={onBack} className="text-xs font-bold text-primary hover:underline">
            {t("Change")}
          </button>
        </div>
      </div>

      <h2 className="font-serif text-2xl font-bold text-foreground text-center mb-1">
        {t("Your details")}
      </h2>
      <p className="text-sm text-muted-foreground text-center mb-6">
        {t("Printed on your membership card and receipt.")}
      </p>

      <div className="bg-card border border-border rounded-2xl p-5 shadow-sm space-y-4">
        <Field
          label="Full name"
          value={details.name}
          onChange={set("name")}
          placeholder={t("e.g. Ramesh Subramanian")}
          error={
            details.name.length > 0 && details.name.trim().length < 3
              ? t("Please enter your full name")
              : ""
          }
        />

        <Field
          label="E-mail"
          type="email"
          value={details.email}
          onChange={set("email")}
          placeholder="devotee@example.com"
          error={
            details.email.length > 0 && !EMAIL_RE.test(details.email.trim())
              ? t("Enter a valid e-mail address")
              : ""
          }
        />

        <Field
          label="Mobile"
          type="tel"
          inputMode="numeric"
          prefix={currency === "USD" ? "+1" : "+91"}
          value={details.phone}
          onChange={(v) => set("phone")(v.replace(/\D/g, "").slice(0, 11))}
          placeholder={currency === "USD" ? "5551234567" : "9876543210"}
          error={
            phoneDigits.length > 0 && phoneDigits.length < 10
              ? t("Enter a valid mobile number")
              : ""
          }
        />

        {/* Optional block, collapsed by default */}
        <div className="border-t border-border/60 pt-4">
          <button
            onClick={() => setShowOptional((v) => !v)}
            className="w-full flex items-center justify-between gap-3 text-left group"
          >
            <div>
              <div className="text-xs font-bold text-foreground group-hover:text-primary transition-colors">
                {t("Archana & tax details")}
              </div>
              <div className="text-xs text-muted-foreground">
                {t("Optional — add now or later from your profile")}
              </div>
            </div>
            <ChevronDown
              className={`w-4 h-4 shrink-0 text-muted-foreground transition-transform ${showOptional ? "rotate-180" : ""}`}
            />
          </button>

          {showOptional && (
            <div className="mt-4 space-y-4 animate-in fade-in slide-in-from-top-1">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <FieldLabel label="Birth star" />
                  <select
                    value={details.nakshatra}
                    onChange={(e) => set("nakshatra")(e.target.value)}
                    className="w-full bg-secondary/15 border-2 border-border/60 rounded-xl px-3.5 py-2.5 text-sm font-semibold outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all cursor-pointer"
                  >
                    <option value="">{t("Select")}</option>
                    {NAKSHATRAS.map((n) => (
                      <option key={n} value={n}>
                        {n}
                      </option>
                    ))}
                  </select>
                </div>
                <Field
                  label="Gothram"
                  value={details.gothram}
                  onChange={set("gothram")}
                  placeholder={t("e.g. Bharadwaja")}
                />
              </div>

              <Field
                label="PAN (for 80G)"
                value={details.pan}
                onChange={(v) => set("pan")(v.toUpperCase().slice(0, 10))}
                placeholder="ABCDE1234F"
                error={panError ? t("PAN must look like ABCDE1234F") : ""}
              />

              <Field
                label="Postal address"
                multiline
                value={details.address}
                onChange={set("address")}
                placeholder={t("Where the printed card is couriered")}
              />
            </div>
          )}
        </div>

        <div className="flex items-start gap-2.5 pt-1">
          <Lock className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
          <p className="text-xs text-muted-foreground leading-relaxed">
            {t(
              "Shared only with the temple trust and the payment gateway. Card details are never stored.",
            )}
          </p>
        </div>
      </div>

      <div className="sticky bottom-16 lg:bottom-4 mt-6 z-30">
        <div className="bg-card/95 backdrop-blur-md border border-border rounded-2xl shadow-lg p-3 flex items-center gap-3">
          <button
            onClick={onBack}
            className="shrink-0 w-11 h-11 rounded-xl bg-secondary/30 hover:bg-secondary/50 grid place-items-center text-foreground transition-colors"
            aria-label={t("Back")}
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div className="flex-1 min-w-0 pl-1">
            <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
              {t("Total")}
            </div>
            <div className="font-serif font-bold text-lg text-foreground leading-tight">
              {formatMoney(amount, currency)}
            </div>
          </div>
          <button
            onClick={onNext}
            disabled={!valid}
            className="rounded-xl bg-primary text-primary-foreground px-6 py-3 text-sm font-bold flex items-center gap-2 shadow-md shadow-primary/20 transition-all hover:-translate-y-0.5 disabled:opacity-40 disabled:pointer-events-none active:scale-[0.98]"
          >
            {t("Pay")} <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

function FieldLabel({ label }: { label: string }) {
  const { t } = useTranslation();
  return (
    <label className="block text-[11px] font-bold uppercase tracking-widest text-muted-foreground mb-1.5">
      {t(label)}
    </label>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  error,
  type = "text",
  inputMode,
  prefix,
  multiline,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  error?: string;
  type?: string;
  inputMode?: "numeric" | "text";
  prefix?: string;
  multiline?: boolean;
}) {
  const base = `w-full bg-secondary/15 border-2 rounded-xl px-3.5 py-2.5 text-sm font-semibold outline-none transition-all placeholder:font-normal placeholder:text-muted-foreground ${
    error
      ? "border-red-400 focus:border-red-500 focus:ring-4 focus:ring-red-500/10"
      : "border-border/60 focus:border-primary focus:ring-4 focus:ring-primary/10"
  }`;

  return (
    <div>
      <FieldLabel label={label} />
      {multiline ? (
        <textarea
          rows={2}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={`${base} resize-none`}
        />
      ) : prefix ? (
        <div
          className={`flex items-stretch rounded-xl border-2 overflow-hidden transition-all ${
            error
              ? "border-red-400"
              : "border-border/60 focus-within:border-primary focus-within:ring-4 focus-within:ring-primary/10"
          }`}
        >
          <span className="grid place-items-center px-3 bg-secondary/30 text-sm font-bold text-muted-foreground border-r border-border/60">
            {prefix}
          </span>
          <input
            type={type}
            inputMode={inputMode}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="flex-1 bg-secondary/15 px-3.5 py-2.5 text-sm font-semibold outline-none placeholder:font-normal placeholder:text-muted-foreground"
          />
        </div>
      ) : (
        <input
          type={type}
          inputMode={inputMode}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={base}
        />
      )}
      {error && <p className="mt-1.5 text-[11px] font-semibold text-red-600">{error}</p>}
    </div>
  );
}
