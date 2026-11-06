const fs = require('fs');
const path = require('path');
const localesDir = path.join(__dirname, '../../src/locales');

const uiTranslations = {
  "Poojas & Archana": {
    ta: "பூஜைகள் & அர்ச்சனை",
    hi: "पूजा और अर्चना",
    kn: "ಪೂಜೆಗಳು ಮತ್ತು ಅರ್ಚನೆ",
    mr: "पूजा आणि अर्चना",
    gu: "પૂજા અને અર્ચના"
  },
  "Prasadam": {
    ta: "பிரசாதம்",
    hi: "प्रसाद",
    kn: "ಪ್ರಸಾದ",
    mr: "प्रसाद",
    gu: "પ્રસાદ"
  },
  "Rooms": {
    ta: "அறைகள்",
    hi: "कमरे",
    kn: "ಕೊಠಡಿಗಳು",
    mr: "खोल्या",
    gu: "રૂમ્સ"
  },
  "Venues": {
    ta: "மண்டபங்கள்",
    hi: "स्थान",
    kn: "ಸ್ಥಳಗಳು",
    mr: "ठिकाणे",
    gu: "સ્થાનો"
  },
  "/ night": {
    ta: "/ இரவு",
    hi: "/ रात",
    kn: "/ ರಾತ್ರಿ",
    mr: "/ रात्र",
    gu: "/ રાત"
  },
  "/ day": {
    ta: "/ நாள்",
    hi: "/ दिन",
    kn: "/ ದಿನ",
    mr: "/ दिवस",
    gu: "/ દિવસ"
  }
};

const targetLangs = ['en', 'ta', 'hi', 'kn', 'mr', 'gu'];
for (const lang of targetLangs) {
  const file = path.join(localesDir, lang, 'translation.json');
  if (fs.existsSync(file)) {
    let data = JSON.parse(fs.readFileSync(file, 'utf8'));
    for (const [key, tMap] of Object.entries(uiTranslations)) {
      if (lang === 'en') {
        data[key] = key;
      } else if (tMap[lang]) {
        data[key] = tMap[lang];
      }
    }
    fs.writeFileSync(file, JSON.stringify(data, null, 2));
    console.log('Updated', lang);
  }
}
