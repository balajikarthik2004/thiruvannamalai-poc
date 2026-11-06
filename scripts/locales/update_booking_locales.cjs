const fs = require('fs');
const path = require('path');
const localesDir = path.join(__dirname, '../../src/locales');

const translations = {
  'en': {
    'Temple Store': 'Temple Store'
  },
  'ta': {
    'Temple Store': 'கோவில் கடை'
  },
  'hi': {
    'Temple Store': 'मंदिर की दुकान'
  },
  'kn': {
    'Temple Store': 'ದೇವಾಲಯದ ಅಂಗಡಿ'
  },
  'mr': {
    'Temple Store': 'मंदिराचे दुकान'
  },
  'gu': {
    'Temple Store': 'મંદિરની દુકાન'
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
