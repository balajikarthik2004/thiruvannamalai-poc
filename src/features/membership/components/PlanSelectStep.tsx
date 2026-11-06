import { useState } from "react";
import { Check, ArrowRight, ArrowLeft, ChevronDown, MapPin } from "lucide-react";
import { useTranslation } from "react-i18next";
import { templeThumb, type Temple } from "@/data/temples";
import {
  MEMBERSHIP_PLANS,
  UNIVERSAL_PERKS,
  MEMBERSHIP_FAQ,
  currencyFor,
  priceFor,
  formatMoney,
  type MembershipPlan,
} from "../data";

export function PlanSelectStep({
  temple,
  selectedPlan,
  onSelectPlan,
  onNext,
  onBack,
}: {
  temple: Temple;
  selectedPlan: string | null;
  onSelectPlan: (id: string) => void;
  onNext: () => void;
  onBack: () => void;
}) {
  const { t } = useTranslation();
  const currency = currencyFor(temple.state);
  const active = MEMBERSHIP_PLANS.find((p) => p.id === selectedPlan);

  return (
    <div className="fade-in">
      {/* Chosen temple recap */}
      <div className="flex items-center gap-3 bg-card border border-border rounded-2xl p-3 mb-6 shadow-sm">
        <div
          className="w-11 h-11 rounded-xl shrink-0 bg-secondary/40"
          style={{ background: templeThumb(temple) }}
        />
        <div className="min-w-0 flex-1">
          <div className="font-bold text-sm text-foreground truncate">{t(temple.name)}</div>
          <div className="text-xs text-muted-foreground flex items-center gap-1">
            <MapPin className="w-3 h-3 text-primary shrink-0" /> {t(temple.city)}
          </div>
        </div>
        <button
          onClick={onBack}
          className="shrink-0 text-xs font-bold text-primary hover:underline px-3 py-2 rounded-lg hover:bg-primary/5 transition-colors"
        >
          {t("Change")}
        </button>
      </div>

      <h2 className="font-serif text-2xl font-bold text-foreground text-center mb-1">
        {t("Choose your seva")}
      </h2>
      <p className="text-sm text-muted-foreground text-center mb-7">
        {t("Every plan includes an 80G receipt and a digital card.")}
      </p>

      {/* Plans */}
      <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-5">
        {MEMBERSHIP_PLANS.map((plan) => (
          <PlanCard
            key={plan.id}
            plan={plan}
            currency={currency}
            active={selectedPlan === plan.id}
            onSelect={() => onSelectPlan(plan.id)}
          />
        ))}
      </div>

      {/* Universal perks — one compact line */}
      <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 mb-10">
        {UNIVERSAL_PERKS.map((perk) => (
          <span
            key={perk}
            className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground"
          >
            <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
            {t(perk)}
          </span>
        ))}
      </div>

      <Faq />

      {/* Sticky continue bar */}
      <div className="sticky bottom-16 lg:bottom-4 mt-8 z-30">
        <div className="bg-card/95 backdrop-blur-md border border-border rounded-2xl shadow-lg p-3 flex items-center gap-3">
          <button
            onClick={onBack}
            className="shrink-0 w-11 h-11 rounded-xl bg-secondary/30 hover:bg-secondary/50 grid place-items-center text-foreground transition-colors"
            aria-label={t("Back")}
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div className="flex-1 min-w-0">
            {active ? (
              <>
                <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                  {t(active.name)}
                </div>
                <div className="font-serif font-bold text-lg text-foreground leading-tight">
                  {formatMoney(priceFor(active, currency), currency)}
                  <span className="text-xs font-sans font-medium text-muted-foreground ml-1">
                    {active.cycle === "lifetime" ? t("one-time") : t("/ year")}
                  </span>
                </div>
              </>
            ) : (
              <div className="text-sm font-semibold text-muted-foreground pl-1">
                {t("Select a plan to continue")}
              </div>
            )}
          </div>
          <button
            onClick={onNext}
            disabled={!selectedPlan}
            className="rounded-xl bg-primary text-primary-foreground px-6 py-3 text-sm font-bold flex items-center gap-2 shadow-md shadow-primary/20 transition-all hover:-translate-y-0.5 disabled:opacity-40 disabled:pointer-events-none active:scale-[0.98]"
          >
            {t("Continue")} <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

function PlanCard({
  plan,
  currency,
  active,
  onSelect,
}: {
  plan: MembershipPlan;
  currency: string;
  active: boolean;
  onSelect: () => void;
}) {
  const { t } = useTranslation();
  const Icon = plan.icon;

  return (
    <button
      onClick={onSelect}
      className={`relative text-left bg-card border-2 rounded-2xl p-5 flex flex-col transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${
        active
          ? "border-primary shadow-lg ring-4 ring-primary/10"
          : plan.popular
            ? "border-primary/40 shadow-sm"
            : "border-border/60 hover:border-primary/40"
      }`}
    >
      {plan.popular && (
        <div className="absolute -top-2.5 left-5 bg-primary text-primary-foreground text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full shadow-md">
          {t("Popular")}
        </div>
      )}

      <div className="flex items-center gap-2.5 mb-4">
        <div
          className={`w-9 h-9 rounded-xl bg-gradient-to-br ${plan.gradient} text-white grid place-items-center shadow-sm shrink-0`}
        >
          <Icon className="w-4.5 h-4.5" />
        </div>
        <div className="min-w-0">
          <h3 className="font-serif text-base font-bold text-foreground leading-tight truncate">
            {t(plan.name)}
          </h3>
          <div className="text-xs text-muted-foreground truncate">{t(plan.tagline)}</div>
        </div>
      </div>

      <div className="flex items-baseline gap-1">
        <span className="font-serif text-2xl font-extrabold text-foreground">
          {formatMoney(priceFor(plan, currency), currency)}
        </span>
        {plan.cycle === "year" && (
          <span className="text-xs font-medium text-muted-foreground">/{t("yr")}</span>
        )}
      </div>
      <div className="text-xs font-medium text-muted-foreground mb-4">{t(plan.note)}</div>

      <div className="space-y-2 border-t border-border/60 pt-3.5 flex-1">
        {plan.benefits.map((benefit) => (
          <div key={benefit} className="flex gap-2 text-xs leading-relaxed">
            <Check className="w-3.5 h-3.5 shrink-0 mt-px" style={{ color: plan.accent }} />
            <span className="text-foreground/75">{t(benefit)}</span>
          </div>
        ))}
      </div>

      <div
        className={`mt-4 w-full py-2.5 rounded-xl font-bold text-sm text-center transition-all ${
          active
            ? "bg-primary text-primary-foreground shadow-sm"
            : "bg-secondary/30 text-foreground"
        }`}
      >
        {active ? t("Selected") : t("Select")}
      </div>
    </button>
  );
}

function Faq() {
  const { t } = useTranslation();
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div className="max-w-2xl mx-auto">
      <div className="space-y-2">
        {MEMBERSHIP_FAQ.map((item, i) => (
          <div key={item.q} className="bg-card border border-border rounded-xl overflow-hidden">
            <button
              onClick={() => setOpen(open === i ? null : i)}
              className="w-full flex items-center justify-between gap-3 px-4 py-3 text-left hover:bg-secondary/10 transition-colors"
            >
              <span className="font-semibold text-sm text-foreground">{t(item.q)}</span>
              <ChevronDown
                className={`w-4 h-4 shrink-0 text-muted-foreground transition-transform ${open === i ? "rotate-180" : ""}`}
              />
            </button>
            {open === i && (
              <div className="px-4 pb-3.5 text-xs leading-relaxed text-muted-foreground animate-in fade-in slide-in-from-top-1">
                {t(item.a)}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
