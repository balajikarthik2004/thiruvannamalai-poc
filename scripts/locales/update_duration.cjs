const fs = require('fs');
const path = require('path');

const newTranslations = {
  en: { "Duration": "Duration", "Duration:": "Duration:" },
  ta: { "Duration": "பயண நேரம்", "Duration:": "பயண நேரம்:" },
  hi: { "Duration": "अवधि", "Duration:": "अवधि:" },
  kn: { "Duration": "ಅವಧಿ", "Duration:": "ಅವಧಿ:" },
  gu: { "Duration": "સમયગાળો", "Duration:": "સમયગાળો:" },
  mr: { "Duration": "कालावधी", "Duration:": "कालावधी:" }
};

const localesDir = path.join(__dirname, '..', '..', 'src', 'locales');
for (const lang of Object.keys(newTranslations)) {
  const file = path.join(localesDir, lang, 'translation.json');
  if (fs.existsSync(file)) {
    const current = JSON.parse(fs.readFileSync(file, 'utf8'));
    const merged = { ...current, ...newTranslations[lang] };
    fs.writeFileSync(file, JSON.stringify(merged, null, 2), 'utf8');
  }
}
