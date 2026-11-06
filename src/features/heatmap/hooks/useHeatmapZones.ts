import { useTranslation } from "react-i18next";
import palaniImg from "@/assets/palani5.png";
import meenakshiImg  from "@/assets/Madurai.png";
import srirangamImg from "@/assets/Srirangam.png";
import arunachaleswararImg from "@/assets/Arunachaleswarar.png";
import rameswaramImg from "@/assets/Rameswaram.png";

export function useHeatmapZones(t: any) {
  const { t: tStr } = useTranslation();

  const genericZones = [
    { name: tStr("Main Entrance"), pct: t.parking.lotA, x: 40, y: 80, w: 120, h: 50, advice: tStr("Use East Gate instead") },
    { name: tStr("Queue Lane A"), pct: Math.min(95, t.crowdPct + 15), x: 40, y: 140, w: 60, h: 100, advice: tStr("Wait 30 min or visit after 4 PM") },
    { name: tStr("Queue Lane B"), pct: Math.max(20, t.crowdPct - 20), x: 105, y: 140, w: 55, h: 100, advice: tStr("Faster lane today") },
    { name: tStr("Sanctum approach"), pct: t.crowdPct, x: 170, y: 100, w: 90, h: 80, advice: tStr("~15-20 min wait") },
    { name: tStr("Prasad counter"), pct: Math.max(15, t.crowdPct - 30), x: 270, y: 80, w: 80, h: 60, advice: tStr("Light queue") },
    { name: tStr("Parking Lot A"), pct: t.parking.lotA, x: 270, y: 150, w: 80, h: 70, advice: tStr("Almost full — use overflow") },
  ];

  const palaniZones = [
    { name: tStr("Sanctum Sanctorum"), pct: Math.min(95, t.crowdPct + 25), advice: tStr("Peak crowd right now. Expected wait ~45 mins.") },
    { name: tStr("Steps Route"), pct: Math.min(85, t.crowdPct + 15), advice: tStr("Heavy footfall. Use Rope Car or Winch if possible.") },
    { name: tStr("Rope Car Station"), pct: Math.max(20, t.crowdPct - 10), advice: tStr("Moderate queue. ~20 mins wait.") },
    { name: tStr("Winch Station"), pct: Math.max(15, t.crowdPct - 25), advice: tStr("Moving fast. Good alternative to steps.") },
    { name: tStr("Panchamirtham Counter"), pct: Math.max(10, t.crowdPct - 35), advice: tStr("Clear. Get your prasadam quickly.") },
    { name: tStr("Base Parking Area"), pct: t.parking.lotA, advice: tStr("Almost full. Consider overflow parking.") },
  ];

  const maduraiZones = [
    { name: tStr("Amman Sannithi"), pct: Math.min(98, t.crowdPct + 25), advice: tStr("Highest crowd density. Free darshan wait is ~60m.") },
    { name: tStr("Swami Sannithi"), pct: Math.min(85, t.crowdPct + 10), advice: tStr("Moderate to high queue. Try special ticket lane.") },
    { name: tStr("Golden Lotus Tank"), pct: Math.max(40, t.crowdPct - 20), advice: tStr("Beautiful and relatively clear. Great for resting.") },
    { name: tStr("Thousand Pillar Hall"), pct: Math.max(30, t.crowdPct - 30), advice: tStr("Low crowd. Excellent time to visit the museum.") },
    { name: tStr("South Tower Entrance"), pct: Math.max(25, t.crowdPct - 40), advice: tStr("Fastest entry point right now. Use this gate.") },
    { name: tStr("Chithirai Streets (Outer)"), pct: t.parking.lotB, advice: tStr("Traffic is heavy. Park at the multistory lot.") },
  ];

  const srirangamZones = [
    { name: tStr("Rajagopuram Entrance"), pct: t.parking.lotA, advice: tStr("Main entry point. Busy but moving steadily.") },
    { name: tStr("Ranga Ranga Gopuram"), pct: Math.min(80, t.crowdPct + 10), advice: tStr("High footfall. Stay in your designated lanes.") },
    { name: tStr("Garuda Mandapam"), pct: Math.min(95, t.crowdPct + 20), advice: tStr("Heavy crowd merging here. Expect delays.") },
    { name: tStr("Sanctum Sanctorum"), pct: Math.min(100, t.crowdPct + 35), advice: tStr("Peak wait time. General queue is ~75m.") },
    { name: tStr("Thayar Sannithi"), pct: Math.max(30, t.crowdPct - 15), advice: tStr("Relatively clear. Good time to visit.") },
    { name: tStr("Chithirai Streets (Parking)"), pct: t.parking.lotB, advice: tStr("Parking filling up quickly. Use North Gate parking.") },
  ];

  // `kind` separates gates from key places in the gate-wise table and insights.
  const tiruvannamalaiZones = [
    { id: "east", kind: "gate", name: tStr("East Rajagopuram (Main)"), pct: Math.min(98, t.crowdPct - 3), advice: tStr("11-storey main gateway — heaviest crowd. Enter via Thirumanjana Gopuram (South) if possible.") },
    { id: "inner", kind: "gate", name: tStr("Vallala & Kili Gopuram (Inner)"), pct: Math.max(30, t.crowdPct - 50), advice: tStr("Queues merge here before the sanctum.") },
    { id: "sanctum", kind: "place", name: tStr("Arunachaleswarar Sannithi"), pct: Math.min(100, t.crowdPct + 12), advice: tStr("Peak density. Free darshan wait can exceed 1.5 hrs.") },
    { id: "amman", kind: "place", name: tStr("Unnamulai Amman Sannithi"), pct: Math.max(40, t.crowdPct - 30), advice: tStr("Moves faster than the main sanctum.") },
    { id: "south", kind: "gate", name: tStr("Thirumanjana Gopuram (South)"), pct: Math.max(35, t.crowdPct - 25), advice: tStr("Quieter entry. Convenient for elders.") },
    { id: "west", kind: "gate", name: tStr("Pei Gopuram (West)"), pct: Math.max(30, t.crowdPct - 40), advice: tStr("Faces Arunachala. Busy with devotees returning from Girivalam.") },
    { id: "north", kind: "gate", name: tStr("Ammani Ammal Gopuram (North)"), pct: Math.max(30, t.crowdPct - 46), advice: tStr("Near the car shed and parking access.") },
    { id: "mandapam", kind: "place", name: tStr("Thousand Pillar Mandapam & Pathala Lingam"), pct: Math.max(20, t.crowdPct - 55), advice: tStr("Relatively quiet. Good spot to sit and meditate.") },
    { id: "girivalam", kind: "place", name: tStr("Girivalam Path (14 km)"), pct: Math.max(30, t.crowdPct - 35), advice: tStr("Steady flow. Expect a surge on Pournami nights.") },
  ];

  const rameswaramZones = [
    { name: tStr("Agni Theertham"), pct: Math.min(95, t.crowdPct + 25), advice: tStr("Heavy crowd at the beach. Complete holy dip early.") },
    { name: tStr("22 Holy Wells (Theerthams)"), pct: Math.min(100, t.crowdPct + 35), advice: tStr("Peak density. Expect significant delays moving between wells.") },
    { name: tStr("Ramanathaswamy Sannithi"), pct: Math.min(90, t.crowdPct + 20), advice: tStr("High wait time. Keep moving in the queue.") },
    { name: tStr("Parvathavardhini Amman"), pct: Math.max(60, t.crowdPct - 10), advice: tStr("Moderate crowd. Darshan is relatively quicker here.") },
    { name: tStr("Third Corridor (Prakaram)"), pct: Math.max(40, t.crowdPct - 25), advice: tStr("Famous long corridor is somewhat clear for walking.") },
    { name: tStr("East Gate Parking"), pct: t.parking.lotA, advice: tStr("Almost full. Proceed to West Gate parking lot.") },
  ];

  const displayZones = t.id === 1 ? palaniZones : (t.id === 2 ? maduraiZones : (t.id === 3 ? srirangamZones : (t.id === 4 ? tiruvannamalaiZones : (t.id === 5 ? rameswaramZones : genericZones))));

  const getMapImage = (id: number) => {
    switch (id) {
      case 1: return palaniImg;
      case 2: return meenakshiImg;
      case 3: return srirangamImg;
      case 4: return arunachaleswararImg;
      case 5: return rameswaramImg;
      default: return null;
    }
  };

  return { displayZones, mapImage: getMapImage(t.id), genericZones };
}
