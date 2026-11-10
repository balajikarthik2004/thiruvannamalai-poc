/**
 * Builds src/data/girivalam-route.json — the real GIS geometry for the Girivalam walk.
 *
 *   node scripts/build-girivalam-route.mjs
 *
 * Nothing in this file is hand-drawn. Two public sources are used:
 *
 *   1. OpenStreetMap (via Overpass) — the Ashta Lingam shrines and the
 *      Arunachaleswarar temple, read back as the exact nodes/ways that OSM
 *      surveyors recorded. Every coordinate carries its OSM id so it can be
 *      re-checked at openstreetmap.org/node/<id>.
 *
 *   2. OSRM (public demo server, foot profile, routed over OSM road data) —
 *      the walking line between those shrines. The output therefore follows
 *      the actual Girivalam ring roads (Chengam Main Road, Hill Round Road,
 *      Tiruvannamalai–Kanji Road, Cuddalore–Chittoor Road, Pondy–Krishnagiri
 *      Road) rather than a drawn circle.
 *
 * THREE OF THE EIGHT LINGAMS ARE NOT IN OPENSTREETMAP.
 * Agni, Vayu and Esanya have no surveyed node. They are NOT invented here:
 * each is placed on the real routed line at the fraction of the leg implied by
 * the distances the temple publishes for pilgrims, and is flagged
 * `verified: false` so the UI can say so. Treat those three as approximate.
 */

import { writeFile, mkdir } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const OUT = resolve(ROOT, "src/data/girivalam-route.json");

const UA = "temple-path-girivalam-route-builder/1.0";

const OVERPASS = [
  "https://overpass-api.de/api/interpreter",
  "https://overpass.kumi.systems/api/interpreter",
  "https://overpass.private.coffee/api/interpreter",
];
const OSRM = "https://router.project-osrm.org";

/* ------------------------------------------------------------------ sources */

/**
 * The OSM elements we read back. `osmType`/`osmId` are the primary key — the
 * query asks for these ids by name so a rename upstream fails loudly instead
 * of silently moving a shrine.
 */
const OSM_TARGETS = [
  { id: "temple", osmType: "way", osmId: 91456713, expectName: "Arulmigu Arunachaleswarar Temple" },
  { id: "indra", osmType: "way", osmId: 1553492403, expectName: "Indira Lingam" },
  { id: "yama", osmType: "node", osmId: 2154074938, expectName: "Arulmigu Yamalingam" },
  { id: "niruthi", osmType: "node", osmId: 2154075000, expectName: "Shri Niruthi Lingam" },
  { id: "varuna", osmType: "node", osmId: 2154075143, expectName: "Arulmigu Sri Varuna Lingam" },
  { id: "kubera", osmType: "node", osmId: 2154075184, expectName: "Kubera Lingam" },
];

/**
 * Lingams with no OSM node. `afterId`/`beforeId` are the surveyed shrines they
 * sit between; `publishedKm` is the cumulative distance the temple publishes,
 * used only to pick the point along the real routed line.
 */
const UNVERIFIED = [
  { id: "agni", afterId: "indra", beforeId: "yama", publishedKm: 3.1 },
  { id: "vayu", afterId: "varuna", beforeId: "kubera", publishedKm: 9.5 },
  { id: "esanya", afterId: "kubera", beforeId: "temple", publishedKm: 12.6 },
];

/** Cumulative km the temple publishes, for the interpolation above. */
const PUBLISHED_KM = {
  temple: 0,
  indra: 1.8,
  agni: 3.1,
  yama: 4.9,
  niruthi: 6.4,
  varuna: 7.8,
  vayu: 9.5,
  kubera: 10.8,
  esanya: 12.6,
  close: 14,
};

/** Clockwise walking order, hill on the right. */
const ORDER = ["temple", "indra", "agni", "yama", "niruthi", "varuna", "vayu", "kubera", "esanya"];

/* ------------------------------------------------------------------- utils */

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function getJson(url, init, label) {
  let lastErr;
  for (let attempt = 0; attempt < 4; attempt++) {
    try {
      const res = await fetch(url, {
        ...init,
        headers: { "User-Agent": UA, Accept: "application/json", ...(init?.headers ?? {}) },
      });
      const text = await res.text();
      if (!res.ok) throw new Error(`HTTP ${res.status}: ${text.slice(0, 160)}`);
      return JSON.parse(text);
    } catch (err) {
      lastErr = err;
      console.warn(`  retry ${label} (${attempt + 1}/4): ${err.message}`);
      await sleep(2000 * (attempt + 1));
    }
  }
  throw new Error(`${label} failed: ${lastErr?.message}`);
}

