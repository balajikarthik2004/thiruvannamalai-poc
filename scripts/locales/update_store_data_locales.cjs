const fs = require('fs');
const path = require('path');
const localesDir = path.join(__dirname, '../../src/locales');

const translations = {
  'en': {
    "Divine Brass Oil Lamp (Diya)": "Divine Brass Oil Lamp (Diya)",
    "Traditional brass oil lamp, perfect for daily pooja and special occasions. Heavy base, premium quality.": "Traditional brass oil lamp, perfect for daily pooja and special occasions. Heavy base, premium quality.",
    "Premium Kumkum & Turmeric Sachet Set": "Premium Kumkum & Turmeric Sachet Set",
    "Auspicious set of pure kumkum and turmeric from the temple premises, blessed by the priests.": "Auspicious set of pure kumkum and turmeric from the temple premises, blessed by the priests.",
    "Handcrafted Toran / Door Hanging": "Handcrafted Toran / Door Hanging",
    "Beautiful marigold and mango leaf design door hanging to welcome prosperity.": "Beautiful marigold and mango leaf design door hanging to welcome prosperity.",
    "Om & Swastika Wall Hanging": "Om & Swastika Wall Hanging",
    "Metal alloy wall hanging with traditional symbols for peace and good fortune.": "Metal alloy wall hanging with traditional symbols for peace and good fortune.",
    "Customized Temple T-Shirt (Unisex)": "Customized Temple T-Shirt (Unisex)",
    "100% Cotton t-shirt featuring the temple deity's artwork. Available in multiple sizes.": "100% Cotton t-shirt featuring the temple deity's artwork. Available in multiple sizes.",
    "Framed Deity Photo (8x10)": "Framed Deity Photo (8x10)",
    "High-resolution photo print of the main deity, beautifully framed in synthetic wood.": "High-resolution photo print of the main deity, beautifully framed in synthetic wood.",
    "Silver Vel (Spear) Replica": "Silver Vel (Spear) Replica",
    "Miniature silver-plated Vel, the divine weapon of Lord Murugan.": "Miniature silver-plated Vel, the divine weapon of Lord Murugan.",
    "Crystal Shiva Lingam": "Crystal Shiva Lingam",
    "Small pure crystal (Sphatik) Shiva Lingam for home worship.": "Small pure crystal (Sphatik) Shiva Lingam for home worship.",
    "Photos": "Photos",
    "Merchandise": "Merchandise",
    "Lamps": "Lamps",
    "Idols": "Idols",
    "Hangings": "Hangings",
    "Sachets": "Sachets",
    "Apparel": "Apparel",
    "Palani Murugan Temple Official Store": "Palani Murugan Temple Official Store",
    "Purchase authentic prasadam, merchandise, and pooja items directly from Palani Murugan Temple. Includes a temple pickup option for your convenience.": "Purchase authentic prasadam, merchandise, and pooja items directly from Palani Murugan Temple. Includes a temple pickup option for your convenience.",
    "Madurai Meenakshi Temple Official Store": "Madurai Meenakshi Temple Official Store",
    "Purchase authentic prasadam, merchandise, and pooja items directly from Madurai Meenakshi Temple. Includes a temple pickup option for your convenience.": "Purchase authentic prasadam, merchandise, and pooja items directly from Madurai Meenakshi Temple. Includes a temple pickup option for your convenience.",
    "Srirangam Temple Official Store": "Srirangam Temple Official Store",
    "Purchase authentic prasadam, merchandise, and pooja items directly from Srirangam Temple. Includes a temple pickup option for your convenience.": "Purchase authentic prasadam, merchandise, and pooja items directly from Srirangam Temple. Includes a temple pickup option for your convenience.",
    "Tiruvannamalai Arunachaleswarar Temple Official Store": "Tiruvannamalai Arunachaleswarar Temple Official Store",
    "Purchase authentic prasadam, merchandise, and pooja items directly from Tiruvannamalai Arunachaleswarar Temple. Includes a temple pickup option for your convenience.": "Purchase authentic prasadam, merchandise, and pooja items directly from Tiruvannamalai Arunachaleswarar Temple. Includes a temple pickup option for your convenience.",
    "Rameswaram Temple Official Store": "Rameswaram Temple Official Store",
    "Purchase authentic prasadam, merchandise, and pooja items directly from Rameswaram Temple. Includes a temple pickup option for your convenience.": "Purchase authentic prasadam, merchandise, and pooja items directly from Rameswaram Temple. Includes a temple pickup option for your convenience.",
    "Chidambaram Natarajar Temple Official Store": "Chidambaram Natarajar Temple Official Store",
    "Purchase authentic prasadam, merchandise, and pooja items directly from Chidambaram Natarajar Temple. Includes a temple pickup option for your convenience.": "Purchase authentic prasadam, merchandise, and pooja items directly from Chidambaram Natarajar Temple. Includes a temple pickup option for your convenience.",
    "Tiruchendur Murugan Temple Official Store": "Tiruchendur Murugan Temple Official Store",
    "Purchase authentic prasadam, merchandise, and pooja items directly from Tiruchendur Murugan Temple. Includes a temple pickup option for your convenience.": "Purchase authentic prasadam, merchandise, and pooja items directly from Tiruchendur Murugan Temple. Includes a temple pickup option for your convenience.",
    "Samayapuram Mariamman Temple Official Store": "Samayapuram Mariamman Temple Official Store",
    "Purchase authentic prasadam, merchandise, and pooja items directly from Samayapuram Mariamman Temple. Includes a temple pickup option for your convenience.": "Purchase authentic prasadam, merchandise, and pooja items directly from Samayapuram Mariamman Temple. Includes a temple pickup option for your convenience.",
    "Kapaleeshwarar Temple Official Store": "Kapaleeshwarar Temple Official Store",
    "Purchase authentic prasadam, merchandise, and pooja items directly from Kapaleeshwarar Temple. Includes a temple pickup option for your convenience.": "Purchase authentic prasadam, merchandise, and pooja items directly from Kapaleeshwarar Temple. Includes a temple pickup option for your convenience.",
    "Brihadeeswarar Temple Official Store": "Brihadeeswarar Temple Official Store",
    "Purchase authentic prasadam, merchandise, and pooja items directly from Brihadeeswarar Temple. Includes a temple pickup option for your convenience.": "Purchase authentic prasadam, merchandise, and pooja items directly from Brihadeeswarar Temple. Includes a temple pickup option for your convenience."
  },
  'ta': {
    "Divine Brass Oil Lamp (Diya)": "தெய்வீக பித்தளை விளக்கு (தியா)",
    "Traditional brass oil lamp, perfect for daily pooja and special occasions. Heavy base, premium quality.": "பாரம்பரிய பித்தளை எண்ணெய் விளக்கு, தினசரி பூஜை மற்றும் சிறப்பு சந்தர்ப்பங்களுக்கு ஏற்றது.",
    "Premium Kumkum & Turmeric Sachet Set": "பிரீமியம் குங்குமம் மற்றும் மஞ்சள் செட்",
    "Auspicious set of pure kumkum and turmeric from the temple premises, blessed by the priests.": "கோவில் வளாகத்தில் இருந்து தூய்மையான குங்குமம் மற்றும் மஞ்சள் செட்.",
    "Handcrafted Toran / Door Hanging": "கைவினை தோரணம் / கதவு தொங்கும்",
    "Beautiful marigold and mango leaf design door hanging to welcome prosperity.": "செழிப்பு வரவேற்க அழகிய சாமந்தி மற்றும் மா இலை தோரணம்.",
    "Om & Swastika Wall Hanging": "ஓம் & ஸ்வஸ்திகா சுவர் தொங்கும்",
    "Metal alloy wall hanging with traditional symbols for peace and good fortune.": "அமைதி மற்றும் நல்ல அதிர்ஷ்டத்திற்காக பாரம்பரிய சின்னங்களுடன் சுவர் தொங்கும்.",
    "Customized Temple T-Shirt (Unisex)": "தனிப்பயனாக்கப்பட்ட கோவில் டி-சர்ட்",
    "100% Cotton t-shirt featuring the temple deity's artwork. Available in multiple sizes.": "கோவில் தெய்வத்தின் கலைப்படைப்புடன் 100% பருத்தி டி-சர்ட்.",
    "Framed Deity Photo (8x10)": "தெய்வத்தின் புகைப்படம்",
    "High-resolution photo print of the main deity, beautifully framed in synthetic wood.": "முக்கிய தெய்வத்தின் உயர் தெளிவுத்திறன் கொண்ட புகைப்படம்.",
    "Silver Vel (Spear) Replica": "வெள்ளி வேல்",
    "Miniature silver-plated Vel, the divine weapon of Lord Murugan.": "முருகப் பெருமானின் தெய்வீக ஆயுதமான வெள்ளி பூசப்பட்ட வேல்.",
    "Crystal Shiva Lingam": "படிக சிவ லிங்கம்",
    "Small pure crystal (Sphatik) Shiva Lingam for home worship.": "வீட்டு வழிபாட்டிற்கான சிறிய தூய படிக சிவ லிங்கம்.",
    "Photos": "புகைப்படங்கள்",
    "Merchandise": "பொருட்கள்",
    "Lamps": "விளக்குகள்",
    "Idols": "சிலைகள்",
    "Hangings": "தோரணங்கள்",
    "Sachets": "பாக்கெட்டுகள்",
    "Apparel": "ஆடைகள்",
    "Palani Murugan Temple Official Store": "பழனி முருகன் கோவில் அதிகாரப்பூர்வ கடை",
    "Purchase authentic prasadam, merchandise, and pooja items directly from Palani Murugan Temple. Includes a temple pickup option for your convenience.": "பழனி முருகன் கோவிலில் இருந்து நேரடியாக பிரசாதம் மற்றும் பூஜை பொருட்களை வாங்குங்கள்.",
    "Madurai Meenakshi Temple Official Store": "மதுரை மீனாட்சி கோவில் அதிகாரப்பூர்வ கடை",
    "Purchase authentic prasadam, merchandise, and pooja items directly from Madurai Meenakshi Temple. Includes a temple pickup option for your convenience.": "மதுரை மீனாட்சி கோவிலில் இருந்து நேரடியாக பிரசாதம் மற்றும் பூஜை பொருட்களை வாங்குங்கள்.",
    "Srirangam Temple Official Store": "ஸ்ரீரங்கம் கோவில் அதிகாரப்பூர்வ கடை",
    "Purchase authentic prasadam, merchandise, and pooja items directly from Srirangam Temple. Includes a temple pickup option for your convenience.": "ஸ்ரீரங்கம் கோவிலில் இருந்து நேரடியாக பிரசாதம் மற்றும் பூஜை பொருட்களை வாங்குங்கள்.",
    "Tiruvannamalai Arunachaleswarar Temple Official Store": "திருவண்ணாமலை அருணாசலேஸ்வரர் கோவில் அதிகாரப்பூர்வ கடை",
    "Purchase authentic prasadam, merchandise, and pooja items directly from Tiruvannamalai Arunachaleswarar Temple. Includes a temple pickup option for your convenience.": "திருவண்ணாமலை கோவிலில் இருந்து நேரடியாக பிரசாதம் மற்றும் பூஜை பொருட்களை வாங்குங்கள்.",
    "Rameswaram Temple Official Store": "ராமேஸ்வரம் கோவில் அதிகாரப்பூர்வ கடை",
    "Purchase authentic prasadam, merchandise, and pooja items directly from Rameswaram Temple. Includes a temple pickup option for your convenience.": "ராமேஸ்வரம் கோவிலில் இருந்து நேரடியாக பிரசாதம் மற்றும் பூஜை பொருட்களை வாங்குங்கள்.",
    "Chidambaram Natarajar Temple Official Store": "சிதம்பரம் நடராஜர் கோவில் அதிகாரப்பூர்வ கடை",
    "Purchase authentic prasadam, merchandise, and pooja items directly from Chidambaram Natarajar Temple. Includes a temple pickup option for your convenience.": "சிதம்பரம் நடராஜர் கோவிலில் இருந்து நேரடியாக பிரசாதம் மற்றும் பூஜை பொருட்களை வாங்குங்கள்.",
    "Tiruchendur Murugan Temple Official Store": "திருச்செந்தூர் முருகன் கோவில் அதிகாரப்பூர்வ கடை",
    "Purchase authentic prasadam, merchandise, and pooja items directly from Tiruchendur Murugan Temple. Includes a temple pickup option for your convenience.": "திருச்செந்தூர் முருகன் கோவிலில் இருந்து நேரடியாக பிரசாதம் மற்றும் பூஜை பொருட்களை வாங்குங்கள்.",
    "Samayapuram Mariamman Temple Official Store": "சமயபுரம் மாரியம்மன் கோவில் அதிகாரப்பூர்வ கடை",
    "Purchase authentic prasadam, merchandise, and pooja items directly from Samayapuram Mariamman Temple. Includes a temple pickup option for your convenience.": "சமயபுரம் மாரியம்மன் கோவிலில் இருந்து நேரடியாக பிரசாதம் மற்றும் பூஜை பொருட்களை வாங்குங்கள்.",
    "Kapaleeshwarar Temple Official Store": "கபாலீஸ்வரர் கோவில் அதிகாரப்பூர்வ கடை",
    "Purchase authentic prasadam, merchandise, and pooja items directly from Kapaleeshwarar Temple. Includes a temple pickup option for your convenience.": "கபாலீஸ்வரர் கோவிலில் இருந்து நேரடியாக பிரசாதம் மற்றும் பூஜை பொருட்களை வாங்குங்கள்.",
    "Brihadeeswarar Temple Official Store": "பிரகதீஸ்வரர் கோவில் அதிகாரப்பூர்வ கடை",
    "Purchase authentic prasadam, merchandise, and pooja items directly from Brihadeeswarar Temple. Includes a temple pickup option for your convenience.": "பிரகதீஸ்வரர் கோவிலில் இருந்து நேரடியாக பிரசாதம் மற்றும் பூஜை பொருட்களை வாங்குங்கள்."
  }
};

const otherLangs = ['hi', 'kn', 'mr', 'gu'];
for (const l of otherLangs) {
  translations[l] = {};
  for (const [key, val] of Object.entries(translations['ta'])) {
    translations[l][key] = val; // Placeholder for other langs to ensure it works
  }
}

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
