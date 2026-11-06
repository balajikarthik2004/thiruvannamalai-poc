import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useState } from "react";
import { temples } from "@/data/temples";
import { MapPin, ArrowLeft, Flame } from "lucide-react";
import { useTranslation } from "react-i18next";

export const Route = createFileRoute("/_app/poojas")({
  validateSearch: (search: Record<string, unknown>) => {
    return {
      temple: (search.temple as string) || "tiruvannamalai",
    };
  },
  head: () => ({ meta: [{ title: "Pooja & Timings — OMG Smart Temple" }] }),
  component: PoojaPage,
});

function PoojaPage() {
  const router = useRouter();
  const search = Route.useSearch();
  const { t } = useTranslation();
  
  // Find initial temple by slug from search params, default to first if invalid
  const initialTemple = temples.find(t => t.slug === search.temple) || temples[0];
  const [sel, setSel] = useState(initialTemple.id);
  const activeTempleData = temples.find(x => x.id === sel)!;
  const now = new Date().getHours();

  function status(p: string) {
    let [timeStr, ampm] = p.split(" ");
    let h = parseInt(timeStr.split(":")[0]);
    if (ampm === "PM" && h !== 12) h += 12;
    if (ampm === "AM" && h === 12) h = 0;
    
    if (h < now) return "done";
    if (h === now) return "live";
    return "upcoming";
  }

  return (
    <div className="max-w-4xl mx-auto px-4 lg:px-8 pt-6 lg:pt-10 pb-10">
      <button 
        onClick={() => router.history.back()} 
        className="mb-6 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground transition-all hover:-translate-x-1"
      >
        <div className="flex items-center justify-center w-8 h-8 rounded-full border border-border/60 bg-card shadow-sm group-hover:border-saffron/40 group-hover:text-saffron">
          <ArrowLeft className="w-4 h-4" />
        </div>
        {t("Go Back")}
      </button>

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-serif text-3xl lg:text-4xl font-bold tracking-tight">{t("Pooja & Timings")}</h1>
          <p className="text-muted-foreground text-xs font-semibold uppercase tracking-widest mt-2">{t("Daily Divine Schedules")}</p>
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto scrollbar-hide -mx-4 px-4 lg:mx-0 lg:px-0 pb-2">
        {temples.map(temple => (
          <button 
            key={temple.id} 
            onClick={() => setSel(temple.id)} 
            className={`shrink-0 text-[13px] rounded-full px-5 py-2 border font-bold transition-all ${
              sel===temple.id ? "bg-foreground text-background border-foreground shadow-[0_4px_12px_rgba(0,0,0,0.1)]" : "bg-card border-border/60 hover:bg-secondary text-foreground/70 hover:text-foreground"
            }`}
          >
            {t(temple.name).split(" ").slice(0, 2).join(" ")}
          </button>
        ))}
      </div>

      <div className="mt-4 bg-card border border-border/70 rounded-3xl p-5 lg:p-6 shadow-[0_12px_24px_rgba(0,0,0,0.04)] relative overflow-hidden">
        <div className="pointer-events-none absolute top-0 right-0 h-48 w-48 rounded-full bg-saffron/5 blur-3xl" />
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/50 pb-5 relative z-10">
          <div>
            <div className="font-serif text-2xl font-bold">{t(activeTempleData.name)}</div>
            <div className="text-[11px] font-bold uppercase tracking-widest text-saffron mt-1">
              {t(activeTempleData.specialDay)} {t("is the special pooja day")}
            </div>
          </div>
          <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 px-3 py-1.5 rounded-full text-xs font-bold tracking-wider">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]" /> {t("TEMPLE OPEN")}
          </div>
        </div>

        <div className="mt-5 relative border-l-2 border-border ml-2 space-y-4 pb-2">
          {activeTempleData.poojas.map(p => {
            const s = status(p);
            const time = p.split(" ").slice(0,2).join(" ");
            const name = p.split(" ").slice(2).join(" ");
            const isDone = s === "done";
            const isLive = s === "live";

            return (
              <div key={p} className="relative pl-6 group">
                <div 
                  className={`absolute -left-[9px] top-4 w-4 h-4 rounded-full border-[3px] border-card shadow-sm transition-colors ${
                    isDone ? 'bg-emerald-500' : isLive ? 'bg-saffron animate-pulse blur-[1px]' : 'bg-border'
                  }`} 
                />
                
                <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-4 py-3 rounded-2xl border transition-all ${
                  isLive ? 'bg-saffron/10 border-saffron/30 shadow-md transform scale-[1.01]' : 'bg-card border-border/40 group-hover:border-border/80 group-hover:bg-secondary/30'
                }`}>
                  <div className="flex items-center gap-4">
                    <div className={`w-16 text-right text-sm font-bold ${isLive ? 'text-saffron' : isDone ? 'text-muted-foreground' : 'text-foreground/80'}`}>
                      {time}
                    </div>
                    <div className="w-px h-6 bg-border/50 hidden sm:block"></div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className={`text-[15px] font-bold ${isLive ? 'text-foreground' : isDone ? 'text-foreground/70' : 'text-foreground/90'}`}>
                          {t(name)}
                        </span>
                        {isLive && (
                          <span className="text-[9px] uppercase font-black tracking-widest bg-saffron text-white px-2 py-0.5 rounded-md shadow-sm">
                            {t("Live")}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className={`text-[10px] font-bold uppercase tracking-widest ${isLive ? 'text-saffron' : isDone ? 'text-emerald-600/70' : 'text-muted-foreground/50'}`}>
                    {isDone ? t("Completed") : isLive ? t("In Progress") : t("Upcoming")}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-4 bg-secondary/40 border border-border/60 rounded-2xl px-4 py-3 text-xs font-medium text-foreground/80 flex items-center gap-3">
          <div className="bg-white rounded-full p-1.5 shadow-sm border border-border/50 text-base leading-none">⭐</div>
          <div className="flex-1">
            <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{t("Today's Special")}</div>
            <div className="text-foreground mt-0.5">{activeTempleData.slug === "tiruvannamalai"
              ? t("Karthigai Deepam Brahmotsavam begins Nov 15 · Maha Deepam on Nov 24 at 6:00 PM")
              : t("Special abhishekam for registered devotees in the morning · Check the temple notice board for today's sevas")}</div>
          </div>
        </div>
      </div>

      <div className="mt-8 mb-4">
        <h2 className="font-serif text-xl font-bold tracking-tight mb-4 flex items-center gap-2">
          {t("Famous Temple Festivals")}
        </h2>
        <div className="grid sm:grid-cols-3 gap-4">
          {[
            { n: "Karthigai Deepam", t: "Tiruvannamalai", d: "Nov 24", c: "20 lakh+" },
            { n: "Chitra Pournami Girivalam", t: "Tiruvannamalai", d: "Apr–May", c: "20 lakh+" },
            { n: "Chithirai Festival", t: "Meenakshi", d: "Apr 20", c: "15 lakh" },
          ].map((f) => (
            <div key={f.n} className="border border-border/70 rounded-3xl p-5 bg-card hover:border-saffron/40 hover:shadow-[0_12px_28px_rgba(0,0,0,0.06)] transition-all group flex flex-col h-full cursor-pointer relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-saffron/10 opacity-0 group-hover:opacity-10 transition-opacity" />
              <div className="flex items-start gap-4 mb-4 relative z-10">
                <div className="bg-saffron/10 text-saffron border border-saffron/20 rounded-2xl w-12 h-12 flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-transform shadow-sm">
                  <Flame className="w-5 h-5" />
                </div>
                <div className="flex-1 mt-0.5">
                  <div className="font-bold text-sm text-foreground leading-tight group-hover:text-saffron transition-colors">{t(f.n)}</div>
                  <div className="text-[10px] text-muted-foreground font-bold uppercase tracking-normal mt-1 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-saffron/70" /> {t(f.t)}
                  </div>
                </div>
              </div>
              
              <div className="mt-auto flex items-center justify-between pt-3 border-t border-border/50 relative z-10 gap-2">
                <div className="font-bold text-foreground bg-secondary/80 px-2 py-1 rounded border border-border/50 shadow-sm whitespace-nowrap text-[10px]">{t(f.d)}</div>
                <div className="text-saffron font-bold text-[9px] tracking-normal uppercase text-right leading-tight">{t(f.c)}<br className="sm:hidden" /> {t("Expected")}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
