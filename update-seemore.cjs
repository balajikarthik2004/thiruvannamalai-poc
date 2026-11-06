const fs = require('fs');

const keys = [
  "See more"
];

const translations = {
  ta: ["மேலும் காண்க"],
  hi: ["और देखें"],
  kn: ["ಇನ್ನಷ್ಟು ನೋಡಿ"],
  gu: ["વધુ જુઓ"],
  mr: ["आणखी पहा"]
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
