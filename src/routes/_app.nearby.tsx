import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { temples } from "@/data/temples";

export const Route = createFileRoute("/_app/nearby")({
  head: () => ({ meta: [{ title: "Nearby & Navigate — OMG Smart Temple" }] }),
  component: NearbyPage,
});

function NearbyPage() {
  const [sel, setSel] = useState(temples[0].id);
  const t = temples.find(x => x.id === sel)!;

  return (
    <div className="max-w-3xl mx-auto px-4 lg:px-8 pt-6 pb-10">
      <h1 className="font-serif text-4xl font-semibold">Plan your journey</h1>
      <p className="text-muted-foreground text-base mt-1">Travel options, parking and nearby essentials.</p>

      <div className="mt-5 bg-card border border-border rounded-2xl p-5 card-soft">
        <div className="text-base text-muted-foreground">Destination temple</div>
        <select value={sel} onChange={e => setSel(Number(e.target.value))} className="mt-2 w-full bg-white border border-border rounded-xl px-4 py-3">
          {temples.map(x => <option key={x.id} value={x.id}>{x.name}</option>)}
        </select>

        <div className="mt-5 grid grid-cols-3 gap-3 text-center">
          <Stat label="Distance" value="486 km" />
          <Stat label="By car" value="7h 30m" />
          <Stat label="By train" value="6h 45m" />
        </div>

        <div className="mt-5 space-y-2 text-base">
          {[
            ["🚗 Car","7h 30min · NH 38"],
            ["🚌 Bus","8h · TNSTC daily services"],
            ["🚂 Train","6h 45min · station 2 km from temple"],
            ["✈ Fly + Car","Coimbatore + 1h 20m"],
          ].map(([a,b]) => (
            <div key={a} className="flex items-center justify-between bg-secondary rounded-xl p-3">
              <span className="font-medium">{a}</span>
              <span className="text-muted-foreground">{b}</span>
            </div>
          ))}
        </div>

        <button className="mt-5 w-full rounded-full gradient-saffron text-white py-3 font-medium">🗺 Get directions</button>
      </div>

      <div className="mt-6">
        <div className="font-serif text-xl font-semibold mb-3">Nearby essentials in {t.city}</div>
        <div className="grid sm:grid-cols-2 gap-3">
          {[
            ["🏨 Choultries & Hotels","3 nearby","0.3 km"],
            ["🌿 Flower shops","5 nearby","0.1 km"],
            ["🍽 Veg restaurants","8 nearby","0.4 km"],
            ["🏧 ATMs","4 nearby","0.2 km"],
            ["🏥 Hospital","2 nearby","1.1 km"],
            ["🅿 Parking","3 lots","On-site"],
          ].map(([t, c, d]) => (
            <div key={t} className="bg-card border border-border rounded-2xl p-4 card-soft">
              <div className="font-medium">{t}</div>
              <div className="text-sm text-muted-foreground">{c} · {d}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value }: any) {
  return <div className="bg-secondary rounded-xl p-3"><div className="font-serif font-semibold">{value}</div><div className="text-[11px] text-muted-foreground">{label}</div></div>;
}
