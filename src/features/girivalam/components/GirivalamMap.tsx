import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { MapContainer, TileLayer, Polyline, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import {
  Maximize2,
  Minimize2,
  Plus,
  Minus,
  LocateFixed,
  Navigation,
  Info,
  X,
  ExternalLink,
  TriangleAlert,
  BadgeCheck,
  Loader2,
} from "lucide-react";

import {
  ARUNACHALA_CENTER,
  ARUNACHALA_HEIGHT_FT,
  GIRIVALAM_DISTANCE_KM,
  TEMPLE_LOCATION,
  ashtaLingamStatus,
  lingamSeverity,
  segmentSeverityById,
  type Lingam,
} from "@/data/girivalam";
import {
  ROUTE_BOUNDS,
  ROUTE_CAVEATS,
  ROUTE_HAS_ESTIMATED_POINTS,
  ROUTE_ROADS,
  ROUTE_SOURCES,
  ROUTE_TOTAL_KM,
  UNVERIFIED_STOP_IDS,
  arrowsAlong,
  bearingBetween,
  routeGeometry,
  stopById,
  type LatLng,
} from "@/data/girivalam-route";
import { SEVERITY_BANDS } from "@/data/operations";

/**
 * The Girivalam walk on a real map.
 *
 * Geometry comes from `girivalam-route.json` — shrine coordinates surveyed in
 * OpenStreetMap and a walking line routed over the OSM road network — so the
 * ribbon follows Chengam Main Road, Hill Round Road, the Kanji Road and the
 * Cuddalore–Chittoor Road rather than a drawn circle. Nothing here is a
 * hand-placed coordinate.
 *
 * Three shrines (Agni, Vayu, Esanya) have no surveyed coordinate anywhere in
 * OSM. Their markers are drawn with a hollow, dashed node and an "approx."
 * badge, and the data-source panel says so. The map does not claim they are
 * surveyed positions.
 *
 * Crowd colours come from the SIMULATED figures in `girivalam.ts`. The legend
 * labels them as demo data — they are not live counts.
 */

const TILES = {
  map: {
    url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    maxZoom: 19,
  },
  satellite: {
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    attribution: "Imagery &copy; Esri, Maxar, Earthstar Geographics",
    maxZoom: 18,
  },
} as const;

type LayerKey = keyof typeof TILES;

/**
 * Room left around the route when the map is framed: enough for the layer
 * toggle and the estimated-positions chip at the top, and the legend at the
 * bottom. A phone's map is less than half the height of a desktop one, so it
 * gets tighter padding — otherwise the walk is squeezed into the top third
 * with empty ground below it.
 */
function fitOptions(compact: boolean): L.FitBoundsOptions {
  return compact
    ? { paddingTopLeft: [18, 46], paddingBottomRight: [18, 58] }
    : { paddingTopLeft: [54, 58], paddingBottomRight: [54, 96] };
}

/**
 * Representative imagery. The repository holds no photograph of any individual
 * shrine, so popups show a general Arunachala/Girivalam image and say so —
 * a generic picture is never captioned as a photo of that lingam.
 */
const STOP_IMAGE: Record<string, string> = {
  temple: "/temples/tiruvannamalai/rajagopuram.jpg",
  indra: "/temples/tiruvannamalai/gopuram-sky.jpg",
  agni: "/temples/tiruvannamalai/girivalam.jpg",
  yama: "/temples/tiruvannamalai/temple-hill.jpg",
  niruthi: "/temples/tiruvannamalai/arunachala-hill.jpg",
  varuna: "/temples/tiruvannamalai/panorama.jpg",
  vayu: "/temples/tiruvannamalai/gopurams-from-hill.jpg",
  kubera: "/temples/tiruvannamalai/night.jpg",
  esanya: "/temples/tiruvannamalai/tower.jpg",
};
const FALLBACK_IMAGE = "/temples/tiruvannamalai/girivalam.jpg";

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

/* ------------------------------------------------------------------- icons */

/**
 * Which way the label hangs off its node: always outward from the hill, worked
 * out from the marker's real bearing, so labels never sit on top of the route.
 */
const OUTWARD_TRANSFORM = [
  "translate(-50%, calc(-100% - 15px))", // N
  "translate(13px, calc(-100% - 3px))", // NE
  "translate(16px, -50%)", // E
  "translate(13px, 5px)", // SE
  "translate(-50%, 15px)", // S
  "translate(calc(-100% - 13px), 5px)", // SW
  "translate(calc(-100% - 16px), -50%)", // W
  "translate(calc(-100% - 13px), calc(-100% - 3px))", // NW
];

/**
 * A pill's measured footprint on screen, at full size and in the compact style
 * phones get. Widths run from about 117 px ("Indra Lingam") to 185 px
 * ("Arunachaleswarar Temple"); the larger figure is used so the widest label
 * still gets its room.
 */
const LABEL_SIZE = {
  full: { w: 170, h: 38 },
  compact: { w: 124, h: 32 },
};

/**
 * Centre of a label box relative to its node, one entry per slot, derived from
 * the CSS transforms in OUTWARD_TRANSFORM above. The two must stay in step: if
 * a transform changes, change its offset here too, or labels will be tested for
 * collisions in one place and drawn in another.
 */
function slotOffset(slot: number, w: number, h: number): [number, number] {
  return [
    [0, -15 - h / 2], // N
    [13 + w / 2, -3 - h / 2], // NE
    [16 + w / 2, 0], // E
    [13 + w / 2, 5 + h / 2], // SE
    [0, 15 + h / 2], // S
    [-13 - w / 2, 5 + h / 2], // SW
    [-16 - w / 2, 0], // W
    [-13 - w / 2, -3 - h / 2], // NW
  ][slot] as [number, number];
}

export interface LabelPlacement {
  transform: string;
  /** False when the pin is drawn as a bare node, because a label would collide. */
  showLabel: boolean;
}

/**
 * Decides, for the current view, where each label hangs and whether it is shown
 * at all.
 *
 * Real coordinates bunch up in a way an evenly spaced ring never did: the
 * temple and Indra Lingam are about 450 m apart, which is roughly 20 screen
 * pixels at the zoom that frames the whole walk — far closer than two pills
 * over 150 px wide can sit. So this works in projected pixels, not metres.
 *
 * A label is only ever drawn in its outward slot or one step to either side,
 * and only where it neither covers a label already placed nor runs off the
 * edge of the map. Anything else is drawn as a bare node: still clickable,
 * still carrying its name as a tooltip. That is deliberately strict — swinging
 * a pill round to the inside to make it fit puts it over the route and away
 * from its own node, which reads worse than a clean dot. Zoom in, or open the
 * pin, and the label comes back.
 *
 * Stops are laid out in walking order, so the temple and the earliest lingams
 * win ties and the result is stable between renders.
 */
function placeLabels(
  stops: { id: string; position: LatLng }[],
  project: (p: LatLng) => { x: number; y: number },
  /** Visible map rectangle in the same projected pixels as `project`. */
  viewport: { minX: number; minY: number; maxX: number; maxY: number },
  selectedId: string | null,
  compact: boolean,
): Record<string, LabelPlacement> {
  /** Keep pills this far clear of the map edge. */
  const EDGE = 6;
  const { w, h } = compact ? LABEL_SIZE.compact : LABEL_SIZE.full;

  const placed: { x: number; y: number }[] = [];
  const out: Record<string, LabelPlacement> = {};

  const collides = (box: { x: number; y: number }) =>
    placed.some((o) => Math.abs(box.x - o.x) < w && Math.abs(box.y - o.y) < h);

  const offMap = (box: { x: number; y: number }) =>
    box.x - w / 2 < viewport.minX + EDGE ||
    box.x + w / 2 > viewport.maxX - EDGE ||
    box.y - h / 2 < viewport.minY + EDGE ||
    box.y + h / 2 > viewport.maxY - EDGE;

  const boxFor = (node: { x: number; y: number }, slot: number) => {
    const [dx, dy] = slotOffset(slot, w, h);
    return { x: node.x + dx, y: node.y + dy };
  };

  for (const stop of stops) {
    const node = project(stop.position);
    const preferred = Math.round(bearingBetween(ARUNACHALA_CENTER, stop.position) / 45) % 8;

    let chosen = -1;
    for (const step of [0, 1, -1]) {
      const slot = (preferred + step + 8) % 8;
      const box = boxFor(node, slot);
      if (!collides(box) && !offMap(box)) {
        chosen = slot;
        break;
      }
    }

    // A selected pin always shows its label, even where that means overlapping.
    if (chosen === -1 && stop.id === selectedId) chosen = preferred;

    if (chosen !== -1) placed.push(boxFor(node, chosen));
    out[stop.id] = {
      transform: OUTWARD_TRANSFORM[chosen === -1 ? preferred : chosen],
      showLabel: chosen !== -1,
    };
  }
  return out;
}

const escapeHtml = (s: string) =>
  s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]!);

