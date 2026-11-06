import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { MapContainer, TileLayer, Polyline, Marker, useMap, CircleMarker } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Maximize2, Minimize2, Plus, Minus, LocateFixed, Navigation } from "lucide-react";

import {
  ARUNACHALA_CENTER,
  ARUNACHALA_HEIGHT_FT,
  TEMPLE_LOCATION,
  GIRIVALAM_DISTANCE_KM,
  ashtaLingamStatus,
  routeSegments,
  segmentSeverity,
  lingamSeverity,
  pointAtBearing,
  type LatLng,
  type Lingam,
} from "@/data/girivalam";
import { SEVERITY_BANDS } from "@/data/operations";

/**
 * The live Girivalam route on a real map.
 *
 * Satellite imagery comes from Esri World Imagery and the street view from
 * OpenStreetMap — both free raster tile services, so no API key is needed. The
 * route ring, the eight Ashta Lingam markers, the temple and the walker's live
 * position are drawn over the tiles as Leaflet layers.
 */

const TILES = {
  satellite: {
    // Esri addresses tiles as {z}/{y}/{x}, not the usual {z}/{x}/{y}.
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    attribution: "Imagery © Esri, Maxar, Earthstar Geographics",
  },
  map: {
    url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    attribution: "© OpenStreetMap contributors",
  },
} as const;

const colorOf = (key: string) => SEVERITY_BANDS.find((b) => b.key === key)!.hex;

/** Corners of the route ring, used to frame the map. */
const routeBounds: [LatLng, LatLng] = [
  [pointAtBearing(180)[0], pointAtBearing(270)[1]],
  [pointAtBearing(0)[0], pointAtBearing(90)[1]],
];

/**
 * The temple sits inside the ring on the east side, close to the hill's centre
 * point, so the "Arunachala" caption is nudged south-west to keep the two
 * labels from overlapping at the default zoom.
 */
const HILL_LABEL_POS: LatLng = [ARUNACHALA_CENTER[0] - 0.002, ARUNACHALA_CENTER[1] - 0.008];

/** Smooth arc of points between two bearings, going clockwise. */
function arcPoints(from: number, to: number, steps = 18): LatLng[] {
  let sweep = (to - from + 360) % 360;
  if (sweep === 0) sweep = 360;
  const pts: LatLng[] = [];
  for (let i = 0; i <= steps; i++) pts.push(pointAtBearing(from + (sweep * i) / steps));
  return pts;
}

/**
 * Place a label fully outside the ring.
 *
 * Centring every pill on its node made the east and west labels straddle the
 * route and the north/south ones run off the frame. Instead the pill is
 * anchored by whichever edge faces the hill, then nudged outward along the
 * radius, so each one sits clear of the line and of its neighbours.
 */
function outwardTransform(bearingDeg: number, gap = 14) {
  const rad = (bearingDeg * Math.PI) / 180;
  const dx = Math.sin(rad);
  const dy = -Math.cos(rad);
  const anchorX = dx > 0.35 ? "0%" : dx < -0.35 ? "-100%" : "-50%";
  const anchorY = dy > 0.35 ? "0%" : dy < -0.35 ? "-100%" : "-50%";
  return `translate(calc(${anchorX} + ${(dx * gap).toFixed(1)}px), calc(${anchorY} + ${(dy * gap).toFixed(1)}px))`;
}

const TEMPLE_SVG = `<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m2 22 2-9h16l2 9"/><path d="M12 2 7 8h10z"/><path d="M9 13V9h6v4"/></svg>`;

/** A white pill label, offset outward from the ring. */
function lingamIcon(label: string, km: number, color: string, active: boolean, bearing: number) {
  return L.divIcon({
    className: "girivalam-pin",
    html: `
      <div class="gv-pin ${active ? "gv-pin-active" : ""}"
           style="transform: ${outwardTransform(bearing)}">
        <span class="gv-pin-body">
          <span class="gv-pin-icon">${TEMPLE_SVG}</span>
          <span class="gv-pin-text">
            <span class="gv-pin-name">${label}</span>
            <span class="gv-pin-km">${km} km</span>
          </span>
        </span>
      </div>
      <span class="gv-pin-node" style="background:${color}"></span>`,
    iconSize: [0, 0],
    iconAnchor: [0, 0],
  });
}

