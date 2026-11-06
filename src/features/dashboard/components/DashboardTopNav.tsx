import { MapPin, ChevronDown } from "lucide-react";
import { useTranslation } from "react-i18next";
import { districts as allDistricts, temples, statesAndDistricts } from "@/data/temples";
import { TopBarPortal } from "@/components/layout/topbar-slot";

/**
 * The dashboard's State / District / Temple pickers.
 *
 * These render inside the shared top bar rather than in a second header of
 * their own — the notification bell, language switcher and profile live there
 * too, so there is exactly one row of controls on every page.
 */
export function DashboardTopNav({
  state, setState, stateOpen, setStateOpen,
  district, setDistrict, districtOpen, setDistrictOpen,
  activeTempleId, setActiveTempleId, templeOpen, setTempleOpen,
  activeTemple
}: any) {
  const { t } = useTranslation();

  return (
    <TopBarPortal>
      <div className="flex min-w-0 items-center gap-2 lg:gap-3">
        {/* State Selector */}
        <div className="relative hidden sm:block group">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-saffron/20 to-rose-500/20 rounded-full blur opacity-0 group-hover:opacity-100 transition duration-500"></div>
          <button
            onClick={() => { setStateOpen((o: boolean) => !o); setDistrictOpen(false); setTempleOpen(false); }}
            className="relative flex items-center gap-1.5 lg:gap-2.5 rounded-full border border-border bg-white px-3 lg:px-4 py-2 md:py-2.5 text-xs md:text-sm font-semibold shadow-sm transition-all hover:border-saffron/30 min-w-0 shrink"
          >
            <MapPin size={15} className="text-saffron transition-transform group-hover:scale-110 shrink-0 hidden md:block" />
            <span className="text-foreground tracking-wide truncate max-w-[80px] md:max-w-[120px] lg:max-w-none">{state ? t(state) : t("All States")}</span>
            <ChevronDown size={14} className="text-muted-foreground transition-transform group-hover:translate-y-0.5 ml-1 shrink-0" />
          </button>
          {stateOpen && (
            <div className="absolute left-0 top-full z-50 mt-2 w-56 overflow-hidden rounded-xl border border-border bg-white/95 backdrop-blur-lg shadow-xl ring-1 ring-black/5 animate-in fade-in slide-in-from-top-2">
              <div className="max-h-80 overflow-y-auto py-1">
                <button
                  onClick={() => { setState(""); setDistrict(""); setStateOpen(false); }}
                  className={`flex w-full items-center justify-between px-4 py-2.5 text-left text-sm transition-colors ${!state
                    ? "bg-saffron/10 font-bold text-saffron"
                    : "font-medium text-foreground/80 hover:bg-saffron hover:text-white"
                    }`}
                >
                  <span className="truncate">{t("All States")}</span>
                  {!state && <span className="w-1.5 h-1.5 rounded-full bg-saffron" />}
                </button>
                {statesAndDistricts.map((s) => (
                  <button
                    key={s.state}
                    onClick={() => { setState(s.state); setDistrict(""); setStateOpen(false); }}
                    className={`flex w-full items-center justify-between px-4 py-2.5 text-left text-sm transition-colors ${s.state === state
                      ? "bg-saffron/10 font-bold text-saffron"
                      : "font-medium text-foreground/80 hover:bg-saffron hover:text-white"
                      }`}
                  >
                    <span className="truncate">{t(s.state)}</span>
                    {s.state === state && <span className="w-1.5 h-1.5 rounded-full bg-saffron" />}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* District Selector */}
        <div className="relative hidden sm:block group">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-saffron/20 to-rose-500/20 rounded-full blur opacity-0 group-hover:opacity-100 transition duration-500"></div>
          <button
            onClick={() => { setDistrictOpen((o: boolean) => !o); setStateOpen(false); setTempleOpen(false); }}
            className="relative flex items-center gap-1.5 lg:gap-2.5 rounded-full border border-border bg-white px-3 lg:px-4 py-2 md:py-2.5 text-xs md:text-sm font-semibold shadow-sm transition-all hover:border-saffron/30 min-w-0 shrink"
          >
            <MapPin size={15} className="text-saffron transition-transform group-hover:scale-110 shrink-0 hidden md:block" />
            <span className="text-foreground tracking-wide truncate max-w-[80px] md:max-w-[120px] lg:max-w-none">{district ? t(district) : t("All Districts")}</span>
            <ChevronDown size={14} className="text-muted-foreground transition-transform group-hover:translate-y-0.5 ml-1 shrink-0" />
          </button>
          {districtOpen && (
            <div className="absolute left-0 top-full z-50 mt-2 w-56 overflow-hidden rounded-xl border border-border bg-white/95 backdrop-blur-lg shadow-xl ring-1 ring-black/5 animate-in fade-in slide-in-from-top-2">
              <div className="max-h-80 overflow-y-auto py-1">
                <button
                  onClick={() => { setDistrict(""); setDistrictOpen(false); }}
                  className={`flex w-full items-center justify-between px-4 py-2.5 text-left text-sm transition-colors ${!district
                    ? "bg-saffron/10 font-bold text-saffron"
                    : "font-medium text-foreground/80 hover:bg-saffron hover:text-white"
                    }`}
                >
                  <span className="truncate">{t("All Districts")}</span>
                  {!district && <span className="w-1.5 h-1.5 rounded-full bg-saffron" />}
                </button>
                {(state ? statesAndDistricts.find(s => s.state === state)?.districts || [] : allDistricts).map((d) => (
                  <button
                    key={d}
                    onClick={() => { setDistrict(d); setDistrictOpen(false); }}
                    className={`flex w-full items-center justify-between px-4 py-2.5 text-left text-sm transition-colors ${d === district
                      ? "bg-saffron/10 font-bold text-saffron"
                      : "font-medium text-foreground/80 hover:bg-saffron hover:text-white"
                      }`}
                  >
                    <span className="truncate">{t(d)}</span>
                    {d === district && <span className="w-1.5 h-1.5 rounded-full bg-saffron" />}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Temple Dropdown (Second) */}
        <div className="relative group">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-saffron/20 to-amber-500/20 rounded-full blur opacity-0 group-hover:opacity-100 transition duration-500"></div>
          <button
            onClick={() => { setTempleOpen((o: boolean) => !o); setStateOpen(false); setDistrictOpen(false); }}
            className="relative flex items-center gap-1.5 lg:gap-2.5 rounded-full border border-border bg-white px-3 lg:px-4 py-2 text-xs md:text-sm font-semibold shadow-sm transition-all hover:border-saffron/30 min-w-0 shrink"
          >
            <span className="shrink-0 hidden md:block"><LandmarkIcon /></span>
            <span className="text-foreground tracking-wide truncate max-w-[100px] md:max-w-[140px] lg:max-w-[200px] xl:max-w-none">
              {activeTempleId === 0 ? t("Select Temple") : t(activeTemple.name)}
            </span>
            <ChevronDown size={14} className="text-muted-foreground transition-transform group-hover:translate-y-0.5 ml-1 shrink-0" />
          </button>
          {templeOpen && (
            <div className="absolute left-0 top-full z-50 mt-2 w-72 overflow-hidden rounded-xl border border-border bg-white/95 backdrop-blur-lg shadow-xl ring-1 ring-black/5 animate-in fade-in slide-in-from-top-2">
              <div className="max-h-80 overflow-y-auto py-1">
                <button
                  onClick={() => { setActiveTempleId(0); setTempleOpen(false); }}
                  className={`flex w-full items-center justify-between px-4 py-2.5 text-left text-sm transition-colors ${activeTempleId === 0
                    ? "bg-saffron/10 font-bold text-saffron"
                    : "font-medium text-foreground/80 hover:bg-saffron hover:text-white"
                    }`}
                >
                  <span className="truncate">{t("Select Temple")}</span>
                  {activeTempleId === 0 && <span className="w-1.5 h-1.5 rounded-full bg-saffron" />}
                </button>
                {temples.filter(t => {
                  if (state && t.state !== state) return false;
                  if (district && t.district !== district) return false;
                  return true;
                }).map((templeItem) => (
                  <button
                    key={templeItem.id}
                    onClick={() => { setActiveTempleId(templeItem.id); setTempleOpen(false); }}
                    className={`flex w-full items-center justify-between px-4 py-2.5 text-left text-sm transition-colors ${templeItem.id === activeTempleId
                      ? "bg-saffron/10 font-bold text-saffron"
                      : "font-medium text-foreground/80 hover:bg-saffron hover:text-white"
                      }`}
                  >
                    <span className="truncate">{t(templeItem.name)}</span>
                    {templeItem.id === activeTempleId && <span className="w-1.5 h-1.5 rounded-full bg-saffron" />}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </TopBarPortal>
  );
}

function LandmarkIcon() {
  return <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-saffron transition-transform group-hover:scale-110"><line x1="3" x2="21" y1="22" y2="22" /><line x1="6" x2="6" y1="18" y2="11" /><line x1="10" x2="10" y1="18" y2="11" /><line x1="14" x2="14" y1="18" y2="11" /><line x1="18" x2="18" y1="18" y2="11" /><polygon points="12 2 20 7 4 7" /></svg>;
}
