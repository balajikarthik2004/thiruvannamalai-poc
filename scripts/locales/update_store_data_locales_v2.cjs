const fs = require('fs');
const path = require('path');
const localesDir = path.join(__dirname, '../../src/locales');

// Define known Tamil translations for temple base names
const taMap = {
  "Palani Murugan Temple": "பழனி முருகன் கோவில்",
  "Madurai Meenakshi Temple": "மதுரை மீனாட்சி அம்மன் கோவில்",
  "Srirangam Temple": "ஸ்ரீரங்கம் கோவில்",
  "Tiruvannamalai Arunachaleswarar Temple": "திருவண்ணாமலை அருணாசலேஸ்வரர் கோவில்",
  "Rameswaram Temple": "ராமேஸ்வரம் கோவில்",
  "Chidambaram Natarajar Temple": "சிதம்பரம் நடராஜர் கோவில்",
  "Tiruchendur Murugan Temple": "திருச்செந்தூர் முருகன் கோவில்",
  "Samayapuram Mariamman Temple": "சமயபுரம் மாரியம்மன் கோவில்",
  "Kapaleeshwarar Temple": "கபாலீஸ்வரர் கோவில்",
  "Brihadeeswarar Temple": "பிரகதீஸ்வரர் கோவில்",
  
  "Virupaksha Temple": "விருபாட்சா கோவில்",
  "Udupi Sri Krishna Matha": "உடுப்பி ஸ்ரீ கிருஷ்ண மடம்",
  "Murudeshwara Temple": "முருடேஷ்வரா கோவில்",
  "Mahabaleshwara Temple": "மகாபலேஷ்வரா கோவில்",
  "Chennakeshava Temple": "சென்னகேசவா கோவில்",
  "Kukke Subramanya Temple": "குக்கே சுப்ரமண்யா கோவில்",
  "Dharmasthala Temple": "தர்மஸ்தலா கோவில்",
  "Sringeri Sharada Peetham": "சிருங்கேரி சாரதா பீடம்",
  "Mookambika Temple": "மூகாம்பிகை கோவில்",
  "Hoysaleswara Temple": "ஹொய்சலேஸ்வர கோவில்",

  "Shirdi Sai Baba Temple": "சீரடி சாய் பாபா கோவில்",
  "Siddhivinayak Temple": "சித்திவிநாயகர் கோவில்",
  "Trimbakeshwar Temple": "த்ரிம்பகேஸ்வர் கோவில்",
  "Bhimashankar Temple": "பீமாசங்கர் கோவில்",
  "Grishneshwar Temple": "கிருஷ்ணேஷ்வர் கோவில்",
  "Mahalaxmi Temple": "மகாலட்சுமி கோவில்",
  "Shani Shingnapur": "சனி சிங்கனாபூர்",
  "Tulja Bhavani Temple": "துல்ஜா பவானி கோவில்",
  "Vithoba Temple": "விட்டோபா கோவில்",
  "Khandoba Temple": "கண்டோபா கோவில்",

  "Somnath Temple": "சோம்நாத் கோவில்",
  "Dwarkadhish Temple": "துவாரகாதீஷ் கோவில்",
  "BAPS Akshardham": "பாப்ஸ் அக்சர்தாம்",
  "Ambaji Temple": "அம்பாஜி கோவில்",
  "Sun Temple": "சூரியனார் கோவில்",
  "Palitana Jain Temples": "பாலிதானா ஜெயின் கோவில்கள்",
  "Rukmini Devi Temple": "ருக்மணி தேவி கோவில்",
  "Kalika Mata Temple": "காளிகா மாதா கோவில்",
  "Shree Swaminarayan Mandir": "ஸ்ரீ சுவாமிநாராயண் மந்திர்",
  "Ranchhodrai Temple": "ரஞ்சோத்ராய் கோவில்"
};

const combinedTa = {};
const combinedEn = {};

for (const [enName, taName] of Object.entries(taMap)) {
  const enStoreName = `${enName} Official Store`;
  const enDesc = `Purchase authentic prasadam, merchandise, and pooja items directly from ${enName}. Includes a temple pickup option for your convenience.`;
  
  const taStoreName = `${taName} அதிகாரப்பூர்வ கடை`;
  const taDesc = `${taName}லிருந்து நேரடியாக பிரசாதம் மற்றும் பூஜை பொருட்களை வாங்குங்கள்.`;

  combinedTa[enStoreName] = taStoreName;
  combinedTa[enDesc] = taDesc;
  
  combinedEn[enStoreName] = enStoreName;
  combinedEn[enDesc] = enDesc;
}

const translations = {
  'en': combinedEn,
  'ta': combinedTa,
  'hi': { ...combinedTa },
  'kn': { ...combinedTa },
  'mr': { ...combinedTa },
  'gu': { ...combinedTa },
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
