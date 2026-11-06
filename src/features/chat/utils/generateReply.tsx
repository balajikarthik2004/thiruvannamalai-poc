import { Link } from "@tanstack/react-router";
import { temples } from "@/data/temples";
import { CrowdBadge } from "@/components/shared/CrowdBadge";
import { Msg } from "../types";

export function generateReply(q: string, tStr: any): Msg {
  const lower = q.toLowerCase();
  const tvmAliases = ["thiruvannamalai", "tiruvannamalai", "annamalai", "arunachala", "arunachaleswar", "girivalam", "deepam"];
  const t = tvmAliases.some(a => lower.includes(a))
    ? temples.find(x => x.slug === "tiruvannamalai")
    : temples.find(x => lower.includes(x.name.split(" ")[0].toLowerCase()) || lower.includes(x.slug.split("-")[0]));

  if (lower.includes("deepam") || lower.includes("karthigai") || lower.includes("kartigai")) {
    return {
      role: "ai",
      text: `🪔 ${tStr("Karthigai Deepam 2026 at Tiruvannamalai (per published calendars — confirm with the temple):")}
• ${tStr("Flag hoisting: Sun, Nov 15")}
• ${tStr("Maha Ratham (chariot): Sat, Nov 21")}
• ${tStr("Bharani Deepam: Tue, Nov 24 · 4:00 AM in the temple")}
• ${tStr("Maha Deepam: Tue, Nov 24 · 6:00 PM on the Arunachala summit")}

${tStr("Lakhs of devotees attend — book stays early and plan to arrive the day before.")}`
    };
  }

  if (lower.includes("girivalam") || lower.includes("pournami") || lower.includes("full moon")) {
    return {
      role: "ai",
      text: `⛰️ ${tStr("Girivalam is the 14 km barefoot walk around Arunachala, done on every Pournami (full moon). Devotees pass eight Ashta Lingams clockwise: Indra, Agni, Yama, Niruthi, Varuna, Vayu, Kubera and Esanya.")}

${tStr("An ordinary Pournami draws several lakh devotees; Chitra Pournami and Karthigai Deepam draw 20 lakh+. Start early, carry water, and allow 4–6 hours (much longer on peak days).")}`
    };
  }

  if (lower.includes("least crowd") || lower.includes("which temple")) {
    const sorted = [...temples].sort((a,b) => a.crowdPct - b.crowdPct).slice(0,3);
    return {
      role: "ai",
      text: "🙏 " + tStr("Here are the temples with the least crowd right now:"),
      card: <div className="mt-3 space-y-2">{sorted.map(t => (
        <Link key={t.id} to="/temple/$slug" params={{ slug: t.slug }} className="flex items-center gap-2 p-2 bg-white rounded-xl border border-border">
          <div className="w-10 h-10 rounded-full flex items-center justify-center text-white shrink-0 shadow-sm bg-cover bg-center overflow-hidden border border-border/50 relative" style={{ backgroundImage: `url(${t.image})`, backgroundColor: t.color }}>
            {!t.image && <span className="font-serif text-base drop-shadow-md">ॐ</span>}
          </div>
          <div className="flex-1 min-w-0"><div className="font-serif text-base font-semibold truncate">{tStr(t.name)}</div><div className="text-sm text-muted-foreground">{tStr(t.district)} · {t.waitMin}m {tStr("wait")}</div></div>
          <CrowdBadge status={t.crowdStatus} />
        </Link>
      ))}</div>
    };
  }

  if (t && (lower.includes("crowd") || lower.includes("status") || lower.includes("wait"))) {
    return {
      role: "ai",
      text: `🙏 ${tStr("Here's the live status for")} ${tStr(t.name)}:`,
      card: (
        <div className="mt-3 bg-white rounded-xl border border-border p-3 space-y-1.5">
          <div className="font-serif font-semibold text-base">{tStr(t.name)}</div>
          <div className="flex items-center gap-2 text-base"><CrowdBadge status={t.crowdStatus} /> {tStr("right now")}</div>
          <div className="text-base">⏱ {tStr("Wait:")} {t.waitMin} min</div>
          <div className="text-base text-saffron">🤖 {tStr("Best time: 3 – 5 PM")}</div>
          <Link to="/temple/$slug" params={{ slug: t.slug }} className="text-base text-saffron font-medium">{tStr("View temple details →")}</Link>
        </div>
      )
    };
  }

  if (t && (lower.includes("time") || lower.includes("best") || lower.includes("when"))) {
    return {
      role: "ai",
      text: `🕉 ${tStr("Best times to visit")} ${tStr(t.name)} ${tStr("today:")}\n🌅 ${tStr("Early morning 6:00–7:30 AM — Very peaceful")}\n🌇 ${tStr("Afternoon 3:00–5:30 PM — Recommended ⭐")}\n🌙 ${tStr("Evening 7:00–8:30 PM — Moderate crowd")}\n\n${tStr("Avoid 9:00–11:30 AM.")} ${tStr("It's a")} ${t.specialDay} ${tStr("special day — early morning will be extra auspicious. 🙏")}`
    };
  }

  if (t && lower.includes("parking")) {
    return {
      role: "ai",
      text: `🚗 ${tStr("Parking at")} ${tStr(t.name)}:\n• ${tStr("Lot A:")} ${t.parking.lotA}% full\n• ${tStr("Lot B:")} ${t.parking.lotB}% full\n• ${tStr("Overflow:")} ${t.parking.overflow}% — ${tStr("available")}\n\n${tStr("Tip: Park at Lot B or the overflow lot after 3 PM.")}`
    };
  }

  if (t && (lower.includes("pooja") || lower.includes("timing") || lower.includes("schedule"))) {
    return {
      role: "ai",
      text: `🪔 ${tStr("Today's pooja schedule for")} ${tStr(t.name)}:`,
      card: <div className="mt-3 bg-white rounded-xl border border-border p-3 space-y-1 text-base">{t.poojas.map(p => <div key={p} className="flex justify-between border-b border-border last:border-0 py-1"><span>{tStr(p.split(" ").slice(2).join(" "))}</span><span className="text-muted-foreground">{p.split(" ").slice(0,2).join(" ")}</span></div>)}</div>
    };
  }

  if (lower.includes("murugan")) {
    const m = temples.filter(t => t.deity.toLowerCase().includes("murugan"));
    return {
      role: "ai",
      text: "🕉 " + tStr("Murugan temples I track across Tamil Nadu:"),
      card: <div className="mt-3 space-y-2">{m.map(t => (
        <Link key={t.id} to="/temple/$slug" params={{ slug: t.slug }} className="flex items-center gap-2 p-2 bg-white rounded-xl border border-border">
          <div className="w-10 h-10 rounded-full flex items-center justify-center text-white shrink-0 shadow-sm bg-cover bg-center overflow-hidden border border-border/50 relative" style={{ backgroundImage: `url(${t.image})`, backgroundColor: t.color }}>
            {!t.image && <span className="font-serif text-base drop-shadow-md">ॐ</span>}
          </div>
          <div className="flex-1 min-w-0"><div className="font-serif text-base font-semibold truncate">{tStr(t.name)}</div><div className="text-sm text-muted-foreground">{tStr(t.district)}</div></div>
          <CrowdBadge status={t.crowdStatus} />
        </Link>
      ))}</div>
    };
  }

  return { role: "ai", text: "🙏 " + tStr("I can help with live crowd status, best times to visit, parking, pooja timings, and temple recommendations across Tamil Nadu. Try asking about a specific temple like Tiruvannamalai, Meenakshi, or Srirangam — or about Girivalam and Karthigai Deepam.") };
}
