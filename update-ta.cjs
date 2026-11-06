const fs = require('fs');

const path = 'src/locales/ta/translation.json';
if (fs.existsSync(path)) {
  let obj = JSON.parse(fs.readFileSync(path, 'utf8'));
  obj["Senior Citizen / Differently Abled / Pregnant Women"] = "முதியோர் / மாற்றுத்திறனாளிகள் / கர்ப்பிணிகள்";
  fs.writeFileSync(path, JSON.stringify(obj, null, 2));
  console.log("Updated ta translation.");
}
