export function getTransportInfo(origin: string, dest: string, tStr: any) {
  const o = (origin || "").toLowerCase();

  const internationalKeywords = ["us", "usa", "united states", "new york", "california", "london", "uk", "dubai", "singapore", "malaysia", "australia", "canada"];
  const isIntl = internationalKeywords.some(k => o === k || o.includes(` ${k}`) || o.includes(`${k} `) || o.includes(`,${k}`) || o.includes(`, ${k}`));

  if (isIntl) {
    const getDestAirport = (d: string) => {
      switch (d) {
        case "palani-murugan": return "Coimbatore (CJB)";
        case "madurai-meenakshi": return "Madurai (IXM)";
        case "srirangam": return "Tiruchirappalli (TRZ)";
        case "chidambaram-natarajar": return "Chennai (MAA)";
        case "tiruchendur-murugan": return "Tuticorin (TCR)";
        case "rameswaram": return "Madurai (IXM)";
        case "kapaleeshwarar": return "Chennai (MAA)";
        case "brihadeeswarar": return "Tiruchirappalli (TRZ)";
        case "tiruvannamalai": return "Chennai (MAA)";
        default: return "Chennai (MAA)";
      }
    };
    
    const destAirport = getDestAirport(dest);

    const getAirportCab = (d: string) => {
      switch (d) {
        case "palani-murugan": return { route: "Coimbatore (CJB) to Palani", time: "2h 30m", price: "Rs. 2,500 - 3,000", distance: "110 km" };
        case "madurai-meenakshi": return { route: "Madurai (IXM) to Temple", time: "45m", price: "Rs. 800 - 1,000", distance: "15 km" };
        case "srirangam": return { route: "Trichy (TRZ) to Srirangam", time: "30m", price: "Rs. 600 - 800", distance: "12 km" };
        case "chidambaram-natarajar": return { route: "Chennai (MAA) to Chidambaram", time: "4h 30m", price: "Rs. 4,500 - 5,000", distance: "210 km" };
        case "tiruchendur-murugan": return { route: "Tuticorin (TCR) to Tiruchendur", time: "1h 00m", price: "Rs. 1,000 - 1,200", distance: "40 km" };
        case "rameswaram": return { route: "Madurai (IXM) to Rameswaram", time: "3h 30m", price: "Rs. 3,500 - 4,000", distance: "180 km" };
        case "kapaleeshwarar": return { route: "Chennai (MAA) to Mylapore", time: "40m", price: "Rs. 400 - 600", distance: "16 km" };
        case "brihadeeswarar": return { route: "Trichy (TRZ) to Thanjavur", time: "1h 15m", price: "Rs. 1,500 - 1,800", distance: "60 km" };
        case "tiruvannamalai": return { route: "Chennai (MAA) to Tiruvannamalai", time: "3h 45m", price: "Rs. 3,500 - 4,500", distance: "170 km" };
        default: return { route: "Nearest Airport to Temple", time: "1h 30m", price: "Rs. 1,500", distance: "60 km" };
      }
    };

    const originName = o.split(',')[0].trim();
    const formattedOrigin = originName.charAt(0).toUpperCase() + originName.slice(1);
    const destCity = destAirport.split(' ')[0];

    return {
      isInternational: true,
      roadTime: "18h+",
      route: `International flight to ${destAirport}`,
      flights: [
        { airline: "Emirates", code: "EK", route: [formattedOrigin, "Dubai", destCity], layover: "2h - 4h", duration: "21h 30m" },
        { airline: "Qatar Airways", code: "QR", route: [formattedOrigin, "Doha", destCity], layover: "1h 45m", duration: "20h 45m" },
        { airline: "Air India", code: "AI", route: [formattedOrigin, "New Delhi", destCity], layover: "3h - 5h", duration: "24h 00m" },
        { airline: "Etihad Airways", code: "EY", route: [formattedOrigin, "Abu Dhabi", destCity], layover: "2h 30m", duration: "22h 15m" }
      ],
      buses: [],
      trains: [],
      airportCab: getAirportCab(dest)
    };
  }

  // Road/bus guidance only — train numbers intentionally omitted (few direct trains; check IRCTC).
  if (dest === "tiruvannamalai") {
    if (o.includes("chennai") || o.includes("madras") || o.includes("maa")) return {
      isInternational: false,
      roadTime: "4h 30m", route: "GST Road (NH 32) to Tindivanam, then NH 77 via Gingee (~195 km)",
      buses: [
        { name: "TNSTC / SETC (Kilambakkam bus terminus)", time: "Frequent, round the clock", price: "Duration: ~5h 00m" },
        { name: "Festival special buses (Pournami / Deepam)", time: "Announced by TNSTC before each festival", price: "Duration: 5h+ on peak days" }
      ],
      trains: []
    };
    if (o.includes("bangalore") || o.includes("bengaluru") || o.includes("blr")) return {
      isInternational: false,
      roadTime: "4h 30m", route: "NH 44 to Krishnagiri, then NH 77 via Chengam (~200 km)",
      buses: [
        { name: "TNSTC / KSRTC (Satellite / Majestic)", time: "Frequent day and night", price: "Duration: ~5h 30m" }
      ],
      trains: []
    };
  }

  if (o.includes("bangalore") || o.includes("bengaluru") || o.includes("blr")) {
    if (dest === "palani-murugan") return {
      isInternational: false,
      roadTime: "6h 30m", route: "NH 44 and NH 83 via Salem",
      buses: [
        { name: "SETC (Non-AC Seater)", time: "11:00 PM, 11:45 PM", price: "Duration: 7h 30m" }, 
        { name: "TNSTC (AC Sleeper)", time: "10:30 PM", price: "Duration: 7h 00m" },
        { name: "National Travels (Volvo)", time: "11:15 PM", price: "Duration: 6h 45m" }
      ],
      trains: [
        { name: "Tuticorin Exp to Dindigul (16732)", time: "09:15 PM", price: "Duration: 8h 10m" },
        { name: "Nagercoil Exp to Dindigul (16340)", time: "08:45 PM", price: "Duration: 7h 30m" }
      ]
    };
    if (dest === "madurai-meenakshi") return {
      isInternational: false,
      roadTime: "7h 00m", route: "NH 44 via Salem",
      buses: [{ name: "SETC (Ultra Deluxe)", time: "10:30 PM", price: "Duration: 8h 00m" }, { name: "SRM Transports (AC Sleeper)", time: "10:00 PM", price: "Duration: 7h 30m" }],
      trains: [{ name: "Tuticorin Exp (16236)", time: "09:15 PM", price: "Duration: 9h 30m" }, { name: "Nagercoil Exp (16340)", time: "10:30 PM", price: "Duration: 9h 15m" }]
    };
  } else if (o.includes("chennai") || o.includes("madras") || o.includes("maa")) {
    if (dest === "palani-murugan") return {
      isInternational: false,
      roadTime: "8h 00m", route: "NH 38 via Trichy",
      buses: [
        { name: "SETC (AC Seater)", time: "10:00 PM", price: "Duration: 9h 00m" }, 
        { name: "SETC (Non-AC Seater)", time: "11:00 PM, 11:45 PM", price: "Duration: 9h 30m" },
        { name: "TNSTC (Ultra Deluxe)", time: "08:30 PM", price: "Duration: 9h 30m" },
        { name: "YBM Travels (AC Sleeper)", time: "09:30 PM", price: "Duration: 8h 30m" },
        { name: "KPN Travels (Volvo A/C)", time: "11:00 PM", price: "Duration: 8h 15m" }
      ],
      trains: [
        { name: "Palakkad Exp (22651)", time: "09:40 PM", price: "Duration: 9h 45m" },
        { name: "Vaigai SF Exp to Dindigul (12635)", time: "01:50 PM", price: "Duration: 6h 15m" }
      ]
    };
    if (dest === "madurai-meenakshi") return {
      isInternational: false,
      roadTime: "7h 30m", route: "NH 38 via Trichy",
      buses: [{ name: "SETC (Ultra Deluxe)", time: "10:30 PM", price: "Duration: 8h 30m" }, { name: "Parveen Travels (Volvo)", time: "10:15 PM", price: "Duration: 8h 00m" }],
      trains: [{ name: "Pandian Exp (12637)", time: "09:40 PM", price: "Duration: 7h 50m" }, { name: "Kanyakumari Exp (12633)", time: "05:15 PM", price: "Duration: 8h 20m" }]
    };
  }

  return { isInternational: false, roadTime: "Check Maps", route: "Fastest route via highway", buses: [], trains: [] };
}
