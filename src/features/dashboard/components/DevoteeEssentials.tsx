import { useTranslation } from "react-i18next";
import { Link } from "@tanstack/react-router";
import { ArrowRight, LayoutGrid, CalendarDays, Ticket, Soup, Coins, HeartHandshake, BellRing } from "lucide-react";
import { temples, type Temple } from "@/data/temples";

export function DevoteeEssentials({ activeTemple }: { activeTemple: Temple }) {
  const { t } = useTranslation();
  // Fastest-moving queue right now (excluding the temple already in focus).
  const fastest = [...temples].filter((x) => x.id !== activeTemple.id).sort((a, b) => a.waitMin - b.waitMin)[0];

  const services = [
    { label: "Book Darshan", icon: Ticket, to: "/booking/$slug" as const, params: { slug: activeTemple.slug } },
    { label: "Order Prasadam", icon: Soup, to: "/store/$storeId" as const, params: { storeId: `store-${activeTemple.slug}` } },
    { label: "Digital Hundi", icon: Coins, to: "/donations" as const },
    { label: "Donate Annadhanam", icon: HeartHandshake, to: "/donations" as const },
  ];

  return (
    <section>
      <h2 className="flex items-center gap-2 font-serif text-xl font-bold text-slate-900 mb-4">
        <LayoutGrid className="w-5 h-5 text-[#C48437]" /> {t("Devotee Essentials")}
      </h2>

      <div className="grid gap-4 grid-cols-2 md:grid-cols-4 xl:grid-cols-[1.6fr_repeat(4,minmax(0,0.75fr))_1.5fr]">
        {/* Panchangam */}
        <div className="col-span-2 md:col-span-4 xl:col-span-1 relative overflow-hidden rounded-2xl border border-[#E8E2D5] bg-gradient-to-br from-[#FAF6F0] to-[#F5EFE6] p-4 shadow-xs">
          <img src="/store/diya.png" alt="" aria-hidden className="absolute right-3 top-3 w-12 h-12 object-cover rounded-xl opacity-95" />
          <div className="relative flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-white border border-[#E8E2D5] text-[#C48437] flex items-center justify-center shadow-xs"><CalendarDays className="w-4 h-4" /></span>
            <span className="text-xs font-bold text-[#C48437]">{t("Panchangam")}</span>
            <span className="text-[10px] font-bold text-slate-600 bg-white border border-[#E8E2D5] px-2 py-0.5 rounded-full">{t("Valarpirai")}</span>
          </div>
          <div className="relative font-serif text-xl font-bold text-[#0B2F25] mt-2">{t("Pradosham")}</div>
          <p className="relative text-xs text-slate-600 mt-0.5 leading-snug">{t("Highly auspicious day for Lord Shiva. Special abhishekam begins at 4:30 PM.")}</p>
        </div>

        {/* Quick services */}
        {services.map((s) => (
          <Link
            key={s.label}
            to={s.to}
            params={s.params as any}
            className="group flex flex-col items-center justify-center gap-1.5 rounded-2xl border border-[#E8E2D5] bg-white px-2 py-3 text-center shadow-xs hover:shadow-md hover:border-[#0B2F25]/40 hover:-translate-y-0.5 transition-all"
          >
            <span className="w-10 h-10 rounded-xl bg-[#FAF6F0] text-[#0B2F25] flex items-center justify-center shrink-0 group-hover:bg-[#0B2F25] group-hover:text-white transition-colors">
              <s.icon className="w-5 h-5" />
            </span>
            <span className="text-[13px] font-bold text-slate-800 leading-tight">{t(s.label)}</span>
          </Link>
        ))}

        {/* Live alert */}
        {fastest && (
          <div className="col-span-2 md:col-span-4 xl:col-span-1 rounded-2xl border border-amber-200/80 bg-gradient-to-br from-[#FFFBEB] to-[#FAF6F0] p-4 flex flex-col justify-between shadow-xs">
            <div>
              <div className="flex items-center gap-2 text-sm font-bold text-[#C48437]">
                <BellRing className="w-4 h-4" /> {t("Live Alert")}
              </div>
              <p className="text-[13px] text-slate-700 mt-1 leading-snug">
                <strong className="text-slate-900">{t(fastest.name)}</strong> {t("queue is moving fast right now. Estimated wait is only")}{" "}
                <strong className="text-slate-900">{fastest.waitMin} {t("mins")}</strong>.
              </p>
            </div>
            <Link to="/temple/$slug" params={{ slug: fastest.slug }} className="mt-1.5 inline-flex items-center gap-1.5 text-[13px] font-bold text-[#C48437] hover:underline w-fit">
              {t("View Live Crowd")} <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
