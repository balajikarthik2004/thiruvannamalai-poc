import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import QRCode from "react-qr-code";
import {
  BadgeCheck,
  MapPin,
  CalendarDays,
  User,
  Mail,
  Phone,
  Star,
  Receipt,
  ShieldCheck,
  AlertTriangle,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { temples, templeThumb } from "@/data/temples";
import { MEMBERSHIP_PLANS, formatMoney } from "@/features/membership/data";
import { decodeMembership } from "@/features/membership/card";
import { LanguageSwitcher } from "@/components/layout/LanguageSwitcher";

export const Route = createFileRoute("/membership-card")({
  head: () => ({ meta: [{ title: "Membership Card — OMG Smart Temple" }] }),
  component: MembershipCardPage,
});

function MembershipCardPage() {
  const { t } = useTranslation();
  const [token, setToken] = useState<string | null>(null);

  // The payload rides in the URL fragment, so it is only ever readable here.
  useEffect(() => {
    const read = () => setToken(window.location.hash.replace(/^#/, ""));
    read();
    window.addEventListener("hashchange", read);
    return () => window.removeEventListener("hashchange", read);
  }, []);

  if (token === null) return null;

  const payload = decodeMembership(token);
  if (!payload) return <InvalidCard />;

  const temple = temples.find((x) => x.slug === payload.templeSlug);
  const plan = MEMBERSHIP_PLANS.find((p) => p.id === payload.planId);
  if (!temple || !plan) return <InvalidCard />;

  const lifetime = payload.validTill === "life";
  const expiresOn = lifetime ? null : new Date(payload.validTill);
  const active = lifetime || (expiresOn ? expiresOn.getTime() > Date.now() : false);
  const Icon = plan.icon;

  const fmtDate = (d: Date) =>
    d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });

  return (
    <div className="min-h-screen bg-background">
      {/* Verification banner */}
      <div className={`px-4 py-3 text-white ${active ? "bg-emerald-600" : "bg-red-600"}`}>
        <div className="max-w-lg mx-auto flex items-center gap-2.5">
          {active ? (
            <BadgeCheck className="w-5 h-5 shrink-0" />
          ) : (
            <AlertTriangle className="w-5 h-5 shrink-0" />
          )}
          <div className="min-w-0 flex-1">
            <div className="font-bold text-sm leading-tight">
              {active ? t("Verified Membership") : t("Membership Expired")}
            </div>
            <div className="text-xs text-white/80 leading-tight">
              {active
                ? t("Issued by OMG Smart Temple Trust")
                : `${t("Expired on")} ${expiresOn ? fmtDate(expiresOn) : "—"}`}
            </div>
          </div>
          <LanguageSwitcher className="w-8 h-8 text-white shrink-0" />
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 py-6 pb-16">
        {/* Card */}
        <div
          className="relative rounded-3xl overflow-hidden shadow-xl mb-5"
          style={{ background: "linear-gradient(135deg, #131a72 0%, #1e2680 55%, #e32c26 100%)" }}
        >
          <div className="absolute -top-16 -right-16 w-56 h-56 bg-white/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 p-6 text-white">
            <div className="flex items-start justify-between gap-4 mb-7">
              <div className="min-w-0">
                <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/50 mb-1">
                  {t("OMG Smart Temple")}
                </div>
                <div className="font-serif text-xl font-bold leading-tight">{t(plan.name)}</div>
                <div className="text-xs text-white/60 mt-0.5">{plan.sanskritName}</div>
              </div>
              <div
                className={`w-11 h-11 rounded-xl bg-gradient-to-br ${plan.gradient} grid place-items-center shadow-lg shrink-0`}
              >
                <Icon className="w-5 h-5 text-white" />
              </div>
            </div>

            <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/45">
              {t("Member")}
            </div>
            <div className="font-bold text-2xl leading-tight mb-5 break-words">{payload.name}</div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/45">
                  {t("Member ID")}
                </div>
                <div className="font-mono text-sm font-bold">{payload.memberId}</div>
              </div>
              <div>
                <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/45">
                  {t("Valid Till")}
                </div>
                <div className="text-sm font-bold">
                  {lifetime ? t("Lifetime") : expiresOn ? fmtDate(expiresOn) : "—"}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* What you get — plain language, first thing after the card */}
        <Section title="What you get">
          <div className="divide-y divide-border/60">
            {plan.cardBenefits.map((b, i) => (
              <div key={b.title} className="flex gap-3 p-4">
                <span
                  className="w-6 h-6 shrink-0 rounded-full grid place-items-center text-xs font-bold text-white mt-0.5"
                  style={{ background: plan.accent }}
                >
                  {i + 1}
                </span>
                <div className="min-w-0">
                  <div className="font-bold text-sm text-foreground leading-snug">{t(b.title)}</div>
                  <p className="text-sm text-muted-foreground leading-relaxed mt-1">
                    {t(b.detail)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Section>

        {/* Temple */}
        <Section title="Temple">
          <div className="flex items-center gap-3.5 p-4">
            <div
              className="w-14 h-14 rounded-xl shrink-0"
              style={{ background: templeThumb(temple) }}
            />
            <div className="min-w-0">
              <div className="font-bold text-sm text-foreground">{t(temple.name)}</div>
              <div className="text-sm text-muted-foreground truncate">{t(temple.deity)}</div>
              <div className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                <MapPin className="w-3 h-3 text-primary shrink-0" /> {t(temple.city)},{" "}
                {t(temple.state)}
              </div>
            </div>
          </div>
        </Section>

        {/* Member details */}
        <Section title="Devotee Details">
          <dl className="divide-y divide-border/60">
            <Row icon={User} label="Name" value={payload.name} />
            <Row icon={Mail} label="E-mail" value={payload.email} />
            <Row icon={Phone} label="Mobile" value={payload.phone} />
            {payload.nakshatra && (
              <Row icon={Star} label="Nakshatra" value={t(payload.nakshatra)} />
            )}
            {payload.gothram && <Row icon={Star} label="Gothram" value={payload.gothram} />}
            {payload.pan && <Row icon={Receipt} label="PAN (80G)" value={payload.pan} mono />}
          </dl>
        </Section>

        {/* Membership */}
        <Section title="Membership">
          <dl className="divide-y divide-border/60">
            <Row icon={BadgeCheck} label="Plan" value={t(plan.name)} />
            <Row icon={CalendarDays} label="Issued On" value={fmtDate(new Date(payload.issued))} />
            <Row
              icon={CalendarDays}
              label="Valid Till"
              value={
                lifetime ? t("Lifetime — never expires") : expiresOn ? fmtDate(expiresOn) : "—"
              }
            />
            <Row icon={Receipt} label="Payment Ref" value={payload.paymentId} mono />
            <Row
              icon={Receipt}
              label="Amount Paid"
              value={formatMoney(payload.amount, payload.currency)}
            />
          </dl>
        </Section>

        {/* Counter QR */}
        <div className="bg-card border border-border rounded-2xl p-5 flex items-center gap-4 mb-5">
          <div className="bg-white p-2 rounded-xl border border-border shrink-0">
            <QRCode value={payload.memberId} size={72} bgColor="#FFFFFF" fgColor="#131a72" />
          </div>
          <div className="min-w-0">
            <div className="font-bold text-sm text-foreground mb-1">
              {t("Show at the members' counter")}
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {t(
                "Temple staff scan this code to confirm your ID and let you into the priority lane.",
              )}
            </p>
          </div>
        </div>

        <div className="flex items-start gap-2.5 bg-emerald-50 border border-emerald-200 rounded-xl p-3.5 mb-6">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
          <p className="text-xs font-medium text-emerald-800 leading-relaxed">
            {t(
              "These details are carried inside the QR code itself and shown only on this device. Nothing is sent to a server when you scan this card.",
            )}
          </p>
        </div>

        <Link
          to="/"
          className="block text-center py-3.5 rounded-xl bg-primary text-primary-foreground text-sm font-bold shadow-md shadow-primary/20"
        >
          {t("Open OMG Smart Temple")}
        </Link>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  const { t } = useTranslation();
  return (
    <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm mb-4">
      <div className="px-4 py-2.5 border-b border-border bg-secondary/10">
        <span className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
          {t(title)}
        </span>
      </div>
      {children}
    </div>
  );
}

function Row({
  icon: Icon,
  label,
  value,
  mono,
}: {
  icon: any;
  label: string;
  value: string;
  mono?: boolean;
}) {
  const { t } = useTranslation();
  return (
    <div className="px-4 py-3 flex items-center gap-3">
      <Icon className="w-3.5 h-3.5 text-primary shrink-0" />
      <dt className="text-sm font-semibold text-muted-foreground shrink-0">{t(label)}</dt>
      <dd
        className={`ml-auto text-sm font-bold text-foreground text-right break-all ${mono ? "font-mono" : ""}`}
      >
        {value}
      </dd>
    </div>
  );
}

function InvalidCard() {
  const { t } = useTranslation();
  return (
    <div className="min-h-screen grid place-items-center bg-background px-4">
      <div className="max-w-sm text-center bg-card border border-border rounded-3xl p-8 shadow-sm">
        <div className="w-14 h-14 rounded-full bg-red-50 grid place-items-center mx-auto mb-5">
          <AlertTriangle className="w-7 h-7 text-red-500" />
        </div>
        <h1 className="font-serif text-2xl font-bold text-foreground mb-2">
          {t("Card not readable")}
        </h1>
        <p className="text-sm text-muted-foreground leading-relaxed mb-6">
          {t(
            "This link is incomplete or the card has been reissued. Please scan the QR on your latest membership card again.",
          )}
        </p>
        <Link
          to="/membership"
          className="inline-block px-6 py-3 rounded-xl bg-primary text-primary-foreground text-sm font-bold shadow-md"
        >
          {t("Go to Membership")}
        </Link>
      </div>
    </div>
  );
}
