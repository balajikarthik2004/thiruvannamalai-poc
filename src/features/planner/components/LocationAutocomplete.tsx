import { useState, useRef, useEffect, useMemo, type KeyboardEvent } from "react";
import { useTranslation } from "react-i18next";
import { MapPin, LocateFixed, Loader2, Sparkles, Navigation, Clock } from "lucide-react";

export interface LocationItem {
  name: string;
  region: string;
  badge?: string;
  aliases?: string[];
  distanceKm?: number;
}

export const POPULAR_LOCATIONS: LocationItem[] = [
  {
    name: "Chennai",
    region: "Tamil Nadu, India",
    badge: "Direct NH 32 · ~195 km",
    aliases: ["madras", "tambaram", "guindy", "avadi", "kilambakkam", "cbf"],
    distanceKm: 195,
  },
  {
    name: "Bengaluru",
    region: "Karnataka, India",
    badge: "NH 44 & NH 77 · ~205 km",
    aliases: ["bangalore", "blr", "bengaluru south", "whitefield", "electronic city", "majestic"],
    distanceKm: 205,
  },
  {
    name: "Madurai",
    region: "Tamil Nadu, India",
    badge: "NH 38 via Trichy · ~285 km",
    aliases: ["meenakshi", "mattuthavani"],
    distanceKm: 285,
  },
  {
    name: "Coimbatore",
    region: "Tamil Nadu, India",
    badge: "NH 544 via Salem · ~295 km",
    aliases: ["kovai", "gandhipuram", "singanallur"],
    distanceKm: 295,
  },
  {
    name: "Tiruchirappalli (Trichy)",
    region: "Tamil Nadu, India",
    badge: "Central TN Hub · ~180 km",
    aliases: ["trichy", "srirangam", "central bus stand"],
    distanceKm: 180,
  },
  {
    name: "Salem",
    region: "Tamil Nadu, India",
    badge: "Direct Highway · ~135 km",
    aliases: ["salem new bus stand", "harur route"],
    distanceKm: 135,
  },
  {
    name: "Vellore",
    region: "Tamil Nadu, India",
    badge: "Nearest Major Hub · ~85 km",
    aliases: ["katpadi", "vit"],
    distanceKm: 85,
  },
  {
    name: "Pondicherry (Puducherry)",
    region: "India",
    badge: "East Coast Route · ~105 km",
    aliases: ["puducherry", "pondy", "auroville"],
    distanceKm: 105,
  },
  {
    name: "Kanchipuram",
    region: "Tamil Nadu, India",
    badge: "Temple Town Corridor · ~110 km",
    aliases: ["kanchi"],
    distanceKm: 110,
  },
  {
    name: "Tirupati",
    region: "Andhra Pradesh, India",
    badge: "Pilgrim Corridor · ~195 km",
    aliases: ["tirumala", "renigunta", "ap"],
    distanceKm: 195,
  },
  {
    name: "Hyderabad",
    region: "Telangana, India",
    badge: "Major Metro · ~620 km",
    aliases: ["secunderabad", "cyberabad"],
    distanceKm: 620,
  },
  {
    name: "Tindivanam",
    region: "Tamil Nadu, India",
    badge: "Highway Junction · ~70 km",
    aliases: ["gingee road"],
    distanceKm: 70,
  },
  {
    name: "Villupuram",
    region: "Tamil Nadu, India",
    badge: "Railway Junction · ~60 km",
    aliases: ["viluppuram"],
    distanceKm: 60,
  },
  {
    name: "Erode",
    region: "Tamil Nadu, India",
    badge: "Western TN · ~230 km",
    aliases: ["perundurai"],
    distanceKm: 230,
  },
  {
    name: "Tiruppur",
    region: "Tamil Nadu, India",
    badge: "Western TN · ~270 km",
    aliases: ["knit city"],
    distanceKm: 270,
  },
  {
    name: "Thanjavur",
    region: "Tamil Nadu, India",
    badge: "Cauvery Delta · ~210 km",
    aliases: ["tanjore", "big temple"],
    distanceKm: 210,
  },
  {
    name: "Dindigul",
    region: "Tamil Nadu, India",
    badge: "South TN Junction · ~245 km",
    aliases: ["dindigul lock"],
    distanceKm: 245,
  },
  {
    name: "Hosur",
    region: "Tamil Nadu, India",
    badge: "Border Corridor · ~170 km",
    aliases: ["sipcot hosur"],
    distanceKm: 170,
  },
  {
    name: "Krishnagiri",
    region: "Tamil Nadu, India",
    badge: "NH 77 Junction · ~120 km",
    aliases: ["toll plaza"],
    distanceKm: 120,
  },
  {
    name: "Kumbakonam",
    region: "Tamil Nadu, India",
    badge: "Navagraha Hub · ~160 km",
    aliases: ["temple city"],
    distanceKm: 160,
  },
  {
    name: "Chidambaram",
    region: "Tamil Nadu, India",
    badge: "Natarajar Corridor · ~130 km",
    aliases: ["cuddalore district"],
    distanceKm: 130,
  },
  {
    name: "Tirunelveli",
    region: "Tamil Nadu, India",
    badge: "Deep South TN · ~440 km",
    aliases: ["nellai"],
    distanceKm: 440,
  },
  {
    name: "Thoothukudi (Tuticorin)",
    region: "Tamil Nadu, India",
    badge: "Port City · ~480 km",
    aliases: ["tuticorin"],
    distanceKm: 480,
  },
  {
    name: "Kanyakumari",
    region: "Tamil Nadu, India",
    badge: "Cape Comorin · ~520 km",
    aliases: ["nagercoil"],
    distanceKm: 520,
  },
  {
    name: "Mysuru (Mysore)",
    region: "Karnataka, India",
    badge: "Heritage City · ~340 km",
    aliases: ["mysore"],
    distanceKm: 340,
  },
  {
    name: "Kochi (Cochin)",
    region: "Kerala, India",
    badge: "Major Port & Airport · ~510 km",
    aliases: ["cochin", "ernakulam"],
    distanceKm: 510,
  },
  {
    name: "Thiruvananthapuram",
    region: "Kerala, India",
    badge: "State Capital · ~610 km",
    aliases: ["trivandrum"],
    distanceKm: 610,
  },
  {
    name: "Mumbai",
    region: "Maharashtra, India",
    badge: "Major Metro & Flights",
    aliases: ["bombay", "navi mumbai", "thane"],
  },
  {
    name: "Pune",
    region: "Maharashtra, India",
    badge: "Western Hub",
    aliases: ["poona"],
  },
  {
    name: "New Delhi",
    region: "Delhi NCR, India",
    badge: "National Capital & Flights",
    aliases: ["delhi", "ncr", "gurugram", "noida"],
  },
];

