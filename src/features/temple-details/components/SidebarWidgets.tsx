import { useTranslation } from "react-i18next";
import { Link } from "@tanstack/react-router";
import { Bell, MessageCircle, Navigation, Share2, Ticket } from "lucide-react";
import { CrowdBadge } from "@/components/shared/CrowdBadge";
import { temples, templeThumb } from "@/data/temples";

export function MobileActionBar({ t }: any) {
  const { t: tStr } = useTranslation();

  return (
    <div className="lg:hidden fixed bottom-16 inset-x-0 z-40 bg-white/95 backdrop-blur border-t border-border p-2 grid grid-cols-4 gap-2">
      <ActionBtn icon={<Navigation className="w-4 h-4" />} label={tStr("Navigate")} />
      <ActionBtn icon={<Bell className="w-4 h-4" />} label={tStr("Alert")} />
      <Link to="/booking/$slug" params={{ slug: t.slug || "" }} className="flex flex-col items-center justify-center gap-0.5 text-[11px] text-foreground/80"><Ticket className="w-4 h-4 text-saffron" />{tStr("VIP Darshan")}</Link>
      <Link to="/chat" className="flex flex-col items-center justify-center gap-0.5 text-[11px] text-foreground/80"><MessageCircle className="w-4 h-4" />{tStr("Ask AI")}</Link>
      <ActionBtn icon={<Share2 className="w-4 h-4" />} label={tStr("Share")} />
    </div>
  );
}

export function BookingWidget({ t }: any) {
  const { t: tStr } = useTranslation();

  return (
    <div className="bg-gradient-to-br from-emerald-50 to-teal-50/50 border border-emerald-100 rounded-3xl p-7 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group">
      <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none transition-all group-hover:bg-emerald-500/20"></div>

      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-2 text-emerald-700">
          <Ticket className="w-5 h-5" />
          <h3 className="font-serif text-xl font-bold text-slate-900">{tStr("Special Entry Darshan")}</h3>
        </div>
        <p className="text-sm text-slate-600 mb-6">{tStr("Skip the free darshan queue. Book your special entry tickets 24 hours in advance.")}</p>

        <Link to="/booking/$slug" params={{ slug: t.slug }} className="relative group inline-flex items-center justify-center w-full gap-2.5 text-sm font-bold text-white px-6 py-3.5 rounded-full transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_8px_25px_rgba(16,185,129,0.3)] bg-gradient-to-r from-emerald-500 to-teal-500 overflow-hidden">
          <span className="absolute inset-0 rounded-full border-2 border-emerald-400 animate-[ping_2s_ease-in-out_infinite] opacity-40 pointer-events-none" />
          <Ticket className="w-4 h-4 relative z-10" />
          <span className="relative z-10 tracking-wide">{tStr("Book VIP Darshan")}</span>
        </Link>
      </div>
    </div>
  );
}

function ActionBtn({ icon, label }: any) {
  return <button className="flex flex-col items-center justify-center gap-0.5 text-[11px] text-foreground/80">{icon}{label}</button>;
}

export function OtherTemples({ t }: any) {
  const { t: tStr } = useTranslation();

  const isUSA = t.state === "USA";

  let nearby: typeof temples = [];

  if (isUSA) {
    // For USA temples: show all other USA temples
    nearby = temples.filter(o => o.id !== t.id && o.state === "USA");
  } else {
    nearby = temples.filter(o => o.id !== t.id && o.district === t.district);

    if (nearby.length < 4) {
      const sameState = temples.filter(o => o.id !== t.id && o.state === t.state && !nearby.some(n => n.id === o.id));
      nearby = [...nearby, ...sameState];
    }

    if (nearby.length < 4) {
      const others = temples.filter(o => o.id !== t.id && o.state !== "USA" && !nearby.some(n => n.id === o.id));
      nearby = [...nearby, ...others];
    }
  }

  const finalNearby = nearby.slice(0, 4);

  const heading = isUSA ? tStr("Other Temples in USA") : `${tStr("Other temples in")} ${tStr(t.state)}`;

  return (
    <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300">
      <h3 className="font-serif text-lg font-bold text-slate-900 mb-3">{heading}</h3>
      <div className="space-y-2">
        {finalNearby.map(o => (
          <Link key={o.id} to="/temple/$slug" params={{ slug: o.slug }} className="group flex items-center gap-3 p-2.5 rounded-2xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
            <div className="w-11 h-11 rounded-xl shrink-0 border border-slate-100 shadow-sm group-hover:scale-105 transition-transform" style={{ background: templeThumb(o, "center 30%") }} role="img" aria-label={tStr(o.name)} />
            <div className="flex-1 min-w-0">
              <div className="font-serif text-sm font-bold text-slate-800 truncate group-hover:text-saffron transition-colors">{tStr(o.name)}</div>
              <div className="text-xs font-medium text-slate-500 mt-0.5">{tStr(o.city)}</div>
            </div>
            <CrowdBadge status={o.crowdStatus} />
          </Link>
        ))}
      </div>
    </div>
  );
}
