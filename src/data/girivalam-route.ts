/**
 * Girivalam route geometry — typed access to `girivalam-route.json`.
 *
 * The JSON is generated, never hand-edited. Regenerate it with:
 *
 *     node scripts/build-girivalam-route.mjs
 *
 * It holds real GIS data only: shrine coordinates read from OpenStreetMap and
 * a walking line routed over the OSM road network (OSRM, foot profile), so the
 * drawn route follows Chengam Main Road, Hill Round Road, the Kanji Road and
 * the Cuddalore–Chittoor Road rather than a drawn circle.
 *
 * WHAT IS AND IS NOT VERIFIED
 * Five of the eight Ashta Lingams — Indra, Yama, Niruthi, Varuna and Kubera —
 * plus the Arunachaleswarar temple carry surveyed OpenStreetMap coordinates and
 * their OSM ids. Agni, Vayu and Esanya have no surveyed node anywhere in OSM;
 * their markers are placed on the routed line at the distance the temple
 * publishes and are flagged `verified: false`. The map must show that
 * distinction rather than present all eight as equally accurate.
 *
 * This module carries geometry only. Crowd, facility and timing figures live in
 * `girivalam.ts` and are simulated demo data.
 */

import raw from "./girivalam-route.json";

/** `[latitude, longitude]` — Leaflet's order, not GeoJSON's. */
export type LatLng = [number, number];

/* ------------------------------------------------------------------- types */

interface RawFeature {
  type: string;
  geometry: { type: string; coordinates: number[] | number[][] };
  properties: Record<string, unknown>;
}

export interface RouteStop {
  id: string;
  /** 0 = the temple, 1–8 = the Ashta Lingams in clockwise walking order. */
  order: number;
  kind: "temple" | "lingam";
  position: LatLng;
  /** True only when a surveyed OpenStreetMap node/way gives the position. */
  verified: boolean;
  /** Human-readable provenance, shown in the marker popup. */
  positionSource: string;
  /** `node/123` or `way/123`, for openstreetmap.org/<osm>. Null when unverified. */
  osm: string | null;
  osmName: string | null;
  osmNameTa: string | null;
  osmCheckDate: string | null;
  /** Distance from the temple measured along the routed line, in km. */
  measuredKm: number;
  /** Distance the temple publishes for pilgrims, in km. */
  publishedKm: number | null;
}

export interface RouteGeometrySegment {
  /** `"indra-agni"` — matches the ids used by the crowd data in `girivalam.ts`. */
  id: string;
  fromId: string;
  toId: string;
  /** Road-following polyline for this leg, ready for a Leaflet `<Polyline>`. */
  path: LatLng[];
  fromKm: number;
  toKm: number;
  lengthKm: number;
}

/* ------------------------------------------------------------------ parsing */

const features = raw.features as unknown as RawFeature[];

const lineFeatures = features.filter((f) => f.geometry.type === "LineString");
const pointFeatures = features.filter((f) => f.geometry.type === "Point");

/** GeoJSON stores `[lng, lat]`; Leaflet wants `[lat, lng]`. */
const toLatLng = (c: number[]): LatLng => [c[1], c[0]];

export const routeGeometry: RouteGeometrySegment[] = lineFeatures.map((f) => {
  const p = f.properties;
  return {
    id: p.id as string,
    fromId: p.fromId as string,
    toId: p.toId as string,
    path: (f.geometry.coordinates as number[][]).map(toLatLng),
    fromKm: p.fromKm as number,
    toKm: p.toKm as number,
    lengthKm: p.lengthKm as number,
  };
});

export const routeStops: RouteStop[] = pointFeatures
  .map((f) => {
    const p = f.properties;
    return {
      id: p.id as string,
      order: p.order as number,
      kind: p.kind as "temple" | "lingam",
      position: toLatLng(f.geometry.coordinates as number[]),
      verified: p.verified as boolean,
      positionSource: p.positionSource as string,
      osm: (p.osm as string | null) ?? null,
      osmName: (p.osmName as string | null) ?? null,
      osmNameTa: (p.osmNameTa as string | null) ?? null,
      osmCheckDate: (p.osmCheckDate as string | null) ?? null,
      measuredKm: p.measuredKm as number,
      publishedKm: (p.publishedKm as number | null) ?? null,
    };
  })
  .sort((a, b) => a.order - b.order);

const stopIndex = new Map(routeStops.map((s) => [s.id, s]));

export const stopById = (id: string): RouteStop | undefined => stopIndex.get(id);

export const geometryById = (id: string): RouteGeometrySegment | undefined =>
  routeGeometry.find((s) => s.id === id);

/* --------------------------------------------------------------- provenance */

export const ROUTE_META = raw.metadata;

/** `["agni", "vayu", "esanya"]` — the stops without a surveyed coordinate. */
export const UNVERIFIED_STOP_IDS: string[] = routeStops.filter((s) => !s.verified).map((s) => s.id);

/**
 * True while any marker is placed without a surveyed coordinate. The map shows
 * a "partly estimated" notice whenever this is set — the geographical accuracy
 * of those markers is not claimed.
 */
export const ROUTE_HAS_ESTIMATED_POINTS = UNVERIFIED_STOP_IDS.length > 0;

/** Distance measured along the routed line. Differs from the published 14 km. */
export const ROUTE_TOTAL_KM: number = raw.metadata.totalRoutedKm;

/** The 14 km the temple publishes for pilgrims. */
export const ROUTE_PUBLISHED_KM: number = raw.metadata.publishedKm;