/**
 * The temple's gopuram, drawn inline.
 *
 * `/pin_icon_temple.png` cannot be used for this: that file is a 34×40 crop of
 * a screenshot and shows fragments of the words "…nachala Tem (Start /" rather
 * than a temple, so at pin size it renders as unreadable specks of text. Inline
 * SVG also stays crisp on high-density screens, where the 32 px lingam bitmap
 * is already soft.
 */
const GOPURAM_SVG = `
  <svg viewBox="0 0 24 28" width="22" height="26" class="gv-pin-icon-svg" aria-hidden="true">
    <rect x="0.5" y="1" width="23" height="26" rx="6" fill="#fdf6e6" stroke="#e8dcc0" stroke-width="1"/>
    <g fill="#b8860b">
      <path d="M12 3.4 10.9 6h2.2z"/>
      <path d="M8.8 8.4 12 5.6l3.2 2.8v0.7H8.8z"/>
      <path d="M7.7 11.4 8.8 9.3h6.4l1.1 2.1z"/>
      <path d="M6.5 14.8 7.7 12.4h8.6l1.2 2.4z"/>
      <path d="M5.2 18.6 6.5 15.8h11l1.3 2.8z"/>
      <path d="M4.8 25.4v-5.9h14.4v5.9z"/>
    </g>
    <path d="M10.4 25.4v-3.3a1.6 1.6 0 0 1 3.2 0v3.3z" fill="#fdf6e6"/>
  </svg>`;

