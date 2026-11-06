const fs = require('fs');
const path = require('path');
const localesDir = path.join(__dirname, '../../src/locales');

const translations = {
  'en': {
    "Temple Stores": "Temple Stores"
  },
  'ta': {
    "Temple Stores": "கோவில் கடைகள்"
  },
  'hi': {
    "Temple Stores": "मंदिर की दुकानें"
  },
  'kn': {
    "Temple Stores": "ದೇವಾಲಯದ ಅಂಗಡಿಗಳು"
  },
  'mr': {
    "Temple Stores": "मंदिराची दुकाने"
  },
  'gu': {
    "Temple Stores": "મંદિરની દુકાનો"
  }
};

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
