// Thiruvannamalai (Arulmigu Arunachaleswarar / Annamalaiyar Temple) reference content.
// Facts cross-checked against Wikipedia ("Arunachalesvara Temple") and news coverage, Nov 2026.

export const TIRUVANNAMALAI_SLUG = "tiruvannamalai";

export const tiruvannamalaiFacts = [
  { label: "Element", value: "Agni (Fire) — Pancha Bhoota Sthalam" },
  { label: "Temple area", value: "25 acres · 5 precincts" },
  { label: "East Rajagopuram", value: "66 m (217 ft) · 11 storeys" },
  { label: "Arunachala hill", value: "2,668 ft" },
  { label: "Girivalam", value: "14 km barefoot circuit" },
  { label: "Administration", value: "Tamil Nadu HR&CE (since 1951)" },
];

// The eight Ashta Lingams visited clockwise on Girivalam.
export const ashtaLingams = [
  { name: "Indra Lingam", direction: "East" },
  { name: "Agni Lingam", direction: "South-East" },
  { name: "Yama Lingam", direction: "South" },
  { name: "Niruthi Lingam", direction: "South-West" },
  { name: "Varuna Lingam", direction: "West" },
  { name: "Vayu Lingam", direction: "North-West" },
  { name: "Kubera Lingam", direction: "North" },
  { name: "Esanya Lingam", direction: "North-East" },
];

export interface CreditedImage {
  src: string;
  caption: string;
  author: string;
  license: string;
  sourceUrl: string;
}

// All images are from Wikimedia Commons and require attribution (CC BY / CC BY-SA).
export const tiruvannamalaiGallery: CreditedImage[] = [
  {
    src: "/temples/tiruvannamalai/panorama.jpg",
    caption: "Annamalaiyar Temple seen from Arunachala hill",
    author: "Vyacheslav Argenberg",
    license: "CC BY 4.0",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Thiruvannamalai,_Arunachalesvara_Temple,_Annamalaiyar_Temple,_Panoramic_view,_India.jpg",
  },
  {
    src: "/temples/tiruvannamalai/rajagopuram.jpg",
    caption: "East Rajagopuram",
    author: "Common man 00",
    license: "CC BY-SA 4.0",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Annamalaiyar_Rajagopuram.jpg",
  },
  {
    src: "/temples/tiruvannamalai/temple-hill.jpg",
    caption: "Gopurams beneath Arunachala hill",
    author: "Ssriram mt",
    license: "CC BY-SA 4.0",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Annamalaiyar_Temple_(15).jpg",
  },
  {
    src: "/temples/tiruvannamalai/gopuram-sky.jpg",
    caption: "Gopuram and temple tank",
    author: "Ssriram mt",
    license: "CC BY-SA 4.0",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Annamalaiyar_Temple_(1).jpg",
  },
  {
    src: "/temples/tiruvannamalai/tower.jpg",
    caption: "Gopuram above the temple tank",
    author: "Vyacheslav Argenberg",
    license: "CC BY 4.0",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Thiruvannamalai,_Arunachalesvara_Temple,_Tower,_India.jpg",
  },
  {
    src: "/temples/tiruvannamalai/night.jpg",
    caption: "Temple at night",
    author: "Vyacheslav Argenberg",
    license: "CC BY 4.0",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Thiruvannamalai,_Arunachalesvara_Temple,_Night,_India.jpg",
  },
  {
    src: "/temples/tiruvannamalai/maha-deepam.jpg",
    caption: "Maha Deepam on the summit of Arunachala",
    author: "Vinoth Chandar",
    license: "CC BY 2.0",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Thiruvannamalai_Maha_Karthigai_Deepam_(5200919082).jpg",
  },
  {
    src: "/temples/tiruvannamalai/deepam-cauldron-summit.jpg",
    caption: "Maha Deepam cauldron on the hilltop",
    author: "Accesscrawl",
    license: "CC BY-SA 4.0",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Karthikai_Deepam_at_Mt._Arunachala.jpg",
  },
  {
    src: "/temples/tiruvannamalai/kopparai.jpg",
    caption: "Kopparai — the Deepam cauldron in the temple",
    author: "MAHEDRAN S",
    license: "CC BY-SA 4.0",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Kopparai_of_Tiruvannamalai_Deepam.jpg",
  },
  {
    src: "/temples/tiruvannamalai/procession.jpg",
    caption: "Deepam festival procession",
    author: "Prajnaana",
    license: "CC BY-SA 4.0",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Tiruvannamalai_Temple_Procession.jpg",
  },
  {
    src: "/temples/tiruvannamalai/gopurams-from-hill.jpg",
    caption: "The four gopurams from the hill",
    author: "Shravan Kamath94",
    license: "CC BY-SA 4.0",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Tiruvannamalai_gopuram.jpg",
  },
  {
    src: "/temples/tiruvannamalai/girivalam.jpg",
    caption: "Arunachala from the Vayu Lingam area on Girivalam",
    author: "Adityamadhav83",
    license: "CC BY 4.0",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:View_of_Arunachala_hill_from_Vayu_Lingam_temple_area.jpg",
  },
  {
    src: "/temples/tiruvannamalai/arunachala-hill.jpg",
    caption: "Slopes of Arunachala hill",
    author: "Vyacheslav Argenberg",
    license: "CC BY 4.0",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Tiruvannamalai,_Arunachala_Hill,_Annamalai_Hill,_Slopes,_India.jpg",
  },
];
