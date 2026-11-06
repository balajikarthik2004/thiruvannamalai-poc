const fs = require('fs');

const keys = [
  "Free",
  "Senior Citizen / Differently Abled / Pregnant Women"
];

const translations = {
  en: keys,
  ta: ["இலவசம்", "மூத்த குடிமக்கள் / மாற்றுத்திறனாளிகள் / கர்ப்பிணிப் பெண்கள்"],
  hi: ["मुफ़्त", "वरिष्ठ नागरिक / दिव्यांग / गर्भवती महिलाएँ"],
  kn: ["ಉಚಿತ", "ಹಿರಿಯ ನಾಗರಿಕರು / ಅಂಗವಿಕಲರು / ಗರ್ಭಿಣಿಯರು"],
  gu: ["મફત", "વરિષ્ઠ નાગરિક / દિવ્યાંગ / ગર્ભવતી મહિલાઓ"],
  mr: ["मोफत", "ज्येष्ठ नागरिक / दिव्यांग / गर्भवती महिला"]
};

['en', 'ta', 'hi', 'kn', 'gu', 'mr'].forEach(lang => {
  let path = 'src/locales/' + lang + '/translation.json';
  if (fs.existsSync(path)) {
    let obj = JSON.parse(fs.readFileSync(path, 'utf8'));
    for (let i = 0; i < keys.length; i++) {
        obj[keys[i]] = translations[lang][i];
    }
    fs.writeFileSync(path, JSON.stringify(obj, null, 2));
    console.log("Updated", lang);
  }
});