async function overpass(query) {
  let lastErr;
  for (const endpoint of OVERPASS) {
    try {
      return await getJson(
        endpoint,
        {
          method: "POST",
          body: new URLSearchParams({ data: query }),
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
        },
        `overpass ${new URL(endpoint).host}`,
      );
    } catch (err) {
      lastErr = err;
    }
  }
  throw new Error(`all Overpass endpoints failed: ${lastErr?.message}`);
}

const R_EARTH_M = 6371008.8;
const rad = (d) => (d * Math.PI) / 180;

/** Great-circle metres between two [lat, lng] points. */
function haversine(a, b) {
  const dLat = rad(b[0] - a[0]);
  const dLng = rad(b[1] - a[1]);
  const s =
    Math.sin(dLat / 2) ** 2 + Math.cos(rad(a[0])) * Math.cos(rad(b[0])) * Math.sin(dLng / 2) ** 2;
  return 2 * R_EARTH_M * Math.asin(Math.sqrt(s));
}

/** Total metres along a [lat, lng][] line. */
const lineLength = (line) =>
  line.reduce((sum, p, i) => (i === 0 ? 0 : sum + haversine(line[i - 1], p)), 0);

/**
 * Splits a line at `targetM` from its start, returning the exact point and the
 * two halves. The split point is inserted into both halves so the drawn
 * segments stay joined with no visible gap.
 */
function splitAt(line, targetM) {
  let walked = 0;
  for (let i = 1; i < line.length; i++) {
    const step = haversine(line[i - 1], line[i]);
    if (walked + step >= targetM) {
      const f = step === 0 ? 0 : (targetM - walked) / step;
      const point = [
        line[i - 1][0] + (line[i][0] - line[i - 1][0]) * f,
        line[i - 1][1] + (line[i][1] - line[i - 1][1]) * f,
      ];
      return { point, before: [...line.slice(0, i), point], after: [point, ...line.slice(i)] };
    }
    walked += step;
  }
  const last = line[line.length - 1];
  return { point: last, before: [...line], after: [last] };
}

/** [lat, lng] rounded to ~1 cm, to keep the JSON small. */
const round = (p) => [Number(p[0].toFixed(6)), Number(p[1].toFixed(6))];

/**
 * Drops points that sit within `toleranceM` of the line between their
 * neighbours (Douglas–Peucker). Keeps the file small without visibly changing
 * the drawn road.
 */
function simplify(line, toleranceM = 2) {
  if (line.length < 3) return [...line];
  const perp = (p, a, b) => {
    // Flat-earth approximation is fine at this scale (a few km).
    const mPerDegLat = 111320;
    const mPerDegLng = 111320 * Math.cos(rad(a[0]));
    const toXY = (q) => [(q[1] - a[1]) * mPerDegLng, (q[0] - a[0]) * mPerDegLat];
    const [px, py] = toXY(p);
    const [bx, by] = toXY(b);
    const len2 = bx * bx + by * by;
    if (len2 === 0) return Math.hypot(px, py);
    const t = Math.max(0, Math.min(1, (px * bx + py * by) / len2));
    return Math.hypot(px - bx * t, py - by * t);
  };
  const keep = new Array(line.length).fill(false);
  keep[0] = keep[line.length - 1] = true;
  const stack = [[0, line.length - 1]];
  while (stack.length) {
    const [lo, hi] = stack.pop();
    let worst = -1;
    let worstAt = -1;
    for (let i = lo + 1; i < hi; i++) {
      const d = perp(line[i], line[lo], line[hi]);
      if (d > worst) {
        worst = d;
        worstAt = i;
      }
    }
    if (worst > toleranceM) {
      keep[worstAt] = true;
      stack.push([lo, worstAt], [worstAt, hi]);
    }
  }
  return line.filter((_, i) => keep[i]);
}

/* -------------------------------------------------------------------- fetch */

