const fs = require('fs');
const path = require('path');

const newTranslations = {
  en: {
    "Notifications": "Notifications",
    "Peak alert": "Peak alert",
    "Inner sanctum approaching capacity": "Inner sanctum approaching capacity",
    "Queue update": "Queue update",
    "Lane B wait time +6 min": "Lane B wait time +6 min",
    "Staff": "Staff",
    "8 volunteers Added to Lane C": "8 volunteers Added to Lane C",
    "All Districts": "All Districts"
  },
  ta: {
    "Notifications": "அறிவிப்புகள்",
    "Peak alert": "கூட்ட எச்சரிக்கை",
    "Inner sanctum approaching capacity": "கருவறை கூட்டம் நிறைகிறது",
    "Queue update": "வரிசை நிலை",
    "Lane B wait time +6 min": "வரிசை B காத்திருப்பு +6 நிமிடம்",
    "Staff": "பணியாளர்கள்",
    "8 volunteers Added to Lane C": "வரிசை C-ல் 8 தொண்டர்கள்"
  },
  hi: {
    "Notifications": "सूचनाएं",
    "Peak alert": "भीड़ चेतावनी",
    "Inner sanctum approaching capacity": "गर्भगृह की क्षमता भर रही है",
    "Queue update": "कतार अपडेट",
    "Lane B wait time +6 min": "लेन बी प्रतीक्षा +6 मिनट",
    "Staff": "कर्मचारी",
    "8 volunteers Added to Lane C": "लेन सी में 8 स्वयंसेवक तैनात"
  },
  kn: {
    "Notifications": "ಸೂಚನೆಗಳು",
    "Peak alert": "ಜನಸಂದಣಿ ಎಚ್ಚರಿಕೆ",
    "Inner sanctum approaching capacity": "ಗರ್ಭಗುಡಿಯ ಸಾಮರ್ಥ್ಯ ಭರ್ತಿಯಾಗುತ್ತಿದೆ",
    "Queue update": "ಕ್ಯೂ ನವೀಕರಣ",
    "Lane B wait time +6 min": "ಲೇನ್ ಬಿ ಕಾಯುವ ಸಮಯ +6 ನಿಮಿಷ",
    "Staff": "ಸಿಬ್ಬಂದಿ",
    "8 volunteers Added to Lane C": "ಲೇನ್ ಸಿ ಗೆ 8 ಸ್ವಯಂಸೇವಕರು"
  },
  gu: {
    "Notifications": "સૂચનાઓ",
    "Peak alert": "ભીડ ચેતવણી",
    "Inner sanctum approaching capacity": "ગર્ભગૃહની ક્ષમતા ભરાઈ રહી છે",
    "Queue update": "કતાર અપડેટ",
    "Lane B wait time +6 min": "લેન બી પ્રતીક્ષા +6 મિનિટ",
    "Staff": "કર્મચારી",
    "8 volunteers Added to Lane C": "લેન સી માં 8 સ્વયંસેવકો"
  },
  mr: {
    "Notifications": "सूचना",
    "Peak alert": "गर्दीची चेतावणी",
    "Inner sanctum approaching capacity": "गाभाऱ्याची क्षमता भरत आहे",
    "Queue update": "रांग अपडेट",
    "Lane B wait time +6 min": "लेन बी प्रतीक्षा +6 मिनिटे",
    "Staff": "कर्मचारी",
    "8 volunteers Added to Lane C": "लेन सी मध्ये 8 स्वयंसेवक"
  }
};

const localesDir = path.join(__dirname, '..', '..', 'src', 'locales');
const langs = Object.keys(newTranslations);

for (const lang of langs) {
  const file = path.join(localesDir, lang, 'translation.json');
  if (fs.existsSync(file)) {
    const current = JSON.parse(fs.readFileSync(file, 'utf8'));
    const merged = { ...current, ...newTranslations[lang] };
    fs.writeFileSync(file, JSON.stringify(merged, null, 2), 'utf8');
    console.log(`Updated ${lang}`);
  }
}
