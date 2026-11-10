import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { format } from "date-fns";
import { useTranslation } from "react-i18next";
import { RefreshCw, Maximize, Minimize, Maximize2, Flame, X, History, MapPin } from "lucide-react";
import { temples } from "@/data/temples";
import { useHeatmapZones } from "@/features/heatmap/hooks/useHeatmapZones";
import { useLiveCrowd } from "@/features/heatmap/hooks/useLiveCrowd";
import { KpiRow, InsightsPanel, TipsPanel, GateTable, CrowdTrendChart } from "@/features/heatmap/components/LivePanels";
import { GateOverlay, SeverityLegend } from "@/features/heatmap/components/GateOverlay";
import { ZoneCapacityPanel } from "@/features/heatmap/components/ZoneCapacityPanel";
import { TIRUVANNAMALAI_SLUG } from "@/data/tiruvannamalai";

export const Route = createFileRoute("/_app/heatmap")({
  head: () => ({ meta: [{ title: "Live Heatmap — OMG Smart Temple" }] }),
  component: HeatmapPage,
});

const shortName = (name: string) => name.replace(/\s+Temple$/i, "");

function HeatmapPage() {
  const { t: tStr } = useTranslation();
  const [sel, setSel] = useState(temples[0].id);
  const [selectedZone, setSelectedZone] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [spinning, setSpinning] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const tableRef = useRef<HTMLDivElement>(null);
  const [fullView, setFullView] = useState(false);
  const [showGates, setShowGates] = useState(true);
  const [showHistorical, setShowHistorical] = useState(false);

  const t = temples.find((x) => x.id === sel)!;
  const { displayZones, mapImage } = useHeatmapZones(t);
  const live = useLiveCrowd(t, displayZones as any);

  useEffect(() => setSelectedZone(null), [sel]);

  useEffect(() => {
    const onChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", onChange);
    return () => document.removeEventListener("fullscreenchange", onChange);
  }, []);

  const toggleFullscreen = () => {
    if (document.fullscreenElement) document.exitFullscreen?.();
    else rootRef.current?.requestFullscreen?.().catch(() => {});
  };

  const handleRefresh = () => {
    live.refresh();
    setSpinning(true);
    setTimeout(() => setSpinning(false), 600);
  };

  // From a tip: highlight that gate's row in the table.
  const focusZone = (id: string) => {
    setSelectedZone(id);
    tableRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  const gates = live.zones.filter((z) => z.kind === "gate");
  const statusNote = live.busyGates.length
    ? `${live.busyGates.slice(0, 2).map((g) => g.name.replace(/\s*\(.*\)$/, "")).join(" & ")} ${tStr("busy")}`
    : tStr("All gates moving well");

  return (
    <div ref={rootRef} className={`bg-[#FAF6F0] ${isFullscreen ? "overflow-y-auto h-screen" : "min-h-screen"}`}>
      <div className="max-w-[1500px] mx-auto px-4 lg:px-8 pt-6 pb-10 space-y-5">
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-white border border-[#E8E2D5] text-[#C48437] flex items-center justify-center shrink-0">
              <Flame className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-serif text-2xl lg:text-3xl font-bold text-slate-900">{tStr("Live Temple Heatmap")}</h1>
              <p className="text-sm text-slate-500">{tStr("Real-time crowd density across")} {tStr(t.name)}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <span className="inline-flex items-center gap-2 text-xs font-bold text-[#006300] bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-full">
              <span className="w-2 h-2 rounded-full bg-[#0ca30c] animate-pulse" /> {tStr("Live now")}
            </span>
            <span className="text-xs text-slate-500" aria-live="polite">{tStr("Last updated:")} {format(live.updatedAt, "MMM d, yyyy, h:mm a")}</span>
            <button type="button" onClick={handleRefresh} aria-label={tStr("Refresh")} className="w-9 h-9 rounded-full bg-white border border-rose-100 flex items-center justify-center text-slate-600 hover:text-saffron hover:border-saffron">
              <RefreshCw className={`w-4 h-4 ${spinning ? "animate-spin" : ""}`} />
            </button>
            <button type="button" onClick={toggleFullscreen} aria-label={isFullscreen ? tStr("Exit full screen") : tStr("Full screen")} className="w-9 h-9 rounded-full bg-white border border-rose-100 flex items-center justify-center text-slate-600 hover:text-saffron hover:border-saffron">
              {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
            </button>
          </div>
        </header>

        {/* Temple tabs */}
        <div role="tablist" aria-label={tStr("Temples")} className="flex gap-2 overflow-x-auto scrollbar-hide -mx-4 px-4 lg:mx-0 lg:px-0 pb-1">
          {temples.map((temple) => (
            <button
              key={temple.id}
              type="button"
              role="tab"
              aria-selected={sel === temple.id}
              onClick={() => setSel(temple.id)}
              className={`shrink-0 text-sm font-semibold rounded-full px-4 py-2 border transition-all ${
                sel === temple.id ? "bg-saffron text-white border-saffron shadow-md shadow-saffron/20" : "bg-white text-slate-600 border-slate-200 hover:border-saffron/50 hover:text-saffron"
              }`}
            >
              {tStr(shortName(temple.name))}
            </button>
          ))}
        </div>

        <KpiRow
          totalToday={live.kpis.totalToday}
          vsTypicalPct={live.kpis.vsTypicalPct}
          weekday={live.kpis.weekday}
          liveCrowd={live.liveCrowd}
          avgWait={live.kpis.avgWait}
          waitDelta={live.kpis.waitDelta}
          overall={live.overall}
          statusNote={statusNote}
          peakWindow={live.kpis.peakWindow}
          peakIsTomorrow={live.kpis.peakIsTomorrow}
          occupancy={live.occupancy}
          openTime={live.openTime}
          isClosed={live.isClosed}
        />

        {/* Two independent columns so neither leaves an empty gap:
            left = map + gate table, right = insights + tips + trend. */}
        <div className="grid xl:grid-cols-[minmax(0,1fr)_360px] gap-5 items-start xl:items-stretch">
          <div className="min-w-0 space-y-5">
            {mapImage ? (
              <div className="space-y-3">
                <div className="relative rounded-3xl overflow-hidden bg-slate-900 shadow-sm">
                  <img
                    src={mapImage}
                    alt={`${t.name} ${tStr("crowd map")}`}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-auto block"
                  />
                  {showGates && (
                    <GateOverlay
                      zones={live.zones}
                      selectedId={selectedZone}
                      onSelect={focusZone}
                      isClosed={live.isClosed}
                    />
                  )}
                  <div className="absolute bottom-2 right-2 flex gap-2">
                    <button
                      type="button"
                      onClick={() => setShowGates((v) => !v)}
                      aria-pressed={showGates}
                      className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 text-xs font-medium backdrop-blur-sm transition-all shadow-lg ${
                        showGates ? "bg-saffron text-white" : "bg-black/70 hover:bg-black text-white"
                      }`}
                    >
                      <MapPin size={14} /> {tStr("Gate markers")}
                    </button>
                    <button
                      type="button"
                      onClick={() => setFullView(true)}
                      className="bg-black/70 hover:bg-black text-white px-3 py-1.5 rounded-lg flex items-center gap-2 text-xs font-medium backdrop-blur-sm transition-all shadow-lg"
                    >
                      <Maximize2 size={14} /> {tStr("Full View")}
                    </button>
                  </div>
                </div>
                <SeverityLegend />
              </div>
            ) : (
              <div className="rounded-3xl bg-white border border-rose-100 p-8 text-center text-sm text-slate-500 aspect-[3/2] flex items-center justify-center">
                {tStr("A live map for this temple is coming soon. Gate-wise figures are shown below.")}
              </div>
            )}
            <div ref={tableRef}>
              <GateTable zones={live.zones} selectedId={selectedZone} onSelect={focusZone} isClosed={live.isClosed} />
            </div>
            <ZoneCapacityPanel
              zones={live.zones}
              templeCapacity={t.capacity}
              liveCrowd={live.liveCrowd}
              useOperationsData={t.slug === TIRUVANNAMALAI_SLUG}
            />
          </div>
          <div className="min-w-0 grid md:grid-cols-2 gap-5 xl:flex xl:flex-col">
            <InsightsPanel
              overall={live.overall}
              hottest={live.hottest}
              busyGates={live.busyGates}
              gates={gates}
              closedNote={live.isClosed ? `${tStr("Darshan is closed now — reopens at")} ${live.openTime}` : undefined}
            />
            <TipsPanel slug={t.slug} bestWindow={live.bestWindow} quietestGate={live.quietestGate} nextEvent={live.nextEvent} onSelectZone={focusZone} />
            <div className="md:col-span-2 xl:flex-1 xl:flex xl:flex-col gap-2">
              <button
                type="button"
                onClick={() => setShowHistorical((v) => !v)}
                aria-pressed={showHistorical}
                className={`self-start inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-bold transition-colors ${
                  showHistorical
                    ? "bg-violet-600 text-white border-violet-600"
                    : "bg-white text-slate-600 border-rose-100 hover:border-violet-400 hover:text-violet-600"
                }`}
              >
                <History className="w-3.5 h-3.5" /> {tStr("Historical overlay")}
              </button>
              <CrowdTrendChart
                trend={live.trend}
                nowH={live.nowH}
                liveCrowd={live.liveCrowd}
                showHistorical={showHistorical}
              />
            </div>
          </div>
        </div>
      </div>

      {fullView && mapImage && (
        <div role="dialog" aria-modal="true" aria-label={`${t.name} ${tStr("crowd map")}`} className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md animate-in fade-in zoom-in duration-200" onClick={() => setFullView(false)}>
          <button type="button" onClick={() => setFullView(false)} aria-label={tStr("Close")} className="absolute top-4 right-4 text-white/70 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors">
            <X size={32} />
          </button>
          <img src={mapImage} alt="" className="max-w-[95vw] max-h-[95vh] object-contain rounded-xl shadow-2xl" onClick={(e) => e.stopPropagation()} />
        </div>
      )}
    </div>
  );
}