/** A white pill label plus the coloured node that sits exactly on the route. */
function stopIcon(opts: {
  id: string;
  label: string;
  sub: string;
  color: string;
  active: boolean;
  verified: boolean;
  temple: boolean;
  /** Which of the eight label slots this pin hangs in. */
  transform: string;
  /** False where there is no room for the pill, leaving a clickable node. */
  showLabel: boolean;
  compact: boolean;
}) {
  const { label, sub, color, active, verified, temple, transform, showLabel, compact } = opts;
  const glyph = temple
    ? GOPURAM_SVG
    : `<img src="/pin_icon_lingam.png" alt="" class="gv-pin-icon-img" width="22" height="23" loading="lazy" />`;
  const pill = showLabel
    ? `
      <div class="gv-pin ${active ? "gv-pin-active" : ""} ${compact ? "gv-pin-compact" : ""}" style="transform:${transform}">
        <span class="gv-pin-body">
          ${glyph}
          <span class="gv-pin-text">
            <span class="gv-pin-name">${escapeHtml(label)}</span>
            <span class="gv-pin-km">${escapeHtml(sub)}</span>
          </span>
          ${verified ? "" : `<span class="gv-pin-approx" title="Position estimated">~</span>`}
        </span>
      </div>`
    : "";
  return L.divIcon({
    className: "girivalam-pin",
    html: `${pill}
      <span class="gv-pin-node ${verified ? "" : "gv-pin-node-approx"} ${
        showLabel ? "" : "gv-pin-node-bare"
      } ${active ? "gv-pin-node-active" : ""}" title="${escapeHtml(label)}" style="${
        verified ? `background:${color}` : `border-color:${color};color:${color}`
      }"></span>`,
    iconSize: [0, 0],
    iconAnchor: [0, 0],
  });
}

/** Mountain label parked over the summit. */
function hillIcon(name: string, height: string) {
  return L.divIcon({
    className: "girivalam-hill",
    html: `
      <div style="display:flex;flex-direction:column;align-items:center;pointer-events:none;transform:translate(-50%,-50%);">
        <svg viewBox="0 0 36 24" width="34" height="22" fill="none" stroke="#ffffff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" style="filter:drop-shadow(0 2px 4px rgba(0,0,0,0.85));">
          <path d="M4 21L15 4l8 12 5-7 6 12H4z" />
          <path d="M11 10.5l4 3.5 4-3.5" />
        </svg>
        <span style="font-size:13.5px;font-weight:700;color:#ffffff;letter-spacing:0.02em;text-shadow:0 2px 6px rgba(0,0,0,0.9);margin-top:2px;line-height:1.2;">${escapeHtml(name)}</span>
        <span style="font-size:11px;font-weight:500;color:rgba(255,255,255,0.92);text-shadow:0 1px 4px rgba(0,0,0,0.9);">${escapeHtml(height)}</span>
      </div>`,
    iconSize: [0, 0],
    iconAnchor: [0, 0],
  });
}

/** Blue dot with a pulsing ring — the devotee's own position. */
function walkerIcon(live: boolean) {
  const fill = live ? "#2563eb" : "#0284c7";
  return L.divIcon({
    className: "walker-pin",
    html: `
      <div style="position:relative;display:flex;align-items:center;justify-content:center;width:32px;height:32px;margin:-16px 0 0 -16px;pointer-events:none;">
        <span style="position:absolute;width:28px;height:28px;border-radius:9999px;background:rgba(59,130,246,0.38);box-shadow:0 0 10px rgba(59,130,246,0.6);animation:pulse 2s cubic-bezier(0.4,0,0.6,1) infinite;"></span>
        <span style="position:relative;width:15px;height:15px;border-radius:9999px;background:${fill};border:2.5px solid #ffffff;box-shadow:0 2px 6px rgba(0,0,0,0.4);display:flex;align-items:center;justify-content:center;">
          <span style="width:4.5px;height:4.5px;border-radius:9999px;background:#ffffff;"></span>
        </span>
      </div>`,
    iconSize: [0, 0],
    iconAnchor: [0, 0],
  });
}

/** Chevron pointing the way the walk goes, rotated to the road's own bearing. */
function arrowIcon(bearing: number) {
  return L.divIcon({
    className: "girivalam-arrow-pin",
    html: `
      <span style="position:absolute;left:0;top:0;display:inline-flex;pointer-events:none;transform:translate(-50%,-50%) rotate(${bearing.toFixed(0)}deg);">
        <svg viewBox="0 0 12 12" width="10" height="10">
          <path d="M6 2 L6 10 M3 5 L6 2 L9 5" fill="none" stroke="#ffffff" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round" style="filter:drop-shadow(0 1px 2px rgba(0,0,0,0.65));" />
        </svg>
      </span>`,
    iconSize: [0, 0],
    iconAnchor: [0, 0],
  });
}

