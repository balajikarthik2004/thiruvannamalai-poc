const fs = require('fs');

const keys = [
  "Live Status"
];

const translations = {
  ta: ["நேரலை நிலை"],
  hi: ["लाइव स्थिति"],
  kn: ["ಲೈವ್ ಸ್ಥಿತಿ"],
  gu: ["લાઇવ સ્થિતિ"],
  mr: ["थेट स्थिती"]
};

['ta', 'hi', 'kn', 'gu', 'mr'].forEach(lang => {
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
