import { useTranslation } from "react-i18next";
import { Route as RouteIcon, Clock, Flower2, Armchair, Sparkles } from "lucide-react";

export interface PlannerFeature {
  icon: typeof RouteIcon;
  title: string;
  desc: string;
}

export const PLANNER_FEATURES: PlannerFeature[] = [
  {
    icon: RouteIcon,
    title: "Optimized Route",
    desc: "Best travel and temple route tips",
  },
  {
    icon: Clock,
    title: "Ideal Timing",
    desc: "Minimize wait time, avoid peak crowds",
  },
  {
    icon: Flower2,
    title: "Pooja Recommendations",
    desc: "Suggested services based on your purpose",
  },
  {
    icon: Armchair,
    title: "Comfort Focus",
    desc: "Options for less crowd and differently-abled",
  },
];

export function PlannerFeatureCards() {
  const { t } = useTranslation();

  return (
    <section className="bg-white border border-[#E8E2D5] rounded-3xl p-5 sm:p-6 shadow-xs">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="w-4 h-4 text-[#C48437]" />
        <h2 className="font-serif text-lg font-bold text-[#0B2F25]">
          {t("AI Trip Planner")}
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
        {PLANNER_FEATURES.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.title}
              className="group flex items-start gap-3.5 rounded-2xl border border-[#FAF6F0] bg-[#FAF6F0]/60 p-4 transition-all hover:border-[#C48437]/30 hover:bg-[#FAF6F0] hover:shadow-xs"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white border border-[#E8E2D5] text-[#C48437] shadow-xs group-hover:scale-105 transition-transform">
                <Icon className="w-5 h-5 text-[#C48437]" />
              </div>
              <div className="min-w-0">
                <h3 className="text-sm font-bold text-slate-900 leading-snug">
                  {t(item.title)}
                </h3>
                <p className="mt-1 text-xs text-slate-500 leading-relaxed">
                  {t(item.desc)}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

