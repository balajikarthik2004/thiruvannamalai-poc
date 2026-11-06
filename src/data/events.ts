export interface TempleEvent {
  title: string;
  date: string;
  daysAway?: number;
  description: string;
  isMajor?: boolean;
  /** YYYY-MM-DD — set only when the exact date is known; makes the event bookable. */
  bookDate?: string;
}

export const templeEvents: Record<string, TempleEvent[]> = {
  "palani-murugan": [
    { title: "Aani Kiruthigai", date: "July 10, 2026", description: "Highly auspicious monthly observance dedicated to Lord Murugan. Special abhishekam performed.", isMajor: false },
    { title: "Aadi Krithigai", date: "August 7, 2026", description: "Devotees carry special Kavadis for Lord Murugan. Massive crowds expected.", isMajor: true },
    { title: "Kanda Sashti", date: "Nov 10 - Nov 15, 2026", description: "6-day festival celebrating Lord Murugan's victory over Surapadman.", isMajor: true },
    { title: "Thai Poosam", date: "January 22, 2027", description: "The grandest festival at Palani. Millions of devotees arrive carrying Kavadis.", isMajor: true },
    { title: "Panguni Uthiram", date: "March 21, 2027", description: "Celebration of celestial weddings. Special silver chariot procession.", isMajor: true }
  ],
  "madurai-meenakshi": [
    { title: "Aani Unjal Festival", date: "June 15 - June 24, 2026", description: "The deities are placed on a beautifully decorated swing.", isMajor: false },
    { title: "Aavani Moolam", date: "Aug 20 - Aug 31, 2026", description: "Celebrates the coronation of Lord Sundareswarar.", isMajor: true },
    { title: "Navarathri Festival", date: "Oct 10 - Oct 19, 2026", description: "Goddess Meenakshi is adorned in different alankarams each day.", isMajor: true }
  ],
  "srirangam": [
    { title: "Jyeshtaabhishekam", date: "June 25, 2026", description: "Annual cleansing ceremony of the main deity with holy water.", isMajor: true },
    { title: "Vaikunta Ekadasi", date: "Dec 29, 2026", description: "The most important festival. The Paramapada Vasal is opened.", isMajor: true }
  ],
  // Dates for 2026–27 are from published panchangam / temple-guide calendars, not an
  // official temple notice. Re-check against the temple's announcement each year.
  "tiruvannamalai": [
    { title: "Karthigai Deepam Brahmotsavam – Flag Hoisting", date: "Nov 15, 2026", bookDate: "2026-11-15", description: "Dhwajarohanam opens the 10-day Karthigai Brahmotsavam. Daily morning and evening processions of the deities around the Mada streets.", isMajor: true },
    { title: "Maha Ratham (Ther) Procession", date: "Nov 21, 2026", bookDate: "2026-11-21", description: "Day 7 of the Brahmotsavam: the Panchamurthi wooden chariots are pulled around the temple's Mada streets by devotees.", isMajor: true },
    { title: "Bharani Deepam", date: "Nov 24, 2026 · 4:00 AM", bookDate: "2026-11-24", description: "A single lamp lit before the sanctum at dawn is used to light five lamps, symbolising the Pancha Bhoota, before they are merged back into one.", isMajor: true },
    { title: "Karthigai Maha Deepam", date: "Nov 24, 2026 · 6:00 PM", bookDate: "2026-11-24", description: "The Maha Deepam is lit in the giant copper cauldron on the 2,668 ft summit of Arunachala at dusk and burns for about 11 days. Lakhs of devotees attend — book stays early.", isMajor: true },
    { title: "Karthigai Pournami Girivalam", date: "Nov 24, 2026", bookDate: "2026-11-24", description: "Full-moon Girivalam on Deepam day — the 14 km circumambulation of Arunachala past the eight Ashta Lingams.", isMajor: true },
    { title: "Arudra Darshanam", date: "Dec 2026 / Jan 2027 (Margazhi Thiruvathirai)", description: "Special abhishekam and darshan of Lord Nataraja on Thiruvathirai star in Margazhi.", isMajor: false },
    { title: "Thiruvoodal Festival", date: "Jan 16, 2027 (Maattu Pongal)", bookDate: "2027-01-16", description: "The divine 'lovers' quarrel' (oodal) of Shiva and Parvati is enacted on Thiruvoodal Street; Nandi is garlanded with fruits and sweets in the morning.", isMajor: false },
    { title: "Maha Shivaratri", date: "Feb–Mar 2027", description: "Night-long worship with four-kaala abhishekam and Lingodbhava darshan at midnight.", isMajor: true },
    { title: "Chitra Pournami Girivalam", date: "Apr–May 2027", description: "The busiest Girivalam of the year — around 20–25 lakh devotees walk around Arunachala. Expect very long waits.", isMajor: true },
    { title: "Aani Thirumanjanam", date: "Jun–Jul 2027", description: "Grand abhishekam for Lord Nataraja on Uthiram star in the Tamil month of Aani.", isMajor: false },
  ],
};

export function getUpcomingEvents(slug: string): TempleEvent[] {
  return templeEvents[slug] || [
    { title: "Pournami (Full Moon) Pooja", date: "Next Full Moon", description: "Special abhishekam and crowd surge expected.", isMajor: false },
    { title: "Pradosham", date: "Bi-monthly", description: "Auspicious evening pooja dedicated to Lord Shiva.", isMajor: false }
  ];
}