async function fetchShrines() {
  const body = OSM_TARGETS.map((t) => `${t.osmType}(${t.osmId});`).join("\n  ");
  const query = `[out:json][timeout:120];\n(\n  ${body}\n);\nout center tags;`;
  console.log("Reading shrine coordinates from OpenStreetMap…");
  const json = await overpass(query);

  const byId = new Map(json.elements.map((e) => [`${e.type}/${e.id}`, e]));
  return OSM_TARGETS.map((t) => {
    const el = byId.get(`${t.osmType}/${t.osmId}`);
    if (!el) throw new Error(`OSM ${t.osmType}/${t.osmId} (${t.expectName}) not found`);
    const lat = el.lat ?? el.center?.lat;
    const lng = el.lon ?? el.center?.lon;
    if (lat == null || lng == null) throw new Error(`OSM ${t.osmType}/${t.osmId} has no position`);
    const name = el.tags?.name ?? "";
    if (name !== t.expectName) {
      // A rename is not fatal, but it means the element should be re-checked.
      console.warn(`  ! ${t.id}: OSM name is now "${name}", expected "${t.expectName}"`);
    }
    console.log(`  ${t.id.padEnd(8)} ${lat}, ${lng}  ${name}`);
    return {
      id: t.id,
      position: [lat, lng],
      osm: `${t.osmType}/${t.osmId}`,
      osmName: name,
      osmNameTa: el.tags?.["name:ta"] ?? null,
      checkDate: el.tags?.check_date ?? null,
    };
  });
}

/** One OSRM foot leg, returned as a [lat, lng][] road-following line. */
async function routeLeg(from, to) {
  const coords = `${from.position[1]},${from.position[0]};${to.position[1]},${to.position[0]}`;
  const url = `${OSRM}/route/v1/foot/${coords}?overview=full&geometries=geojson&steps=true`;
  const json = await getJson(url, undefined, `osrm ${from.id}->${to.id}`);
  if (json.code !== "Ok") throw new Error(`OSRM ${from.id}->${to.id}: ${json.code}`);
  const route = json.routes[0];
  const roads = [
    ...new Set(route.legs.flatMap((l) => l.steps.map((s) => s.name).filter((n) => n && n !== ""))),
  ];
  return {
    line: route.geometry.coordinates.map(([lng, lat]) => [lat, lng]),
    distanceM: route.distance,
    roads,
  };
}

/* --------------------------------------------------------------------- main */