/** The temple sits inside the ring, so its label hangs below the point. */
function templeIcon(label: string, sub: string) {
  return L.divIcon({
    className: "girivalam-pin",
    html: `
      <div class="gv-pin gv-pin-temple" style="transform: translate(-28%, 16px)">
        <span class="gv-pin-body">
          <span class="gv-pin-icon gv-pin-icon-gold">${TEMPLE_SVG}</span>
          <span class="gv-pin-text">
            <span class="gv-pin-name">${label}</span>
            <span class="gv-pin-km">${sub}</span>
          </span>
        </span>
      </div>
      <span class="gv-pin-node" style="background:#b8860b"></span>`,
    iconSize: [0, 0],
    iconAnchor: [0, 0],
  });
}

function hillIcon(name: string, height: string) {
  return L.divIcon({
    className: "girivalam-hill",
    html: `
      <div class="gv-hill">
        <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m8 3 4 8 5-5 5 15H2L8 3z"/></svg>
        <span class="gv-hill-name">${name}</span>
        <span class="gv-hill-sub">${height}</span>
      </div>`,
    iconSize: [0, 0],
    iconAnchor: [0, 0],
  });
}

function walkerIcon() {
  return L.divIcon({
    className: "walker-pin",
    html: `
      <div style="position:relative;display:flex;align-items:center;justify-content:center;width:24px;height:24px;margin:-12px 0 0 -12px;pointer-events:none;">
        <span style="position:absolute;width:26px;height:26px;border-radius:9999px;background:rgba(59,130,246,0.45);box-shadow:0 0 10px rgba(59,130,246,0.6);"></span>
        <span style="position:relative;width:14px;height:14px;border-radius:9999px;background:#2563eb;border:2.5px solid #ffffff;box-shadow:0 2px 6px rgba(0,0,0,0.35);"></span>
      </div>`,
    iconSize: [0, 0],
    iconAnchor: [0, 0],
  });
}

/** White chevron showing the clockwise direction of the walk. */
function arrowIcon(bearing: number) {
  return L.divIcon({
    className: "girivalam-pin",
    html: `
      <span class="gv-arrow" style="transform: translate(-50%, -50%) rotate(${(bearing + 90).toFixed(0)}deg)">
        <svg viewBox="0 0 12 12" width="11" height="11"><path d="M6 1.5 10 10 6 7.6 2 10z" fill="#fff" stroke="rgba(0,0,0,.35)" stroke-width="0.7" stroke-linejoin="round"/></svg>
      </span>`,
    iconSize: [0, 0],
    iconAnchor: [0, 0],
  });
}

/** Imperative handle so the custom controls can drive the map. */
function MapControls({
  onReady,
}: {
  onReady: (api: { zoomIn: () => void; zoomOut: () => void; recentre: () => void; locate: () => void }) => void;
}) {
  const map = useMap();
  useEffect(() => {
    onReady({
      zoomIn: () => map.zoomIn(),
      zoomOut: () => map.zoomOut(),
      recentre: () => map.flyToBounds(routeBounds as L.LatLngBoundsExpression, { paddingTopLeft: [78, 72], paddingBottomRight: [78, 112], duration: 0.6 }),
      locate: () => map.flyTo(ARUNACHALA_CENTER as L.LatLngExpression, 15, { duration: 0.6 }),
    });
  }, [map, onReady]);
  return null;
}

/** Leaflet needs a nudge after its container changes size (fullscreen toggle). */
function ResizeOnChange({ token }: { token: unknown }) {
  const map = useMap();
  useEffect(() => {
    const id = window.setTimeout(() => {
      map.invalidateSize();
      map.fitBounds(routeBounds as L.LatLngBoundsExpression, {
        paddingTopLeft: [78, 72],
        paddingBottomRight: [78, 112],
      });
    }, 220);
    return () => window.clearTimeout(id);
  }, [map, token]);
  return null;
}