interface Props {
  value: string;
  onChange: (val: string) => void;
  onUseMyLocation: () => void;
  locating: boolean;
  locError?: string;
  placeholder?: string;
}

export function LocationAutocomplete({
  value,
  onChange,
  onUseMyLocation,
  locating,
  locError,
  placeholder = "e.g. Chennai, Bangalore, Madurai...",
}: Props) {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [highlightIndex, setHighlightIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const query = value.trim().toLowerCase();

  // Filter matching suggestions
  const filteredLocations = useMemo(() => {
    if (!query) {
      // Default to top 8 popular source hubs when empty
      return POPULAR_LOCATIONS.slice(0, 8);
    }

    return POPULAR_LOCATIONS.filter((item) => {
      const nameMatch = item.name.toLowerCase().includes(query);
      const regionMatch = item.region.toLowerCase().includes(query);
      const aliasMatch = item.aliases?.some((a) => a.includes(query));
      return nameMatch || regionMatch || aliasMatch;
    }).slice(0, 8);
  }, [query]);

  // Click outside listener
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (item: LocationItem) => {
    onChange(item.name);
    setIsOpen(false);
    setHighlightIndex(-1);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen) {
      if (e.key === "ArrowDown" || e.key === "Enter") {
        setIsOpen(true);
      }
      return;
    }

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightIndex((prev) =>
        prev < filteredLocations.length - 1 ? prev + 1 : 0
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightIndex((prev) =>
        prev > 0 ? prev - 1 : filteredLocations.length - 1
      );
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (highlightIndex >= 0 && highlightIndex < filteredLocations.length) {
        handleSelect(filteredLocations[highlightIndex]);
      } else if (filteredLocations.length > 0) {
        handleSelect(filteredLocations[0]);
      }
    } else if (e.key === "Escape") {
      setIsOpen(false);
    }
  };

  // Helper to highlight matching letters in the city name
  const renderHighlightedName = (name: string, q: string) => {
    if (!q) return name;
    const idx = name.toLowerCase().indexOf(q);
    if (idx === -1) return name;

    const before = name.substring(0, idx);
    const match = name.substring(idx, idx + q.length);
    const after = name.substring(idx + q.length);

    return (
      <>
        {before}
        <strong className="text-[#0B2F25] font-extrabold underline decoration-[#C48437] decoration-2">
          {match}
        </strong>
        {after}
      </>
    );
  };

  return (
    <div ref={containerRef} className="relative w-full">
      {/* Input container */}
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => {
            onChange(e.target.value);
            setIsOpen(true);
            setHighlightIndex(-1);
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={t(placeholder)}
          autoComplete="off"
          className="w-full h-9 sm:h-10 px-3.5 pr-11 bg-white border border-[#E8E2D5] rounded-xl text-xs sm:text-sm font-medium text-slate-800 outline-none focus:border-[#C48437] focus:ring-2 focus:ring-[#C48437]/15 transition-all shadow-2xs"
        />

        {/* GPS Button */}
        <button
          type="button"
          onClick={onUseMyLocation}
          aria-label={t("Use my current location")}
          title={t("Use my current location")}
          className="absolute right-1 top-1/2 -translate-y-1/2 flex h-7 w-7 items-center justify-center rounded-lg text-[#C48437] hover:bg-[#FAF6F0] transition-colors cursor-pointer"
        >
          {locating ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <LocateFixed className="w-3.5 h-3.5" />
          )}
        </button>
      </div>

      {locError && (
        <p className="text-xs text-rose-600 mt-1.5">{locError}</p>
      )}

      {/* Google Maps Style Autocomplete Suggestions Dropdown */}
      {isOpen && filteredLocations.length > 0 && (
        <div className="absolute left-0 right-0 top-full mt-1.5 z-50 rounded-2xl border border-[#E8E2D5] bg-white shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
          <div className="px-3.5 py-2 bg-[#FAF6F0]/80 border-b border-[#E8E2D5] flex items-center justify-between text-[11px] font-bold text-slate-500 uppercase tracking-wider">
            <span className="flex items-center gap-1.5">
              <Navigation className="w-3 h-3 text-[#C48437]" />
              {query ? t("Suggested Locations") : t("Popular Pilgrim Transit Hubs")}
            </span>
            <span className="text-[10px] text-slate-400 font-normal">
              Google Maps standard
            </span>
          </div>

          <ul className="max-h-64 overflow-y-auto divide-y divide-slate-100">
            {filteredLocations.map((item, index) => {
              const isHighlighted = index === highlightIndex;
              return (
                <li
                  key={item.name}
                  onClick={() => handleSelect(item)}
                  onMouseEnter={() => setHighlightIndex(index)}
                  className={`flex items-center justify-between px-3.5 py-2.5 transition-colors cursor-pointer ${
                    isHighlighted
                      ? "bg-[#FAF6F0] text-[#0B2F25]"
                      : "hover:bg-slate-50 text-slate-800"
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    {/* Google Pin Icon */}
                    <div
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-colors ${
                        isHighlighted
                          ? "bg-[#0B2F25] text-white"
                          : "bg-slate-100 text-slate-500"
                      }`}
                    >
                      <MapPin className="w-4 h-4" />
                    </div>

                    {/* City & State Text */}
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-slate-900 truncate">
                        {renderHighlightedName(item.name, query)}
                      </div>
                      <div className="text-[11px] text-slate-500 truncate">
                        {item.region}
                      </div>
                    </div>
                  </div>

                  {/* Route / Distance Badge */}
                  {item.badge && (
                    <div className="ml-2 shrink-0">
                      <span
                        className={`inline-block rounded-md px-2 py-0.5 text-[10px] font-bold tracking-tight ${
                          isHighlighted
                            ? "bg-[#C48437] text-white"
                            : "bg-[#FAF6F0] border border-[#E8E2D5] text-[#C48437]"
                        }`}
                      >
                        {item.badge}
                      </span>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>

          <div className="px-3.5 py-1.5 bg-slate-50 border-t border-slate-100 text-[10px] text-slate-400 flex items-center justify-between">
            <span>Use ↑↓ arrows to navigate, Enter to select</span>
            <span>Esc to close</span>
          </div>
        </div>
      )}
    </div>
  );
}
