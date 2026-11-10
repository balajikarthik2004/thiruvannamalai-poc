export interface DailyPooja {
  id: string;
  time: string;
  name: string;
  tamilName: string;
  description: string;
  status: "completed" | "next" | "upcoming";
  image: string;
  featuredImage?: string;
  price: number;
}

export interface PoojaFestival {
  id: string;
  name: string;
  dateBadge: string;
  description: string;
  image: string;
  link?: string;
  fullDate: string;
}

export interface OfferingItem {
  id: string;
  name: string;
  tamilName: string;
  price: number;
  unit: string;
  description: string;
  category: "archana" | "prasadam" | "nithya";
  image?: string;
}

export const TIRUVANNAMALAI_DAILY_POOJAS: DailyPooja[] = [
  {
    id: "ushatkalam",
    time: "5:00 AM",
    name: "Ushatkalam Pooja",
    tamilName: "உஷத்கால பூஜை",
    description: "Early morning worship to the presiding deity.",
    status: "completed",
    image: "/pooja_thumb_ushakkalam_hd.jpg",
    price: 150,
  },
  {
    id: "kalasanthi",
    time: "6:00 AM",
    name: "Kala Santhi Pooja",
    tamilName: "கால சாந்தி பூஜை",
    description: "Morning pooja with Vedic chants and abhishekam.",
    status: "completed",
    image: "/pooja_thumb_kalasanthi_hd.jpg",
    price: 250,
  },
  {
    id: "uchikalam",
    time: "12:00 PM",
    name: "Uchikalam Pooja",
    tamilName: "உச்சிகால பூஜை",
    description: "Midday pooja performed as per Agama rituals.",
    status: "next",
    image: "/pooja_thumb_uchikalam_hd.jpg",
    featuredImage: "/pooja_uchikalam_lingam_hd.jpg",
    price: 300,
  },
  {
    id: "sayarakshai",
    time: "6:30 PM",
    name: "Sayarakshai Pooja",
    tamilName: "சாயரட்சை பூஜை",
    description: "Evening worship with deeparadhanai.",
    status: "upcoming",
    image: "/pooja_thumb_sayarakshai_hd.jpg",
    price: 200,
  },
  {
    id: "irandamkalam",
    time: "8:30 PM",
    name: "Irandam Kalam Pooja",
    tamilName: "இரண்டாம் கால பூஜை",
    description: "Night pooja with special alankaram.",
    status: "upcoming",
    image: "/pooja_thumb_irandamkalam_hd.jpg",
    price: 250,
  },
  {
    id: "arthajama",
    time: "8:30 PM",
    name: "Arthajama Pooja",
    tamilName: "அர்த்தஜாம பூஜை",
    description: "Final pooja of the day with temple closure rituals.",
    status: "upcoming",
    image: "/pooja_thumb_arthajama_hd.jpg",
    price: 350,
  },
];

export const UPCOMING_FESTIVALS: PoojaFestival[] = [
  {
    id: "karthigai-deepam",
    name: "Karthigai Deepam",
    dateBadge: "Nov 15 – Nov 24, 2026",
    description: "10-day grand festival with the sacred Maha Deepam.",
    image: "/pooja_fest_karthigai_hd.jpg",
    fullDate: "2026-11-24",
  },
  {
    id: "pournami-girivalam",
    name: "Pournami Girivalam",
    dateBadge: "Dec 15, 2026",
    description: "Special arrangements for full moon Girivalam.",
    image: "/pooja_fest_girivalam_hd.jpg",
    fullDate: "2026-12-15",
  },
  {
    id: "arudra-darshanam",
    name: "Arudra Darshanam",
    dateBadge: "Jan 9, 2027",
    description: "Special abhishekam and darshan of Nataraja.",
    image: "/pooja_fest_arudra_hd.jpg",
    fullDate: "2027-01-09",
  },
];

export const ARCHANA_OFFERINGS: OfferingItem[] = [
  {
    id: "sahasranama",
    name: "Sahasranama Archana",
    tamilName: "சகஸ்ரநாம அர்ச்சனை",
    price: 100,
    unit: "per family",
    description: "Recitation of 1,008 divine names of Lord Arunachaleswarar.",
    category: "archana",
    image: "/store/shiva/bilva-pack.jpg",
  },
  {
    id: "vilva",
    name: "Vilva Ashtothra Archana",
    tamilName: "வில்வ அஷ்டோத்ர அர்ச்சனை",
    price: 150,
    unit: "per sankalpam",
    description: "Sacred 108 Vilva leaves offering with holy chanting.",
    category: "archana",
    image: "/store/shiva/bilva-leaf.jpg",
  },
  {
    id: "deepam",
    name: "Ghee Deepam Offering",
    tamilName: "அகல் நெய் தீபம்",
    price: 50,
    unit: "per lamp",
    description: "Sacred earthen ghee lamp lit at the shrine.",
    category: "archana",
    image: "/store/diya.png",
  },
  {
    id: "trisathi",
    name: "Trisathi Archana (Unnamulai Amman)",
    tamilName: "திரிசதி அர்ச்சனை",
    price: 200,
    unit: "per family",
    description: "300 sacred name chanting at the Goddess shrine with kumkum.",
    category: "archana",
    image: "/store/kumkum.png",
  },
];

export const PRASADAM_OFFERINGS: OfferingItem[] = [
  {
    id: "laddu-box",
    name: "Temple Laddu Box (4 pcs)",
    tamilName: "லட்டு பிரசாதம்",
    price: 50,
    unit: "per box",
    description: "Traditional pure ghee laddu prepared at the temple madapalli.",
    category: "prasadam",
  },
  {
    id: "puliyodharai",
    name: "Tamarind Rice (Puliyodharai)",
    tamilName: "புளியோதரை பிரசாதம்",
    price: 40,
    unit: "per pack",
    description: "Classic temple consecrated tamarind rice offering.",
    category: "prasadam",
  },
  {
    id: "pongal",
    name: "Sakkarai Pongal",
    tamilName: "சர்க்கரை பொங்கல்",
    price: 40,
    unit: "per pack",
    description: "Sweet jaggery and ghee rice offering with cashews and cardamom.",
    category: "prasadam",
  },
  {
    id: "panchamirtham",
    name: "Special Panchamirtham Jar",
    tamilName: "பஞ்சாமிர்தம் ஜாடி",
    price: 80,
    unit: "250g jar",
    description: "Traditional five-nectar consecrated sweet offering.",
    category: "prasadam",
    image: "/store/Panchamirtham.png",
  },
];

export const NITHYA_SEVA_OFFERINGS: OfferingItem[] = [
  {
    id: "nithya-deepa",
    name: "Nithya Deepa Seva (Monthly)",
    tamilName: "நித்திய தீப சேவை",
    price: 500,
    unit: "per month",
    description: "Daily ghee lamp lit in your family's name for 30 days.",
    category: "nithya",
    image: "/store/diya.png",
  },
  {
    id: "annadhanam-monthly",
    name: "Monthly Annadhanam Contribution",
    tamilName: "மாதாந்திர அன்னதானம்",
    price: 1000,
    unit: "per month",
    description: "Feeds 20 sadhus and devotees at the temple annadhanam hall.",
    category: "nithya",
  },
  {
    id: "nithya-annual",
    name: "Annual Birthday / Anniversary Pooja",
    tamilName: "வருடாந்திர சிறப்பு பூஜை",
    price: 2500,
    unit: "annual",
    description: "Special abhishekam and archana performed on your chosen date with prasadam posted.",
    category: "nithya",
    image: "/store/shiva/framed-annamalaiyar.jpg",
  },
];
