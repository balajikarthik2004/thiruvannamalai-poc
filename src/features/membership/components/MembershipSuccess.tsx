import QRCode from "react-qr-code";
import { Link } from "@tanstack/react-router";
import { CheckCircle2, Printer, Home, Smartphone } from "lucide-react";
import { useTranslation } from "react-i18next";
import type { Temple } from "@/data/temples";
import { currencyFor, priceFor, formatMoney, type MembershipPlan } from "../data";
import { membershipCardUrl, type MembershipCardPayload } from "../card";
import type { DevoteeDetails } from "./DevoteeDetailsStep";
import type { PaymentResult } from "./RazorpayCheckout";

export function MembershipSuccess({
  temple,
  plan,
  devotee,
  payment,
  onReset,
}: {
  temple: Temple;
  plan: MembershipPlan;
  devotee: DevoteeDetails;
  payment: PaymentResult;
  onReset: () => void;
}) {
  const { t } = useTranslation();
  const currency = currencyFor(temple.state);
  const amount = priceFor(plan, currency);
  const Icon = plan.icon;

  const issued = new Date();
  const expiry = new Date(issued);
  expiry.setFullYear(expiry.getFullYear() + 1);

  const iso = (d: Date) => d.toISOString().slice(0, 10);
  const lifetime = plan.cycle === "lifetime";
  const memberId = `OMG-${plan.id.slice(0, 3).toUpperCase()}-${payment.paymentId.slice(-6).toUpperCase()}`;
  const validity = lifetime
    ? t("Lifetime")
    : expiry.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });

  const payload: MembershipCardPayload = {
    memberId,
    name: devotee.name,
    email: devotee.email,
    phone: devotee.phone,
    planId: plan.id,
    templeSlug: temple.slug,
    amount,
    currency,
    issued: iso(issued),
    validTill: lifetime ? "life" : iso(expiry),
    paymentId: payment.paymentId,
    nakshatra: devotee.nakshatra,
    gothram: devotee.gothram,
    pan: devotee.pan.toUpperCase(),
  };

  const cardUrl = membershipCardUrl(payload);

  return (
    <div className="fade-in max-w-lg mx-auto">
      <div className="text-center mb-7">
        <div className="w-16 h-16 rounded-full bg-emerald-50 border-4 border-emerald-100 grid place-items-center mx-auto mb-4">
          <CheckCircle2 className="w-9 h-9 text-emerald-500" />
        </div>
        <h2 className="font-serif text-2xl font-bold text-foreground mb-1.5">
          {t("Welcome, Sevak 🙏")}
        </h2>
        <p className="text-sm text-muted-foreground">
          {t("Receipt sent to")}{" "}
          <span className="font-semibold text-foreground">{devotee.email}</span>
        </p>
      </div>

      {/* Digital membership card */}
      <div
        className="relative rounded-3xl overflow-hidden shadow-xl mb-4 print:shadow-none"
        style={{ background: "linear-gradient(135deg, #131a72 0%, #1e2680 55%, #e32c26 100%)" }}
      >
        <div className="absolute -top-16 -right-16 w-56 h-56 bg-white/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 p-5 text-white">
          <div className="flex items-start justify-between gap-4 mb-5">
            <div className="min-w-0">
              <div className="text-[9px] font-bold uppercase tracking-[0.2em] text-white/50 mb-1">
                {t("OMG Smart Temple")}
              </div>
              <div className="font-serif text-lg font-bold leading-tight">{t(plan.name)}</div>
            </div>
            <div
              className={`w-10 h-10 rounded-xl bg-gradient-to-br ${plan.gradient} grid place-items-center shadow-lg shrink-0`}
            >
              <Icon className="w-5 h-5 text-white" />
            </div>
          </div>

          <div className="flex items-end justify-between gap-4">
            <div className="min-w-0 flex-1 space-y-3">
              <div>
                <div className="text-[9px] font-bold uppercase tracking-[0.18em] text-white/45">
                  {t("Member")}
                </div>
                <div className="font-bold text-base truncate">{devotee.name}</div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <div className="text-[9px] font-bold uppercase tracking-[0.18em] text-white/45">
                    {t("ID")}
                  </div>
                  <div className="font-mono text-[11px] font-bold">{memberId}</div>
                </div>
                <div>
                  <div className="text-[9px] font-bold uppercase tracking-[0.18em] text-white/45">
                    {t("Valid Till")}
                  </div>
                  <div className="text-[11px] font-bold">{validity}</div>
                </div>
              </div>
            </div>

            <div className="shrink-0 bg-white p-2 rounded-xl">
              <QRCode value={cardUrl} size={92} bgColor="#FFFFFF" fgColor="#131a72" level="L" />
            </div>
          </div>
        </div>
      </div>

      {/* Scan hint */}
      <div className="flex items-start gap-2.5 bg-primary/5 border border-primary/15 rounded-xl p-3.5 mb-5">
        <Smartphone className="w-4 h-4 text-primary shrink-0 mt-0.5" />
        <p className="text-xs text-foreground/75 leading-relaxed">
          {t(
            "Scan this QR with any phone camera to open your full membership details — plan, validity, entitlements and payment reference.",
          )}
        </p>
      </div>

      {/* Receipt */}
      <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm mb-6">
        <dl className="divide-y divide-border/60">
          <Row label="Temple" value={t(temple.name)} />
          <Row label="Payment ID" value={payment.paymentId} mono />
          <Row label="Method" value={`${payment.method} · ${payment.instrument}`} />
          {payment.emiTenure ? (
            <Row label="Instalments" value={`${payment.emiTenure} ${t("months")}`} />
          ) : null}
          <div className="px-4 py-3.5 flex items-center justify-between bg-primary/5">
            <dt className="text-sm font-bold text-foreground">{t("Paid")}</dt>
            <dd className="font-serif text-lg font-extrabold text-foreground">
              {formatMoney(amount, currency)}
            </dd>
          </div>
        </dl>
      </div>

      {/* Actions */}
      <div className="grid grid-cols-2 gap-3 print:hidden">
        <button
          onClick={() => window.print()}
          className="flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-border/60 bg-card text-sm font-bold text-foreground hover:border-primary/40 transition-all"
        >
          <Printer className="w-4 h-4" /> {t("Print")}
        </button>
        <Link
          to="/"
          className="flex items-center justify-center gap-2 py-3 rounded-xl bg-primary text-primary-foreground text-sm font-bold shadow-md shadow-primary/20 hover:-translate-y-0.5 transition-all"
        >
          <Home className="w-4 h-4" /> {t("Done")}
        </Link>
      </div>

      <button
        onClick={onReset}
        className="w-full mt-4 text-sm font-bold text-primary hover:underline print:hidden"
      >
        {t("Add another membership")}
      </button>
    </div>
  );
}

function Row({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  const { t } = useTranslation();
  return (
    <div className="px-4 py-3 flex items-center justify-between gap-4">
      <dt className="text-sm font-semibold text-muted-foreground shrink-0">{t(label)}</dt>
      <dd
        className={`text-sm font-bold text-foreground text-right truncate ${mono ? "font-mono" : ""}`}
      >
        {value}
      </dd>
    </div>
  );
}
