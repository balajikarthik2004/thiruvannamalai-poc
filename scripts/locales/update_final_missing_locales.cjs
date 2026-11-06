const fs = require('fs');
const path = require('path');

const newTranslations = {
  en: {
    "Moderate Crowd": "Moderate Crowd",
    "Wait": "Wait"
  },
  ta: {
    "Moderate Crowd": "மிதமான கூட்டம்",
    "Wait": "காத்திருப்பு"
  },
  hi: {
    "Moderate Crowd": "मध्यम भीड़",
    "Wait": "प्रतीक्षा"
  },
  kn: {
    "Moderate Crowd": "ಮಧ್ಯಮ ಜನಸಂದಣಿ",
    "Wait": "ಕಾಯುವಿಕೆ"
  },
  gu: {
    "Moderate Crowd": "મધ્યમ ભીડ",
    "Wait": "પ્રતીક્ષા"
  },
  mr: {
    "Moderate Crowd": "मध्यम गर्दी",
    "Wait": "प्रतीक्षा"
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