/* ---------------------------------------------------------------- map glue */

interface MapApi {
  zoomIn: () => void;
  zoomOut: () => void;
  reset: () => void;
  flyTo: (p: LatLng, zoom?: number) => void;
}

function MapBridge({ onReady, compact }: { onReady: (api: MapApi) => void; compact: boolean }) {
  const map = useMap();
  useEffect(() => {
    onReady({
      zoomIn: () => map.zoomIn(),
      zoomOut: () => map.zoomOut(),
      reset: () =>
        map.flyToBounds(ROUTE_BOUNDS as L.LatLngBoundsExpression, {
          ...fitOptions(compact),
          duration: 0.6,
        }),
      flyTo: (p, zoom = 16) => map.flyTo(p as L.LatLngExpression, zoom, { duration: 0.8 }),
    });
  }, [map, onReady, compact]);
  return null;
}

/** Leaflet needs a nudge whenever its container changes size. */
function ResizeOnChange({
  token,
  refit,
  compact,
}: {
  token: unknown;
  refit: boolean;
  compact: boolean;
}) {
  const map = useMap();
  useEffect(() => {
    const id = window.setTimeout(() => {
      map.invalidateSize();
      if (refit) map.fitBounds(ROUTE_BOUNDS as L.LatLngBoundsExpression, fitOptions(compact));
    }, 220);
    return () => window.clearTimeout(id);
  }, [map, token, refit, compact]);
  return null;
}

