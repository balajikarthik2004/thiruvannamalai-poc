const fs = require('fs');
const path = require('path');
const localesDir = path.join(__dirname, '../../src/locales');

// Define known Tamil translations
const taMap = {
  // States
  "Tamil Nadu": "தமிழ்நாடு",
  "Karnataka": "கர்நாடகா",
  "Maharashtra": "மகாராஷ்டிரா",
  "Gujarat": "குஜராத்",

  // Districts & Cities
  "Dindigul": "திண்டுக்கல்",
  "Palani": "பழனி",
  "Madurai": "மதுரை",
  "Tiruchirappalli": "திருச்சிராப்பள்ளி",
  "Srirangam": "ஸ்ரீரங்கம்",
  "Tiruvannamalai": "திருவண்ணாமலை",
  "Ramanathapuram": "ராமநாதபுரம்",
  "Rameswaram": "ராமேஸ்வரம்",
  "Cuddalore": "கடலூர்",
  "Chidambaram": "சிதம்பரம்",
  "Thoothukudi": "தூத்துக்குடி",
  "Tiruchendur": "திருச்செந்தூர்",
  "Samayapuram": "சமயபுரம்",
  "Chennai": "சென்னை",
  "Mylapore, Chennai": "மயிலாப்பூர், சென்னை",
  "Thanjavur": "தஞ்சாவூர்",
  "Vijayanagara": "விஜயநகரா",
  "Hampi": "ஹம்பி",
  "Udupi": "உடுப்பி",
  "Uttara Kannada": "உத்தர கன்னடா",
  "Murudeshwar": "முருடேஷ்வர்",
  "Gokarna": "கோகர்ணா",
  "Hassan": "ஹாசன்",
  "Belur": "பேளூர்",
  "Dakshina Kannada": "தட்சிண கன்னடா",
  "Subramanya": "சுப்ரமண்யா",
  "Dharmasthala": "தர்மஸ்தலா",
  "Chikkamagaluru": "சிக்கமகளூரு",
  "Sringeri": "சிருங்கேரி",
  "Kollur": "கொல்லூர்",
  "Halebidu": "ஹளேபீடு",
  "Ahmednagar": "அகமதுநகர்",
  "Shirdi": "சீரடி",
  "Mumbai": "மும்பை",
  "Nashik": "நாசிக்",
  "Trimbak": "த்ரிம்பக்",
  "Pune": "புனே",
  "Bhimashankar": "பீமாசங்கர்",
  "Aurangabad": "அவுரங்காபாத்",
  "Ellora": "எல்லோரா",
  "Kolhapur": "கோலாப்பூர்",
  "Shingnapur": "சிங்கனாபூர்",
  "Dharashiv": "தாராஷிவ்",
  "Tuljapur": "துல்ஜாபூர்",
  "Solapur": "சோலாபூர்",
  "Pandharpur": "பண்டரிபுரம்",
  "Jejuri": "ஜெஜூரி",
  "Gir Somnath": "கிர் சோம்நாத்",
  "Prabhas Patan": "பிரபாஸ் பதான்",
  "Devbhumi Dwarka": "தேவ்பூமி துவாரகா",
  "Dwarka": "துவாரகா",
  "Gandhinagar": "காந்திநகர்",
  "Banaskantha": "பனஸ்கந்தா",
  "Ambaji": "அம்பாஜி",
  "Mehsana": "மெஹ்சானா",
  "Modhera": "மோதேரா",
  "Bhavnagar": "பாவ்நகர்",
  "Palitana": "பாலிதானா",
  "Panchmahal": "பஞ்ச்மகால்",
  "Pavagadh": "பாவாகத்",
  "Ahmedabad": "அகமதாபாத்",
  "Kheda": "கேடா",
  "Dakor": "டாகோர்",

  // Deities
  "Lord Murugan (Dhandayuthapani Swamy)": "முருகப் பெருமான் (தண்டாயுதபாணி சுவாமி)",
  "Goddess Meenakshi & Lord Sundareswarar": "மீனாட்சி அம்மன் & சுந்தரேஸ்வரர்",
  "Lord Ranganatha (Vishnu)": "ரங்கநாதர் (விஷ்ணு)",
  "Lord Shiva (Arunachaleswarar)": "சிவபெருமான் (அருணாசலேஸ்வரர்)",
  "Lord Shiva (Ramanathaswamy)": "சிவபெருமான் (ராமநாதசுவாமி)",
  "Lord Shiva (Nataraja)": "சிவபெருமான் (நடராஜர்)",
  "Lord Murugan (Senthilandavar)": "முருகப் பெருமான் (செந்திலாண்டவர்)",
  "Goddess Mariamman": "மாரியம்மன்",
  "Lord Shiva (Kapaleeshwarar)": "சிவபெருமான் (கபாலீஸ்வரர்)",
  "Lord Shiva (Brihadeeswarar)": "சிவபெருமான் (பிரகதீஸ்வரர்)",
  "Lord Shiva": "சிவபெருமான்",
  "Lord Krishna": "கிருஷ்ணர்",
  "Lord Subramanya": "சுப்ரமணியர்",
  "Lord Shiva (Manjunatha)": "சிவபெருமான் (மஞ்சுநாதர்)",
  "Goddess Sharada": "சாரதாம்பாள்",
  "Goddess Mookambika": "மூகாம்பிகை",
  "Sai Baba": "சாய் பாபா",
  "Lord Ganesha": "விநாயகர்",
  "Goddess Mahalaxmi": "மகாலட்சுமி",
  "Lord Shani": "சனி பகவான்",
  "Goddess Bhavani": "பவானி அம்மன்",
  "Lord Vitthal": "விட்டலர்",
  "Lord Khandoba": "கண்டோபா",
  "Bhagwan Swaminarayan": "பகவான் சுவாமிநாராயண்",
  "Goddess Amba": "அம்பா அம்மன்",
  "Surya (Sun God)": "சூரிய பகவான்",
  "Adinath": "ஆதிநாதர்",
  "Goddess Rukmini": "ருக்மணி அம்மன்",
  "Goddess Kalika": "காளிகா அம்மன்",
  "Nar Narayan": "நர நாராயணன்",

  // Temple Names
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

// Also inject all of these exact keys into EN as identity, and into other languages as fallback (or we can use TA for other languages for now)
const enMap = {};
for (const key of Object.keys(taMap)) {
  enMap[key] = key;
}

const translations = {
  'en': enMap,
  'ta': taMap,
  'hi': { ...taMap }, // Just providing the TA translations as placeholders for now so it's visibly not English
  'kn': { ...taMap },
  'mr': { ...taMap },
  'gu': { ...taMap },
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
