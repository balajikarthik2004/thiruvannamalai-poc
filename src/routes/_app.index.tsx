import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { temples } from "@/data/temples";

import { DashboardTopNav } from "@/features/dashboard/components/DashboardTopNav";
import { DashboardHeader } from "@/features/dashboard/components/DashboardHeader";
import { DevoteeEssentials } from "@/features/dashboard/components/DevoteeEssentials";
import { LiveTempleFeed } from "@/features/dashboard/components/LiveTempleFeed";

export const Route = createFileRoute("/_app/")({
  head: () => ({
    meta: [
      { title: "OMG Smart Temple — Devotee Dashboard" },
      { name: "description", content: "Your personalized dashboard for Tamil Nadu temples." },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const { t } = useTranslation();
  const [q, setQ] = useState("");
  const [state, setState] = useState<string>("");
  const [district, setDistrict] = useState<string>("");
  const [activeFilter, setActiveFilter] = useState<string>("All");
  
  const [stateOpen, setStateOpen] = useState(false);
  const [districtOpen, setDistrictOpen] = useState(false);
  const [templeOpen, setTempleOpen] = useState(false);
  // 0 = "no explicit choice yet", which falls through to temples[0] —
  // Tiruvannamalai Arunachaleswarar, the temple this build is focused on.
  const [activeTempleId, setActiveTempleId] = useState(0);

  const activeTemple = useMemo(
    () => temples.find((t) => t.id === activeTempleId) || temples[0],
    [activeTempleId]
  );

  const results = useMemo(() => {
    const v = q.toLowerCase().trim();
    const filtered = temples.filter(t => {
      if (state && t.state !== state) return false;
      if (district && t.district !== district) return false;
      if (activeFilter === "Low Crowd" && t.crowdStatus !== "LOW") return false;
      else if (activeFilter !== "All" && activeFilter !== "Open Now" && !t.deity.includes(activeFilter)) return false;
      if (!v) return true;
      return t.name.toLowerCase().includes(v) || t.district.toLowerCase().includes(v) || t.deity.toLowerCase().includes(v);
    });
    // Pin Dallas Mariamman first
    return filtered.sort((a, b) =>
      a.slug === "dallas-arulmigu-mariamman-usa" ? -1 : b.slug === "dallas-arulmigu-mariamman-usa" ? 1 : 0
    );
  }, [q, state, district, activeFilter]);

  return (
    <div className="flex flex-col min-h-screen bg-[#fdf8f6] pb-10">
      <DashboardTopNav 
        state={state} setState={setState}
        stateOpen={stateOpen} setStateOpen={setStateOpen}
        district={district} setDistrict={setDistrict}
        districtOpen={districtOpen} setDistrictOpen={setDistrictOpen}
        activeTempleId={activeTempleId} setActiveTempleId={setActiveTempleId}
        templeOpen={templeOpen} setTempleOpen={setTempleOpen}
        activeTemple={activeTemple}
      />

      <DashboardHeader activeTemple={activeTemple} />

      <div className="max-w-7xl mx-auto px-4 lg:px-6 py-6 space-y-8 w-full">
        {(district === "" && activeFilter === "All") && (
          <DevoteeEssentials activeTemple={activeTemple} />
        )}
        <LiveTempleFeed results={results} q={q} setQ={setQ} activeTemple={activeTemple} />
      </div>
    </div>
  );
}
