const fs = require('fs');
const path = require('path');
const localesDir = path.join(__dirname, '../../src/locales');

const translations = {
  'en': {
    "Kala Santhi Pooja": "Kala Santhi Pooja",
    "Uchikalam Pooja": "Uchikalam Pooja",
    "Sayarakshai Pooja": "Sayarakshai Pooja",
    "Special Laddoo": "Special Laddoo",
    "Tamarind Rice (Puliyodarai)": "Tamarind Rice (Puliyodarai)",
    "Sweet Pongal (Sakkara Pongal)": "Sweet Pongal (Sakkara Pongal)",
    "Standard Non-AC Room": "Standard Non-AC Room",
    "Deluxe AC Room": "Deluxe AC Room",
    "Family Cottage": "Family Cottage",
    "Kalyana Mandapam (Marriage Hall)": "Kalyana Mandapam (Marriage Hall)",
    "Mini Party Hall (Annadhanam)": "Mini Party Hall (Annadhanam)",
    "Free": "Free",
    "Special Poojas": "Special Poojas",
    "Archana Thattu & Offerings": "Archana Thattu & Offerings",
    "Add Archana Thattu": "Add Archana Thattu",
    "Zero Plastic": "Zero Plastic",
    "Includes coconut, betel leaves, camphor, and fruits. Packaged in a 100% biodegradable bag. Pick up empty-handed at the temple counter.": "Includes coconut, betel leaves, camphor, and fruits. Packaged in a 100% biodegradable bag. Pick up empty-handed at the temple counter.",
    "Add Fresh Flower Garland & Rice": "Add Fresh Flower Garland & Rice",
    "Sourced from local temple vendors and delivered directly to your pickup counter.": "Sourced from local temple vendors and delivered directly to your pickup counter.",
    "Skip the Queue!": "Skip the Queue!",
    "Pre-book your Prasadam online. Collect directly at the dedicated Online Pickup Counter inside the temple.": "Pre-book your Prasadam online. Collect directly at the dedicated Online Pickup Counter inside the temple.",
    "Temple Accommodations": "Temple Accommodations",
    "Book rooms located inside the serene temple campus for your stay.": "Book rooms located inside the serene temple campus for your stay.",
    "Number of Nights:": "Number of Nights:",
    "Marriage & Party Halls": "Marriage & Party Halls",
    "Reserve divine venues for your auspicious events.": "Reserve divine venues for your auspicious events."
  },
  'ta': {
    "Kala Santhi Pooja": "கால சாந்தி பூஜை",
    "Uchikalam Pooja": "உச்சிக்கால பூஜை",
    "Sayarakshai Pooja": "சாயரட்சை பூஜை",
    "Special Laddoo": "சிறப்பு லட்டு",
    "Tamarind Rice (Puliyodarai)": "புளியோதரை",
    "Sweet Pongal (Sakkara Pongal)": "சர்க்கரை பொங்கல்",
    "Standard Non-AC Room": "சாதாரண ஏசி இல்லாத அறை",
    "Deluxe AC Room": "டீலக்ஸ் ஏசி அறை",
    "Family Cottage": "குடும்ப குடில்",
    "Kalyana Mandapam (Marriage Hall)": "கல்யாண மண்டபம்",
    "Mini Party Hall (Annadhanam)": "மினி பார்ட்டி ஹால் (அன்னதானம்)",
    "Free": "இலவசம்",
    "Special Poojas": "சிறப்பு பூஜைகள்",
    "Archana Thattu & Offerings": "அர்ச்சனை தட்டு மற்றும் பிரசாதம்",
    "Add Archana Thattu": "அர்ச்சனை தட்டு சேர்க்கவும்",
    "Zero Plastic": "பிளாஸ்டிக் இல்லை",
    "Includes coconut, betel leaves, camphor, and fruits. Packaged in a 100% biodegradable bag. Pick up empty-handed at the temple counter.": "தேங்காய், வெற்றிலை, கற்பூரம் மற்றும் பழங்கள் அடங்கும். 100% மக்கும் பையில் பேக் செய்யப்பட்டுள்ளது.",
    "Add Fresh Flower Garland & Rice": "புதிய பூ மாலை மற்றும் அரிசி சேர்க்கவும்",
    "Sourced from local temple vendors and delivered directly to your pickup counter.": "உள்ளூர் கோவில் விற்பனையாளர்களிடமிருந்து பெறப்பட்டு நேரடியாக உங்கள் பிக்-அப் கவுண்டருக்கு வழங்கப்படுகிறது.",
    "Skip the Queue!": "வரிசையைத் தவிர்க்கவும்!",
    "Pre-book your Prasadam online. Collect directly at the dedicated Online Pickup Counter inside the temple.": "உங்கள் பிரசாதத்தை ஆன்லைனில் முன்பதிவு செய்யுங்கள். கோவிலுக்குள் உள்ள சிறப்பு கவுண்டரில் நேரடியாகப் பெறுங்கள்.",
    "Temple Accommodations": "கோவில் தங்குமிடங்கள்",
    "Book rooms located inside the serene temple campus for your stay.": "உங்கள் தங்குமிடத்திற்கு அமைதியான கோவில் வளாகத்திற்குள் அமைந்துள்ள அறைகளை முன்பதிவு செய்யுங்கள்.",
    "Number of Nights:": "இரவுகளின் எண்ணிக்கை:",
    "Marriage & Party Halls": "திருமண மற்றும் விருந்து மண்டபங்கள்",
    "Reserve divine venues for your auspicious events.": "உங்கள் மங்களகரமான நிகழ்வுகளுக்கு தெய்வீக இடங்களை முன்பதிவு செய்யுங்கள்."
  }
};

const otherLangs = ['hi', 'kn', 'mr', 'gu'];
for (const l of otherLangs) {
  translations[l] = {};
  for (const [key, val] of Object.entries(translations['ta'])) {
    translations[l][key] = val; // Placeholder for other langs to ensure it works
  }
}

for (const [lang, tMap] of Object.entries(translations)) {
  const file = path.join(localesDir, lang, 'translation.json');
  if (fs.existsSync(file)) {
    let data = JSON.parse(fs.readFileSync(file, 'utf8'));
    for (const [key, value] of Object.entries(tMap)) {
      data[key] = value;
    }
    fs.writeFileSync(file, JSON.stringify(data, null, 2));
    console.log('Updated', lang);
  }
}