export const GirivalamMap = memo(function GirivalamMap({
  walkerPosition,
  selectedId,
  onSelect,
}: {
  walkerPosition: LatLng;
  selectedId: string | null;
  onSelect: (id: string) => void;
}) {
  const { t } = useTranslation();
  const [layer, setLayer] = useState<"satellite" | "map">("satellite");
  const [expanded, setExpanded] = useState(false);
  const apiRef = useRef<{ zoomIn: () => void; zoomOut: () => void; recentre: () => void; locate: () => void } | null>(null);
  const onReady = useCallback((api: typeof apiRef.current) => { apiRef.current = api; }, []);

  const legs = useMemo(
    () =>
      routeSegments.map((s) => {
        const sweep = (s.endBearing - s.startBearing + 360) % 360;
        return {
          id: s.id,
          color: colorOf(segmentSeverity(s)),
          points: arcPoints(s.startBearing, s.endBearing),
          midBearing: (s.startBearing + sweep / 2) % 360,
        };
      }),
    []
  );

  // Esc leaves the expanded view.
  useEffect(() => {
    if (!expanded) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setExpanded(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [expanded]);

  const tile = TILES[layer];

  return (
    <div
      className={
        expanded
          ? "fixed inset-0 z-[1000] bg-black p-3 sm:p-6"
          : "relative overflow-hidden rounded-2xl border border-[#e4ddcc] bg-[#e8e3d6] shadow-sm"
      }
    >
      <div className={expanded ? "relative h-full w-full overflow-hidden rounded-2xl" : "relative"}>
        <MapContainer
          // Fit the whole 14 km ring rather than a fixed zoom, so no part of
          // the route is cropped at any container size.
          bounds={routeBounds as L.LatLngBoundsExpression}
          boundsOptions={{ paddingTopLeft: [78, 72], paddingBottomRight: [78, 112] }}
          minZoom={11}
          maxZoom={18}
          scrollWheelZoom
          zoomControl={false}
          attributionControl
          className={expanded ? "h-full w-full" : "h-[460px] w-full"}
        >
          <TileLayer url={tile.url} attribution={tile.attribution} maxZoom={18} />
          <MapControls onReady={onReady} />
          <ResizeOnChange token={`${expanded}-${layer}`} />

          {/* White casing under the route so it reads over satellite imagery */}
          {legs.map((leg) => (
            <Polyline
              key={`casing-${leg.id}`}
              positions={leg.points as L.LatLngExpression[]}
              pathOptions={{ color: "#ffffff", weight: 13, opacity: 0.95, lineCap: "round" }}
            />
          ))}

          {/* Route, coloured by crowd density */}
          {legs.map((leg) => (
            <Polyline
              key={leg.id}
              positions={leg.points as L.LatLngExpression[]}
              pathOptions={{ color: leg.color, weight: 8, opacity: 1, lineCap: "round" }}
            />
          ))}

          {/* Direction of travel */}
          {legs.map((leg) => (
            <Marker
              key={`arrow-${leg.id}`}
              position={pointAtBearing(leg.midBearing) as L.LatLngExpression}
              icon={arrowIcon(leg.midBearing)}
              interactive={false}
            />
          ))}

          {/* Boundary nodes where one leg meets the next */}
          {ashtaLingamStatus.map((l) => (
            <CircleMarker
              key={`dot-${l.id}`}
              center={l.position as L.LatLngExpression}
              radius={5.5}
              pathOptions={{ color: "#ffffff", weight: 2.5, fillColor: colorOf(lingamSeverity(l)), fillOpacity: 1 }}
            />
          ))}

          {/* Hill label */}
          <Marker
            position={HILL_LABEL_POS as L.LatLngExpression}
            icon={hillIcon(t("Arunachala"), `${ARUNACHALA_HEIGHT_FT.toLocaleString("en-IN")} ft`)}
            interactive={false}
          />

          {/* Temple start / end */}
          <Marker
            position={TEMPLE_LOCATION as L.LatLngExpression}
            icon={templeIcon(t("Arunachaleswarar Temple"), t("Start / End"))}
            eventHandlers={{ click: () => onSelect("temple") }}
          />

          {/* Ashta Lingam pins */}
          {ashtaLingamStatus.map((l: Lingam) => (
            <Marker
              key={l.id}
              position={l.position as L.LatLngExpression}
              icon={lingamIcon(
                t(l.name),
                l.cumulativeKm,
                colorOf(lingamSeverity(l)),
                selectedId === l.id,
                l.bearing
              )}
              eventHandlers={{ click: () => onSelect(l.id) }}
            />
          ))}

          {/* The walker's live position */}
          <Marker
            position={walkerPosition as L.LatLngExpression}
            icon={walkerIcon()}
            interactive={false}
          />
        </MapContainer>

        {/* Map / Satellite toggle */}
        <div className="absolute left-3 top-3 z-[500] flex rounded-lg bg-white/95 p-1 shadow-md ring-1 ring-black/5 backdrop-blur">
          {(["map", "satellite"] as const).map((k) => (
            <button
              key={k}
              type="button"
              onClick={() => setLayer(k)}
              aria-pressed={layer === k}
              className={`rounded-md px-3 py-1.5 text-xs font-bold transition-colors ${
                layer === k ? "bg-[#14532d] text-white shadow-sm" : "text-slate-600 hover:text-[#14532d]"
              }`}
            >
              {k === "map" ? t("Map") : t("Satellite")}
            </button>
          ))}
        </div>

        {/* Zoom / locate controls */}
        <div className="absolute right-3 top-3 z-[500] flex flex-col gap-2">
          <ControlButton label={t("Recentre on the route")} onClick={() => apiRef.current?.recentre()}>
            <Navigation className="h-4 w-4" />
          </ControlButton>
          <ControlButton
            label={expanded ? t("Exit full screen") : t("Full screen")}
            onClick={() => setExpanded((v) => !v)}
          >
            {expanded ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
          </ControlButton>
          <div className="flex flex-col overflow-hidden rounded-lg bg-white/95 shadow-md ring-1 ring-black/5">
            <button
              type="button"
              aria-label={t("Zoom in")}
              onClick={() => apiRef.current?.zoomIn()}
              className="flex h-9 w-9 items-center justify-center text-slate-700 transition-colors hover:bg-[#14532d] hover:text-white"
            >
              <Plus className="h-4 w-4" />
            </button>
            <span className="h-px bg-slate-200" />
            <button
              type="button"
              aria-label={t("Zoom out")}
              onClick={() => apiRef.current?.zoomOut()}
              className="flex h-9 w-9 items-center justify-center text-slate-700 transition-colors hover:bg-[#14532d] hover:text-white"
            >
              <Minus className="h-4 w-4" />
            </button>
          </div>
          <ControlButton label={t("Go to my position")} onClick={() => apiRef.current?.locate()}>
            <LocateFixed className="h-4 w-4" />
          </ControlButton>
        </div>

        {/* Crowd legend */}
        <div className="absolute inset-x-3 bottom-3 z-[500] flex flex-wrap items-center gap-x-4 gap-y-1.5 rounded-xl bg-white/95 px-3.5 py-2 shadow-md ring-1 ring-black/5 backdrop-blur">
          <span className="text-[11px] font-bold text-[#14532d]">{t("Route Crowd Status")}</span>
          {SEVERITY_BANDS.map((b) => (
            <span key={b.key} className="inline-flex items-center gap-1.5 text-[11px] font-medium text-slate-600">
              <span className="h-2.5 w-2.5 rounded-full" style={{ background: b.hex }} />
              {t(LEGEND_LABEL[b.key])} <span className="text-slate-400">{LEGEND_RANGE[b.key]}</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
});

/** The map legend uses the devotee-facing wording from the brief. */
const LEGEND_LABEL: Record<string, string> = {
  safe: "Normal",
  moderate: "High",
  high: "Heavy",
  critical: "Very High",
};
const LEGEND_RANGE: Record<string, string> = {
  safe: "(<60%)",
  moderate: "(60–80%)",
  high: "(80–95%)",
  critical: "(>95%)",
};

function ControlButton({
  label,
  onClick,
  children,
}: {
  label: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/95 text-slate-700 shadow-md ring-1 ring-black/5 transition-colors hover:bg-[#14532d] hover:text-white"
    >
      {children}
    </button>
  );
}
