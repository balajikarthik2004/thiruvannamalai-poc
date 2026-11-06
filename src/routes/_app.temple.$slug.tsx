import { createFileRoute, notFound } from "@tanstack/react-router";
import { getTemple } from "@/data/temples";
import { lazy, useEffect, useMemo, useRef, useState } from "react";
import { LazyPanel } from "@/components/shared/LazyPanel";

import { TempleHero } from "@/features/temple-details/components/TempleHero";
import { CrowdDashboard } from "@/features/temple-details/components/CrowdDashboard";
import { AIInsights } from "@/features/temple-details/components/AIInsights";
const CrowdPredictionChart = lazy(() =>
  import("@/features/temple-details/components/CrowdPredictionChart").then((m) => ({
    default: m.CrowdPredictionChart,
  }))
);
import { ScanEntryCard } from "@/features/temple-details/components/ScanEntryCard";
import { predictionFor, insightsFor } from "@/features/temple-details/utils/prediction";
import { TempleTimings } from "@/features/temple-details/components/TempleTimings";
import { ParkingStatus } from "@/features/temple-details/components/ParkingStatus";
import { AnnadhanamDetails } from "@/features/temple-details/components/AnnadhanamDetails";
import { SmartAlerts } from "@/features/temple-details/components/SmartAlerts";
import { TempleTabs } from "@/features/temple-details/components/TempleTabs";
import { MobileActionBar, OtherTemples, BookingWidget } from "@/features/temple-details/components/SidebarWidgets";

export const Route = createFileRoute("/_app/temple/$slug")({
  loader: ({ params }) => {
    const t = getTemple(params.slug);
    if (!t) throw notFound();
    return { temple: t };
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: `${loaderData?.temple.name} — Live crowd, AI best time | OMG Smart Temple` },
      { name: "description", content: `Live crowd, parking and AI-recommended visit times for ${loaderData?.temple.name}.` },
    ],
  }),
  notFoundComponent: () => <div className="p-12 text-center text-muted-foreground">Temple not found, devotee 🙏</div>,
  component: TempleDetail,
});

function TempleDetail() {
  const { temple: t } = Route.useLoaderData();
  const [pct, setPct] = useState(t.crowdPct);
  const [wait, setWait] = useState(t.waitMin);
  const [alertOn, setAlertOn] = useState(false);

  // Rebuilt only when the temple changes — these loops used to run on every
  // render of a page that re-rendered once a second.
  const prediction = useMemo(() => predictionFor(t), [t]);
  const insights = useMemo(
    () => insightsFor(t, prediction.data, prediction.capacity),
    [t, prediction]
  );

  // Sidebar sticks by its top when it fits the screen; when it is taller, it scrolls
  // with the page until its last card is visible and then stays pinned by its bottom.
  const sideRef = useRef<HTMLDivElement>(null);
  const [sideTop, setSideTop] = useState(24);
  useEffect(() => {
    const el = sideRef.current;
    if (!el) return;
    const update = () => setSideTop(Math.min(24, window.innerHeight - el.offsetHeight - 24));
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    window.addEventListener("resize", update);
    return () => { ro.disconnect(); window.removeEventListener("resize", update); };
  }, []);

  // Simulated live drift. 8s is slow enough that the page stays responsive.
  useEffect(() => {
    const i = setInterval(() => {
      setPct(p => Math.max(5, Math.min(98, p + (Math.random() * 6 - 3))));
      setWait(w => Math.max(2, Math.round(w + (Math.random() * 4 - 2))));
    }, 8000);
    return () => clearInterval(i);
  }, []);

  return (
    <div className="pb-32 lg:pb-10">
      <TempleHero t={t} />

      <div className="max-w-7xl mx-auto px-4 lg:px-8 pt-4 relative z-20">
        <CrowdDashboard t={t} wait={wait} />

        <div className="mt-8 grid lg:grid-cols-3 gap-8 items-start">
          <div className="lg:col-span-2 space-y-6 min-w-0">
            <AIInsights t={t} />
            {/* About / facts / Girivalam / gallery need the wide column */}
            <TempleTabs t={t} />
            <TempleTimings t={t} />
            <LazyPanel height="h-[34rem]" label="Loading crowd prediction">
              <CrowdPredictionChart
                temple={t}
                data={prediction.data}
                capacity={prediction.capacity}
                recommended={prediction.recommended}
                insights={insights}
              />
            </LazyPanel>
            <ScanEntryCard />
            <SmartAlerts t={t} pct={pct} alertOn={alertOn} setAlertOn={setAlertOn} />
            <AnnadhanamDetails t={t} />
          </div>

          <div ref={sideRef} className="space-y-6 min-w-0 lg:sticky" style={{ top: sideTop }}>
            <BookingWidget t={t} />
            <ParkingStatus t={t} />
            <OtherTemples t={t} />
          </div>
        </div>
      </div>

      <MobileActionBar t={t} />
    </div>
  );
}
