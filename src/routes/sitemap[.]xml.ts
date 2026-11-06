import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { temples } from "@/data/temples";

const BASE_URL = "";
const staticPaths = ["/", "/search", "/plan", "/chat", "/heatmap", "/poojas", "/nearby", "/notifications", "/profile"];

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const all = [
          ...staticPaths.map(p => ({ path: p })),
          ...temples.map(t => ({ path: `/temple/${t.slug}` })),
        ];
        const xml = [
          `<?xml version="1.0" encoding="UTF-8"?>`,
          `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
          ...all.map(e => `  <url><loc>${BASE_URL}${e.path}</loc></url>`),
          `</urlset>`,
        ].join("\n");
        return new Response(xml, { headers: { "Content-Type": "application/xml" } });
      },
    },
  },
});