/** Named roads the line runs along, for the data-provenance panel. */
export const ROUTE_ROADS: string[] = raw.metadata.roadsUsed;

export const ROUTE_SOURCES = raw.metadata.sources;
export const ROUTE_CAVEATS: string[] = raw.metadata.caveats;

/* ----------------------------------------------------------------- geometry */

/** Every point of the walk, temple back to temple. */
export const fullRoutePath: LatLng[] = routeGeometry.flatMap((s, i) =>
  // Each segment repeats the previous segment's last point, so drop it.
  i === 0 ? s.path : s.path.slice(1),
);

/** `[[south, west], [north, east]]` — ready for `map.fitBounds`. */
export const ROUTE_BOUNDS: [LatLng, LatLng] = [
  [raw.metadata.bbox[1], raw.metadata.bbox[0]],
  [raw.metadata.bbox[3], raw.metadata.bbox[2]],
];

const R_EARTH_M = 6371008.8;
const rad = (d: number) => (d * Math.PI) / 180;
const deg = (r: number) => (r * 180) / Math.PI;

/** Great-circle metres between two points. */
export function metresBetween(a: LatLng, b: LatLng): number {
  const dLat = rad(b[0] - a[0]);
  const dLng = rad(b[1] - a[1]);
  const s =
    Math.sin(dLat / 2) ** 2 + Math.cos(rad(a[0])) * Math.cos(rad(b[0])) * Math.sin(dLng / 2) ** 2;
  return 2 * R_EARTH_M * Math.asin(Math.sqrt(s));
}

/** Initial compass bearing from `a` to `b`, 0 = north, increasing clockwise. */
export function bearingBetween(a: LatLng, b: LatLng): number {
  const dLng = rad(b[1] - a[1]);
  const y = Math.sin(dLng) * Math.cos(rad(b[0]));
  const x =
    Math.cos(rad(a[0])) * Math.sin(rad(b[0])) -
    Math.sin(rad(a[0])) * Math.cos(rad(b[0])) * Math.cos(dLng);
  return (deg(Math.atan2(y, x)) + 360) % 360;
}

/**
 * Walks `km` along the real route from the temple and returns where that lands,
 * together with the direction of travel there. Past the end of the walk it
 * clamps to the temple.
 */
export function pointAtKm(km: number): { position: LatLng; bearing: number } {
  const target = Math.max(0, Math.min(km, ROUTE_TOTAL_KM)) * 1000;
  let walked = 0;
  for (let i = 1; i < fullRoutePath.length; i++) {
    const a = fullRoutePath[i - 1];
    const b = fullRoutePath[i];
    const step = metresBetween(a, b);
    if (walked + step >= target) {
      const f = step === 0 ? 0 : (target - walked) / step;
      return {
        position: [a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f],
        bearing: bearingBetween(a, b),
      };
    }
    walked += step;
  }
  const last = fullRoutePath[fullRoutePath.length - 1];
  return { position: last, bearing: bearingBetween(fullRoutePath[0], last) };
}

/** Where on the route a walker who has covered `km` of routed distance stands. */
export const positionAtKm = (km: number): LatLng => pointAtKm(km).position;

/**
 * Converts a distance on the temple's published 14 km scale to a distance along
 * the routed line, which measures a little longer.
 *
 * The two scales are pinned together at every stop — a walker 4.9 published km
 * in is standing at Yama Lingam, so 4.9 maps to Yama's own measured distance —
 * and interpolated linearly in between. Without this, markers and the walker
 * dot would drift apart by a few hundred metres along the walk.
 */
export function routedKmForPublishedKm(km: number): number {
  const anchors: { published: number; measured: number }[] = [
    ...routeStops
      .filter((s) => s.publishedKm != null)
      .map((s) => ({ published: s.publishedKm as number, measured: s.measuredKm })),
    { published: ROUTE_PUBLISHED_KM, measured: ROUTE_TOTAL_KM }, // closing at the temple
  ].sort((a, b) => a.published - b.published);

  if (km <= anchors[0].published) return anchors[0].measured;
  for (let i = 1; i < anchors.length; i++) {
    const lo = anchors[i - 1];
    const hi = anchors[i];
    if (km <= hi.published) {
      const span = hi.published - lo.published;
      const f = span === 0 ? 0 : (km - lo.published) / span;
      return lo.measured + (hi.measured - lo.measured) * f;
    }
  }
  return ROUTE_TOTAL_KM;
}

/** The temple — start and end of the walk. */
export const TEMPLE_POSITION: LatLng = stopIndex.get("temple")!.position;

/**
 * Evenly spaced direction-of-travel chevrons along one leg: a position every
 * `spacingM` metres, each with the bearing of the road at that point. Legs
 * shorter than one spacing still get a single arrow at their midpoint.
 */
export function arrowsAlong(
  path: LatLng[],
  spacingM = 420,
): { position: LatLng; bearing: number }[] {
  const out: { position: LatLng; bearing: number }[] = [];
  let carried = spacingM / 2;
  for (let i = 1; i < path.length; i++) {
    const a = path[i - 1];
    const b = path[i];
    const step = metresBetween(a, b);
    if (step === 0) continue;
    const bearing = bearingBetween(a, b);
    let at = carried;
    while (at <= step) {
      const f = at / step;
      out.push({ position: [a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f], bearing });
      at += spacingM;
    }
    carried = at - step;
  }
  if (out.length === 0 && path.length > 1) {
    const mid = Math.floor(path.length / 2);
    out.push({
      position: path[mid],
      bearing: bearingBetween(path[Math.max(0, mid - 1)], path[mid]),
    });
  }
  return out;
}