/* ------------------------------------------------------------- the component */

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
  const [layer, setLayer] = useState<LayerKey>("satellite");
  const [expanded, setExpanded] = useState(false);
  const [sourcesOpen, setSourcesOpen] = useState(false);
  const [gps, setGps] = useState<{ position: LatLng; accuracyM: number } | null>(null);
  const [gpsState, setGpsState] = useState<"idle" | "locating" | "denied" | "unavailable">("idle");
  const [compact, setCompact] = useState(false);

  const apiRef = useRef<MapApi | null>(null);
  const onReady = useCallback((api: MapApi) => {
    apiRef.current = api;
  }, []);

  // Narrow screens get shorter pill labels so the route stays readable.
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 640px)");
    const sync = () => setCompact(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  // Esc leaves full screen.
  useEffect(() => {
    if (!expanded) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setExpanded(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [expanded]);

  /** Each leg of the real routed line, coloured by its (simulated) crowd level. */
  const legs = useMemo(
    () =>
      routeGeometry.map((seg) => ({
        id: seg.id,
        path: seg.path,
        lengthKm: seg.lengthKm,
        color: SEVERITY_BANDS.find((b) => b.key === segmentSeverityById[seg.id])!.hex,
        arrows: arrowsAlong(seg.path, 380),
      })),
    [],
  );

  const stops = useMemo(
    () => [
      {
        id: "temple",
        name: "Arunachaleswarar Temple",
        tamilName: "அருணாசலேஸ்வரர் கோயில்",
        sub: "Start / End",
        temple: true,
        lingam: null as Lingam | null,
      },
      ...ashtaLingamStatus.map((l) => ({
        id: l.id,
        name: l.name,
        tamilName: l.tamilName,
        sub: `${l.cumulativeKm} km`,
        temple: false,
        lingam: l,
      })),
    ],
    [],
  );

  const locate = useCallback(() => {
    if (!("geolocation" in navigator)) {
      setGpsState("unavailable");
      return;
    }
    setGpsState("locating");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const p: LatLng = [pos.coords.latitude, pos.coords.longitude];
        setGps({ position: p, accuracyM: Math.round(pos.coords.accuracy) });
        setGpsState("idle");
        apiRef.current?.flyTo(p, 16);
      },
      (err) => setGpsState(err.code === err.PERMISSION_DENIED ? "denied" : "unavailable"),
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 30000 },
    );
  }, []);

  const tile = TILES[layer];
  const estimatedCount = UNVERIFIED_STOP_IDS.length;

  return (
    <div
      className={
        expanded
          ? "fixed inset-0 z-[1000] bg-black p-2 sm:p-5"
          : "relative overflow-hidden rounded-2xl border border-[#e4ddcc] bg-[#e8e3d6] shadow-sm"
      }
    >
      {/*
        The height lives on this wrapper, not on <MapContainer>. React Leaflet
        reads MapContainer's own props once, on mount, so a className that
        changes when the map goes full screen is simply ignored and the map
        keeps its original 540 px.
      */}
      <div
        className={
          expanded
            ? "relative h-full w-full overflow-hidden rounded-2xl"
            : "relative h-[400px] w-full sm:h-[480px] lg:h-[540px]"
        }
      >
        <MapContainer
          bounds={ROUTE_BOUNDS as L.LatLngBoundsExpression}
          boundsOptions={fitOptions(compact)}
          minZoom={11}
          maxZoom={18}
          scrollWheelZoom
          zoomControl={false}
          attributionControl
          className="h-full w-full"
        >
          <TileLayer url={tile.url} attribution={tile.attribution} maxZoom={tile.maxZoom} />
          <MapBridge onReady={onReady} compact={compact} />
          <ResizeOnChange token={`${expanded}-${layer}-${compact}`} refit compact={compact} />

          {/* White casing so the ribbon stays legible over satellite imagery */}
          {legs.map((leg) => (
            <Polyline
              key={`casing-${leg.id}`}
              positions={leg.path as L.LatLngExpression[]}
              pathOptions={{
                color: "#ffffff",
                weight: 11,
                opacity: 0.92,
                lineCap: "round",
                lineJoin: "round",
              }}
              interactive={false}
            />
          ))}

          {/* The route itself, one polyline per leg, coloured by crowd level */}
          {legs.map((leg) => (
            <Polyline
              key={leg.id}
              positions={leg.path as L.LatLngExpression[]}
              pathOptions={{
                color: leg.color as string,
                weight: 6.5,
                opacity: 1,
                lineCap: "round",
                lineJoin: "round",
              }}
            >
              <Popup>
                <LegPopup id={leg.id} lengthKm={leg.lengthKm} />
              </Popup>
            </Polyline>
          ))}

          {/* Direction of travel, following the real bearing of the road */}
          {legs.flatMap((leg) =>
            leg.arrows.map((a, i) => (
              <Marker
                key={`arrow-${leg.id}-${i}`}
                position={a.position as L.LatLngExpression}
                icon={arrowIcon(a.bearing)}
                interactive={false}
              />
            )),
          )}

          <Marker
            position={ARUNACHALA_CENTER as L.LatLngExpression}
            icon={hillIcon(t("Arunachala"), `(${ARUNACHALA_HEIGHT_FT.toLocaleString("en-IN")} ft)`)}
            interactive={false}
          />

          {/* Temple and the eight Ashta Lingams */}
          <StopMarkers
            stops={stops}
            selectedId={selectedId}
            onSelect={onSelect}
            compact={compact}
          />

          {/* The walker: the real GPS fix once granted, otherwise the demo position */}
          <Marker
            position={(gps?.position ?? walkerPosition) as L.LatLngExpression}
            icon={walkerIcon(Boolean(gps))}
            interactive={false}
          />
        </MapContainer>

        {/* ------------------------------------------------- layer toggle */}
        <div className="absolute left-2.5 top-2.5 z-[500] flex rounded-lg bg-white/95 p-1 shadow-md ring-1 ring-black/5 backdrop-blur sm:left-3 sm:top-3">
          {(["map", "satellite"] as const).map((k) => (
            <button
              key={k}
              type="button"
              onClick={() => setLayer(k)}
              aria-pressed={layer === k}
              className={`rounded-md px-2.5 py-1.5 text-[11px] font-bold transition-colors sm:px-3 sm:text-xs ${
                layer === k
                  ? "bg-[#14532d] text-white shadow-sm"
                  : "text-slate-600 hover:text-[#14532d]"
              }`}
            >
              {k === "map" ? t("Map") : t("Satellite")}
            </button>
          ))}
        </div>

        {/* ------------------------------------------------- map controls */}
        <div className="absolute right-2.5 top-2.5 z-[500] flex flex-col gap-1.5 sm:right-3 sm:top-3 sm:gap-2">
          <ControlButton
            label={t("Reset the map to the full route")}
            onClick={() => apiRef.current?.reset()}
          >
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
              className="flex h-8 w-8 items-center justify-center text-slate-700 transition-colors hover:bg-[#14532d] hover:text-white sm:h-9 sm:w-9"
            >
              <Plus className="h-4 w-4" />
            </button>
            <span className="h-px bg-slate-200" />
            <button
              type="button"
              aria-label={t("Zoom out")}
              onClick={() => apiRef.current?.zoomOut()}
              className="flex h-8 w-8 items-center justify-center text-slate-700 transition-colors hover:bg-[#14532d] hover:text-white sm:h-9 sm:w-9"
            >
              <Minus className="h-4 w-4" />
            </button>
          </div>
          <ControlButton
            label={t("Show my GPS location")}
            onClick={locate}
            active={Boolean(gps)}
            busy={gpsState === "locating"}
          >
            {gpsState === "locating" ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <LocateFixed className="h-4 w-4" />
            )}
          </ControlButton>
          <ControlButton
            label={t("Where this map data comes from")}
            onClick={() => setSourcesOpen((v) => !v)}
            active={sourcesOpen}
          >
            <Info className="h-4 w-4" />
          </ControlButton>
        </div>

        {/* ------------------------------------------- GPS / accuracy notes */}
        <div className="pointer-events-none absolute left-2.5 top-14 z-[500] flex max-w-[min(20rem,calc(100%-5.5rem))] flex-col gap-1.5 sm:left-3 sm:top-16">
          {gps && (
            <span className="pointer-events-auto inline-flex items-center gap-1.5 self-start rounded-lg bg-white/95 px-2.5 py-1 text-[10.5px] font-semibold text-slate-600 shadow ring-1 ring-black/5">
              <span className="h-1.5 w-1.5 rounded-full bg-blue-600" />
              {t("Your location")} · ±{gps.accuracyM} m
            </span>
          )}
          {gpsState === "denied" && (
            <span className="pointer-events-auto inline-flex items-center gap-1.5 self-start rounded-lg bg-white/95 px-2.5 py-1 text-[10.5px] font-semibold text-rose-700 shadow ring-1 ring-black/5">
              <TriangleAlert className="h-3 w-3" />
              {t("Location permission denied")}
            </span>
          )}
          {gpsState === "unavailable" && (
            <span className="pointer-events-auto inline-flex items-center gap-1.5 self-start rounded-lg bg-white/95 px-2.5 py-1 text-[10.5px] font-semibold text-amber-700 shadow ring-1 ring-black/5">
              <TriangleAlert className="h-3 w-3" />
              {t("Location unavailable")}
            </span>
          )}
        </div>

        {/* ---------------------------------------------------- the legend */}
        <div className="absolute inset-x-2.5 bottom-2.5 z-[500] rounded-xl bg-white/95 px-3 py-2 shadow-md ring-1 ring-black/5 backdrop-blur sm:inset-x-3 sm:bottom-3 sm:px-3.5">
          <div className="flex flex-wrap items-center gap-x-3.5 gap-y-1">
            <span className="text-[11px] font-bold text-[#14532d]">{t("Route Crowd Status")}</span>
            {SEVERITY_BANDS.map((b) => (
              <span
                key={b.key}
                className="inline-flex items-center gap-1.5 text-[10.5px] font-medium text-slate-600 sm:text-[11px]"
              >
                <span className="h-2.5 w-2.5 rounded-full" style={{ background: b.hex }} />
                {t(LEGEND_LABEL[b.key])}{" "}
                <span className="hidden text-slate-400 sm:inline">{LEGEND_RANGE[b.key]}</span>
              </span>
            ))}
          </div>
          <p className="mt-1 flex flex-wrap items-center gap-x-1.5 gap-y-0.5 text-[9.5px] leading-tight text-slate-400">
            <span>{t("Crowd levels are simulated demo data, not live counts.")}</span>
            {/* The map attribution already credits OSM, so on a phone this
                second sentence only costs the legend a line. */}
            <span className="hidden sm:inline">{t("Route geometry: OpenStreetMap.")}</span>
            {ROUTE_HAS_ESTIMATED_POINTS && (
              <button
                type="button"
                onClick={() => setSourcesOpen(true)}
                className="inline-flex items-center gap-1 rounded font-bold text-amber-700 underline decoration-dotted underline-offset-2 hover:text-amber-800"
              >
                <TriangleAlert className="h-2.5 w-2.5 shrink-0" />
                {t("{{count}} of 8 Lingam positions are estimated", { count: estimatedCount })}
              </button>
            )}
          </p>
        </div>

        {/* ----------------------------------------------- provenance panel */}
        {sourcesOpen && <DataSourcePanel onClose={() => setSourcesOpen(false)} />}
      </div>
    </div>
  );
});

