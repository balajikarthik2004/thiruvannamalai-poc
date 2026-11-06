import { createFileRoute, Link } from "@tanstack/react-router";
import { temples } from "@/data/temples";
import { CrowdBadge } from "@/components/shared/CrowdBadge";
import { useTranslation } from "react-i18next";

export const Route = createFileRoute("/_app/profile")({
  head: () => ({ meta: [{ title: "My profile — OMG Smart Temple" }] }),
  component: ProfilePage,
});

function ProfilePage() {
  const { t } = useTranslation();
  const watchlist = temples.slice(0, 2);
  return (
    <div className="max-w-3xl mx-auto px-4 lg:px-8 pt-6 pb-10">
      <div className="bg-card border border-border rounded-2xl card-soft p-6 flex items-center gap-4">
        <div className="w-16 h-16 rounded-full gradient-saffron text-white flex items-center justify-center font-serif text-2xl">RA</div>
        <div>
          <div className="font-serif text-xl font-semibold">{t("Ramesh Anandan")}</div>
          <div className="text-xs text-muted-foreground">{t("Devotee since 2024")}</div>
          <div className="flex gap-4 mt-2 text-xs">
            <span><b className="text-foreground font-serif">7</b> {t("visited")}</span>
            <span><b className="text-foreground font-serif">2</b> {t("planned")}</span>
            <span><b className="text-foreground font-serif">4</b> {t("alerts")}</span>
          </div>
        </div>
      </div>

      <section className="mt-6">
        <div className="font-serif text-lg font-semibold mb-3">{t("My watchlist")}</div>
        <div className="grid sm:grid-cols-2 gap-3">
          {watchlist.map(tData => (
            <Link key={tData.id} to="/temple/$slug" params={{ slug: tData.slug }} className="bg-card border border-border rounded-2xl p-4 card-soft flex items-center gap-3">
              <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-serif" style={{ background: tData.color }}>ॐ</div>
              <div className="flex-1 min-w-0">
                <div className="font-serif font-semibold truncate">{t(tData.name)}</div>
                <div className="flex items-center gap-2 mt-0.5"><CrowdBadge status={tData.crowdStatus} /><span className="text-xs text-muted-foreground">{tData.waitMin}{t("m")}</span></div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-6 bg-card border border-border rounded-2xl p-5 card-soft">
        <div className="font-serif text-lg font-semibold mb-3">{t("Planned visits")}</div>
        <div className="border border-saffron/30 bg-saffron/5 rounded-xl p-4">
          <div className="font-medium">{t("Tomorrow · Tiruvannamalai Arunachaleswarar Temple · 3:30 PM")}</div>
          <div className="text-sm text-muted-foreground mt-1">{t("AI suggested this time — LOW crowd expected.")}</div>
          <div className="mt-3 flex gap-2 text-sm"><button className="rounded-full bg-foreground text-background px-3 py-1">{t("Directions")}</button><button className="rounded-full bg-white border border-border px-3 py-1">{t("Edit")}</button></div>
        </div>
      </section>

      <section className="mt-6 bg-card border border-border rounded-2xl p-5 card-soft">
        <div className="font-serif text-lg font-semibold mb-3">{t("My temple visits")}</div>
        <div className="space-y-4">
          <Visit date={t("15 May 2025")} temple={t("Kapaleeshwarar Temple, Chennai")} note={t("Visited at 7:30 AM — Very peaceful")} stars={5} t={t} />
          <Visit date={t("28 Apr 2025")} temple={t("Srirangam Temple, Trichy")} note={t("Visited at 4:00 PM — Moderate crowd")} stars={4} t={t} />
        </div>
      </section>

      <section className="mt-6 bg-card border border-border rounded-2xl p-5 card-soft">
        <div className="font-serif text-lg font-semibold mb-3">{t("Devotee preferences")}</div>
        <Field label={t("Home district")} value={t("Chennai")} />
        <Field label={t("Preferred visit time")} value={t("Evening")} />
        <Field label={t("Accessibility needs")} value={t("None")} />
        <Field label={t("Language")} value={t("Tamil / English")} />
      </section>
    </div>
  );
}

function Visit({ date, temple, note, stars, t }: any) {
  return (
    <div className="border-l-2 border-saffron/40 pl-4">
      <div className="text-xs text-muted-foreground">📅 {date}</div>
      <div className="font-serif font-semibold">{temple}</div>
      <div className="text-sm text-muted-foreground mt-0.5">"{note}"</div>
      <div className="text-sm text-gold mt-1">{"⭐".repeat(stars)}</div>
    </div>
  );
}

function Field({ label, value }: any) {
  return (
    <div className="flex justify-between py-2.5 border-b border-border last:border-0 text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}
