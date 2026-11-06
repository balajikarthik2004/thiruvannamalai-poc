const fs = require('fs');
const path = require('path');

const newTranslations = {
  en: { "View temple map →": "View temple map →" },
  ta: { "View temple map →": "கோவில் வரைபடத்தைக் காண்க →" },
  hi: { "View temple map →": "मंदिर का नक्शा देखें →" },
  kn: { "View temple map →": "ದೇವಾಲಯದ ನಕ್ಷೆ ವೀಕ್ಷಿಸಿ →" },
  gu: { "View temple map →": "મંદિરનો નકશો જુઓ →" },
  mr: { "View temple map →": "मंदिराचा नकाशा पहा →" }
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