async function main() {
  const shrines = await fetchShrines();
  const byId = Object.fromEntries(shrines.map((s) => [s.id, s]));

  // Clockwise circuit through every shrine OSM actually has, temple to temple.
  const waypoints = ["temple", "indra", "yama", "niruthi", "varuna", "kubera", "temple"];

  console.log("\nRouting each leg over OSM roads (OSRM, foot profile)…");
  const legs = [];
  for (let i = 0; i < waypoints.length - 1; i++) {
    const from = byId[waypoints[i]];
    const to = byId[waypoints[i + 1]];
    const leg = await routeLeg(from, to);
    console.log(
      `  ${from.id} → ${to.id}: ${(leg.distanceM / 1000).toFixed(2)} km via ${leg.roads.slice(0, 3).join(", ") || "unnamed roads"}`,
    );
    legs.push({ fromId: from.id, toId: to.id, ...leg });
    await sleep(600); // be polite to the public demo server
  }

  // Cut the legs that contain an unsurveyed shrine into two.
  const stops = []; // { id, position, line-to-next }
  const allRoads = new Set();
  const pieces = [];

  for (const leg of legs) {
    leg.roads.forEach((r) => allRoads.add(r));
    const extra = UNVERIFIED.find((u) => u.afterId === leg.fromId && u.beforeId === leg.toId);
    if (!extra) {
      pieces.push({ fromId: leg.fromId, toId: leg.toId, line: leg.line });
      continue;
    }
    const startKm = PUBLISHED_KM[leg.fromId];
    const endKm = leg.toId === "temple" ? PUBLISHED_KM.close : PUBLISHED_KM[leg.toId];
    const fraction = (extra.publishedKm - startKm) / (endKm - startKm);
    const measured = lineLength(leg.line);
    const { point, before, after } = splitAt(leg.line, measured * fraction);
    console.log(
      `  ${extra.id}: placed at ${(fraction * 100).toFixed(0)}% of ${leg.fromId}→${leg.toId} ` +
        `→ ${point[0].toFixed(6)}, ${point[1].toFixed(6)} (APPROXIMATE — no OSM node)`,
    );
    byId[extra.id] = {
      id: extra.id,
      position: point,
      osm: null,
      osmName: null,
      osmNameTa: null,
      checkDate: null,
    };
    pieces.push({ fromId: leg.fromId, toId: extra.id, line: before });
    pieces.push({ fromId: extra.id, toId: leg.toId, line: after });
  }

  // Measure the real walk and stamp each stop with its distance from the start.
  let cumulativeM = 0;
  const segments = [];
  for (const piece of pieces) {
    const simplified = simplify(piece.line).map(round);
    const lengthM = lineLength(piece.line);
    segments.push({
      id: `${piece.fromId}-${piece.toId}`,
      fromId: piece.fromId,
      toId: piece.toId,
      fromKm: Number((cumulativeM / 1000).toFixed(3)),
      toKm: Number(((cumulativeM + lengthM) / 1000).toFixed(3)),
      lengthKm: Number((lengthM / 1000).toFixed(3)),
      coordinates: simplified.map(([lat, lng]) => [lng, lat]), // GeoJSON is lng,lat
    });
    cumulativeM += lengthM;
  }

  const measuredKmAt = {};
  let running = 0;
  for (const seg of segments) {
    measuredKmAt[seg.fromId] = Number((running / 1000).toFixed(2));
    running += seg.lengthKm * 1000;
  }

  const totalKm = Number((cumulativeM / 1000).toFixed(2));
  console.log(`\nTotal routed distance: ${totalKm} km (temple publishes 14 km)`);

  const stopFeatures = ORDER.map((id, i) => {
    const s = byId[id];
    const verified = Boolean(s.osm);
    return {
      type: "Feature",
      geometry: { type: "Point", coordinates: [round(s.position)[1], round(s.position)[0]] },
      properties: {
        id,
        order: i, // 0 = temple, 1..8 = the Ashta Lingams in walking order
        kind: id === "temple" ? "temple" : "lingam",
        verified,
        positionSource: verified
          ? `OpenStreetMap ${s.osm}`
          : "Approximate — interpolated along the routed line at the published distance; no surveyed coordinate exists",
        osm: s.osm,
        osmName: s.osmName,
        osmNameTa: s.osmNameTa,
        osmCheckDate: s.checkDate,
        measuredKm: measuredKmAt[id] ?? 0,
        publishedKm: PUBLISHED_KM[id] ?? null,
      },
    };
  });

  const segmentFeatures = segments.map((seg) => ({
    type: "Feature",
    geometry: { type: "LineString", coordinates: seg.coordinates },
    properties: {
      id: seg.id,
      fromId: seg.fromId,
      toId: seg.toId,
      fromKm: seg.fromKm,
      toKm: seg.toKm,
      lengthKm: seg.lengthKm,
    },
  }));

  const lats = segmentFeatures.flatMap((f) => f.geometry.coordinates.map((c) => c[1]));
  const lngs = segmentFeatures.flatMap((f) => f.geometry.coordinates.map((c) => c[0]));

  const collection = {
    type: "FeatureCollection",
    metadata: {
      title: "Girivalam — Arunachala circumambulation route",
      generatedAt: new Date().toISOString().slice(0, 10),
      generatedBy: "scripts/build-girivalam-route.mjs",
      totalRoutedKm: totalKm,
      publishedKm: 14,
      direction: "clockwise, hill kept on the right",
      verifiedStops: stopFeatures.filter((f) => f.properties.verified).map((f) => f.properties.id),
      unverifiedStops: stopFeatures
        .filter((f) => !f.properties.verified)
        .map((f) => f.properties.id),
      roadsUsed: [...allRoads].sort(),
      bbox: [
        Number(Math.min(...lngs).toFixed(6)),
        Number(Math.min(...lats).toFixed(6)),
        Number(Math.max(...lngs).toFixed(6)),
        Number(Math.max(...lats).toFixed(6)),
      ],
      sources: [
        {
          name: "OpenStreetMap",
          what: "Shrine and temple coordinates, and the road network the line is routed over",
          licence: "ODbL 1.0",
          url: "https://www.openstreetmap.org/copyright",
        },
        {
          name: "OSRM demo server (foot profile)",
          what: "Walking geometry between the surveyed shrines",
          url: "https://project-osrm.org/",
        },
      ],
      caveats: [
        "Agni, Vayu and Esanya Lingams have no surveyed coordinate in OpenStreetMap. Their markers are placed on the routed line at the distance the temple publishes and are flagged verified:false. Do not present them as surveyed positions.",
        `The routed distance is ${totalKm} km against the 14 km the temple publishes; the routed line follows the motor road, which runs slightly wide of the pilgrim footpath in places.`,
        "This file carries geometry only. It contains no crowd, facility or timing data.",
      ],
    },
    features: [...segmentFeatures, ...stopFeatures],
  };

  await mkdir(dirname(OUT), { recursive: true });
  await writeFile(OUT, JSON.stringify(collection, null, 2) + "\n", "utf8");
  console.log(`\nWrote ${OUT}`);
  console.log(`  ${segmentFeatures.length} route segments, ${stopFeatures.length} stops`);
  console.log(`  unverified: ${collection.metadata.unverifiedStops.join(", ")}`);
}

main().catch((err) => {
  console.error("\nFAILED:", err.message);
  process.exit(1);
});