/* ----------------------------------------------------------- stop markers */

interface StopEntry {
  id: string;
  name: string;
  tamilName: string;
  sub: string;
  temple: boolean;
  lingam: Lingam | null;
}

/**
 * The temple and the eight Ashta Lingams.
 *
 * This lives inside `<MapContainer>` so it can project coordinates at the
 * current zoom and lay the labels out in screen space — zoom in and labels that
 * had no room reappear on their own.
 */
function StopMarkers({
  stops,
  selectedId,
  onSelect,
  compact,
}: {
  stops: StopEntry[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  compact: boolean;
}) {
  const { t } = useTranslation();
  const map = useMap();
  /**
   * The current view, as projected pixels. Updated on `moveend` only — never
   * mid-drag — so labels settle once the devotee lets go instead of flickering
   * while the map is moving.
   */
  const readView = useCallback(() => {
    const b = map.getPixelBounds();
    // Inset by the chrome floating over the map, so a label is never placed
    // under the layer toggle, the controls down the right, or the legend.
    const inset = compact
      ? { top: 46, bottom: 86, left: 10, right: 46 }
      : { top: 48, bottom: 70, left: 12, right: 52 };
    return {
      zoom: map.getZoom(),
      minX: (b.min?.x ?? 0) + inset.left,
      minY: (b.min?.y ?? 0) + inset.top,
      maxX: (b.max?.x ?? 0) - inset.right,
      maxY: (b.max?.y ?? 0) - inset.bottom,
    };
  }, [map, compact]);

  const [view, setView] = useState(readView);

  useEffect(() => {
    const sync = () => setView(readView());
    map.on("moveend", sync);
    map.on("resize", sync);
    sync();
    return () => {
      map.off("moveend", sync);
      map.off("resize", sync);
    };
  }, [map, readView]);

  const placement = useMemo(
    () =>
      placeLabels(
        stops.map((s) => ({ id: s.id, position: stopById(s.id)!.position })),
        (p) => map.project(p as L.LatLngExpression, view.zoom),
        view,
        selectedId,
        compact,
      ),
    [stops, map, view, selectedId, compact],
  );

  return (
    <>
      {stops.map((s) => {
        const stop = stopById(s.id)!;
        const color = s.lingam
          ? SEVERITY_BANDS.find((b) => b.key === lingamSeverity(s.lingam!))!.hex
          : "#2563eb";
        const place = placement[s.id];
        return (
          <Marker
            key={s.id}
            position={stop.position as L.LatLngExpression}
            icon={stopIcon({
              id: s.id,
              label: t(s.name),
              sub: t(s.sub),
              color,
              active: selectedId === s.id,
              verified: stop.verified,
              temple: s.temple,
              transform: place.transform,
              showLabel: place.showLabel,
              compact,
            })}
            zIndexOffset={selectedId === s.id ? 700 : place.showLabel ? 0 : 400}
            eventHandlers={{ click: () => onSelect(s.id) }}
          >
            <Popup minWidth={244} maxWidth={286}>
              <StopPopup id={s.id} name={s.name} tamilName={s.tamilName} lingam={s.lingam} />
            </Popup>
          </Marker>
        );
      })}
    </>
  );
}

/* ------------------------------------------------------------------ popups */

function LegPopup({ id, lengthKm }: { id: string; lengthKm: number }) {
  const { t } = useTranslation();
  const seg = routeGeometry.find((s) => s.id === id)!;
  const from = stopById(seg.fromId);
  const to = stopById(seg.toId);
  const band = SEVERITY_BANDS.find((b) => b.key === segmentSeverityById[id])!;
  const label = (stopId: string) => {
    if (stopId === "temple") return t("Arunachaleswarar Temple");
    return t(ashtaLingamStatus.find((l) => l.id === stopId)?.name ?? stopId);
  };
  return (
    <div className="min-w-[180px] space-y-1.5">
      <p className="text-[13px] font-bold text-slate-900">
        {label(seg.fromId)} → {label(seg.toId)}
      </p>
      <p className="text-[11px] text-slate-500">
        {lengthKm.toFixed(2)} {t("km")} ·{" "}
        {t("km {{from}}–{{to}} of the walk", {
          from: from?.measuredKm.toFixed(1),
          to: to && to.id !== "temple" ? to.measuredKm.toFixed(1) : ROUTE_TOTAL_KM.toFixed(1),
        })}
      </p>
      <p
        className="inline-flex items-center gap-1.5 text-[11px] font-semibold"
        style={{ color: band.hex }}
      >
        <span className="h-2 w-2 rounded-full" style={{ background: band.hex }} />
        {t(LEGEND_LABEL[band.key])} · {t("simulated")}
      </p>
    </div>
  );
}

function StopPopup({
  id,
  name,
  tamilName,
  lingam,
}: {
  id: string;
  name: string;
  tamilName: string;
  lingam: Lingam | null;
}) {
  const { t } = useTranslation();
  const stop = stopById(id)!;
  const band = lingam ? SEVERITY_BANDS.find((b) => b.key === lingamSeverity(lingam))! : null;
  const facilities = lingam?.facilities ?? ["Shoe stand", "Water station", "Toilets", "Parking"];

  return (
    <div className="space-y-2">
      <img
        src={STOP_IMAGE[id] ?? FALLBACK_IMAGE}
        alt=""
        loading="lazy"
        className="h-24 w-full rounded-lg object-cover"
        onError={(e) => {
          (e.currentTarget as HTMLImageElement).src = FALLBACK_IMAGE;
        }}
      />
      <p className="text-[9px] leading-tight text-slate-400">
        {t("Representative image of Arunachala, not a photograph of this shrine.")}
      </p>

      <div>
        <p className="text-[14px] font-bold leading-tight text-slate-900">{t(name)}</p>
        <p className="text-[11px] text-slate-500">{tamilName}</p>
      </div>

      <dl className="grid grid-cols-2 gap-x-2 gap-y-1 text-[11px]">
        <div>
          <dt className="text-slate-400">{t("From temple")}</dt>
          <dd className="font-semibold text-slate-700">
            {lingam ? `${lingam.cumulativeKm} km` : `0 / ${GIRIVALAM_DISTANCE_KM} km`}
          </dd>
        </div>
        <div>
          <dt className="text-slate-400">{t("Measured on route")}</dt>
          <dd className="font-semibold text-slate-700">{stop.measuredKm.toFixed(2)} km</dd>
        </div>
        {lingam && (
          <>
            <div>
              <dt className="text-slate-400">{t("Direction")}</dt>
              <dd className="font-semibold text-slate-700">{t(lingam.direction)}</dd>
            </div>
            <div>
              <dt className="text-slate-400">{t("Wait")}</dt>
              <dd className="font-semibold text-slate-700">
                {lingam.waitMin} {t("min")}
              </dd>
            </div>
          </>
        )}
      </dl>

      {band && lingam && (
        <p
          className="inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[10px] font-bold"
          style={{ background: `${band.hex}1a`, color: band.hex }}
        >
          <span className="h-1.5 w-1.5 rounded-full" style={{ background: band.hex }} />
          {t(LEGEND_LABEL[band.key])} · {Math.round((lingam.crowd / lingam.capacity) * 100)}% ·{" "}
          {t("simulated")}
        </p>
      )}

      <div>
        <p className="mb-1 text-[10px] font-bold uppercase tracking-wide text-slate-400">
          {t("Nearby facilities")}
        </p>
        <ul className="flex flex-wrap gap-1">
          {facilities.map((f) => (
            <li
              key={f}
              className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-600"
            >
              {t(f)}
            </li>
          ))}
        </ul>
      </div>

      {/* Where this marker's coordinate came from — stated on every popup. */}
      <div
        className={`rounded-lg px-2 py-1.5 text-[10px] leading-snug ${
          stop.verified ? "bg-emerald-50 text-emerald-800" : "bg-amber-50 text-amber-900"
        }`}
      >
        <span className="mb-0.5 flex items-center gap-1 font-bold">
          {stop.verified ? (
            <>
              <BadgeCheck className="h-3 w-3" /> {t("Surveyed position")}
            </>
          ) : (
            <>
              <TriangleAlert className="h-3 w-3" /> {t("Estimated position")}
            </>
          )}
        </span>
        {stop.verified ? (
          <a
            href={`https://www.openstreetmap.org/${stop.osm}`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 underline"
          >
            OpenStreetMap {stop.osm} <ExternalLink className="h-2.5 w-2.5" />
          </a>
        ) : (
          t(
            "No surveyed coordinate exists for this shrine. It is placed on the routed road at the distance the temple publishes.",
          )
        )}
        <span className="mt-0.5 block font-mono text-[9.5px] text-slate-500">
          {stop.position[0].toFixed(5)}, {stop.position[1].toFixed(5)}
        </span>
      </div>
    </div>
  );
}

/* -------------------------------------------------------- provenance panel */

function DataSourcePanel({ onClose }: { onClose: () => void }) {
  const { t } = useTranslation();
  return (
    <div className="absolute inset-x-2.5 top-2.5 z-[600] max-h-[calc(100%-5rem)] overflow-y-auto rounded-xl bg-white/97 p-3.5 shadow-xl ring-1 ring-black/10 backdrop-blur sm:inset-x-auto sm:right-14 sm:top-3 sm:w-[22rem]">
      <div className="mb-2 flex items-start justify-between gap-3">
        <h3 className="text-[13px] font-bold text-[#14532d]">{t("About this map")}</h3>
        <button
          type="button"
          onClick={onClose}
          aria-label={t("Close")}
          className="-m-1 rounded p-1 text-slate-400 hover:text-slate-700"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <p className="text-[11px] leading-relaxed text-slate-600">
        {t(
          "The route is not drawn by hand. It is routed over the OpenStreetMap road network and measures {{km}} km against the {{published}} km the temple publishes.",
          { km: ROUTE_TOTAL_KM.toFixed(2), published: GIRIVALAM_DISTANCE_KM },
        )}
      </p>

      <p className="mt-2 text-[10px] font-bold uppercase tracking-wide text-slate-400">
        {t("Roads followed")}
      </p>
      <p className="text-[11px] leading-relaxed text-slate-600">{ROUTE_ROADS.join(" · ")}</p>

      <p className="mt-2.5 text-[10px] font-bold uppercase tracking-wide text-slate-400">
        {t("Sources")}
      </p>
      <ul className="space-y-1">
        {ROUTE_SOURCES.map((s) => (
          <li key={s.name} className="text-[11px] leading-snug text-slate-600">
            <a
              href={s.url}
              target="_blank"
              rel="noreferrer"
              className="font-semibold text-[#14532d] underline"
            >
              {s.name}
            </a>{" "}
            — {s.what}
            {"licence" in s && s.licence ? ` (${s.licence})` : ""}
          </li>
        ))}
      </ul>

      <p className="mt-2.5 text-[10px] font-bold uppercase tracking-wide text-amber-600">
        {t("Known limits")}
      </p>
      <ul className="list-disc space-y-1 pl-4">
        {ROUTE_CAVEATS.map((c) => (
          <li key={c} className="text-[11px] leading-snug text-slate-600">
            {c}
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ------------------------------------------------------------------ buttons */

function ControlButton({
  label,
  onClick,
  children,
  active,
  busy,
}: {
  label: string;
  onClick: () => void;
  children: React.ReactNode;
  active?: boolean;
  busy?: boolean;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      aria-pressed={active}
      disabled={busy}
      onClick={onClick}
      className={`flex h-8 w-8 items-center justify-center rounded-lg shadow-md ring-1 ring-black/5 transition-colors disabled:opacity-70 sm:h-9 sm:w-9 ${
        active
          ? "bg-[#14532d] text-white"
          : "bg-white/95 text-slate-700 hover:bg-[#14532d] hover:text-white"
      }`}
    >
      {children}
    </button>
  );
}
