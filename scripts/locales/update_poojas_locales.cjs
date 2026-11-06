const fs = require('fs');
const path = require('path');

const newTranslations = {
  en: {
    "Thiruvannamalai Pooja": "Thiruvannamalai Pooja",
    "Thiru Neeru Pooja": "Thiru Neeru Pooja",
    "Kalasa Pooja": "Kalasa Pooja",
    "Uchikala Pooja": "Uchikala Pooja",
    "Sayaratchai Pooja": "Sayaratchai Pooja",
    "Arthajama Pooja": "Arthajama Pooja",
    "Iranda Kala Pooja": "Iranda Kala Pooja",
    "Palliyarai Pooja": "Palliyarai Pooja",
    "Vishvarupa Darshanam": "Vishvarupa Darshanam",
    "Vila Pooja": "Vila Pooja",
    "Sirukala Shanti Pooja": "Sirukala Shanti Pooja",
    "Kala Shanthi Pooja": "Kala Shanthi Pooja",
    "Sayaraksha Pooja": "Sayaraksha Pooja",
    "Rakkala Pooja": "Rakkala Pooja",
    "Thiruvanandal Pooja": "Thiruvanandal Pooja",
    "Vizha Pooja / Kalasandhi Pooja": "Vizha Pooja / Kalasandhi Pooja",
    "Thrikalasandhi / Uchikkala Pooja (Noon)": "Thrikalasandhi / Uchikkala Pooja (Noon)",
    "Maalai Pooja (Evening)": "Maalai Pooja (Evening)",
    "Ardhajama Pooja (Night Pooja)": "Ardhajama Pooja (Night Pooja)",
    "Palliarai Pooja (Bedtime Ceremony)": "Palliarai Pooja (Bedtime Ceremony)"
  },
  ta: {
    "Thiruvannamalai Pooja": "திருவண்ணாமலை பூஜை",
    "Thiru Neeru Pooja": "திருநீறு பூஜை",
    "Kalasa Pooja": "கலச பூஜை",
    "Uchikala Pooja": "உச்சிக்கால பூஜை",
    "Sayaratchai Pooja": "சாயரட்சை பூஜை",
    "Arthajama Pooja": "அர்த்தஜாம பூஜை",
    "Iranda Kala Pooja": "இரண்டாம் கால பூஜை",
    "Palliyarai Pooja": "பள்ளியறை பூஜை",
    "Vishvarupa Darshanam": "விஸ்வரூப தரிசனம்",
    "Vila Pooja": "விழா பூஜை",
    "Sirukala Shanti Pooja": "சிறுகால சாந்தி பூஜை",
    "Kala Shanthi Pooja": "கால சாந்தி பூஜை",
    "Sayaraksha Pooja": "சாயரட்சை பூஜை",
    "Rakkala Pooja": "ராக்கால பூஜை",
    "Thiruvanandal Pooja": "திருவனந்தல் பூஜை",
    "Vizha Pooja / Kalasandhi Pooja": "விழா பூஜை / காலசந்தி பூஜை",
    "Thrikalasandhi / Uchikkala Pooja (Noon)": "திரிகாலசந்தி / உச்சிக்கால பூஜை",
    "Maalai Pooja (Evening)": "மாலை பூஜை",
    "Ardhajama Pooja (Night Pooja)": "அர்த்தஜாம பூஜை",
    "Palliarai Pooja (Bedtime Ceremony)": "பள்ளியறை பூஜை"
  },
  hi: {
    "Thiruvannamalai Pooja": "तिरुवन्नामलई पूजा",
    "Thiru Neeru Pooja": "तिरु नीरु पूजा",
    "Kalasa Pooja": "कलश पूजा",
    "Uchikala Pooja": "उचिकाला पूजा",
    "Sayaratchai Pooja": "सायरत्चाई पूजा",
    "Arthajama Pooja": "अर्थजामा पूजा",
    "Iranda Kala Pooja": "इरंडा काला पूजा",
    "Palliyarai Pooja": "पल्लियाराय पूजा",
    "Vishvarupa Darshanam": "विश्वरूप दर्शन",
    "Vila Pooja": "विला पूजा",
    "Sirukala Shanti Pooja": "सिरुकाल शांति पूजा",
    "Kala Shanthi Pooja": "काल शांति पूजा",
    "Sayaraksha Pooja": "सयारक्षा पूजा",
    "Rakkala Pooja": "रक्काला पूजा",
    "Thiruvanandal Pooja": "थिरुवनंदल पूजा",
    "Vizha Pooja / Kalasandhi Pooja": "विझा पूजा / कालसंधि पूजा",
    "Thrikalasandhi / Uchikkala Pooja (Noon)": "त्रिकालसंधि / उचिक्काला पूजा (दोपहर)",
    "Maalai Pooja (Evening)": "मालाई पूजा (शाम)",
    "Ardhajama Pooja (Night Pooja)": "अर्धजामा पूजा (रात की पूजा)",
    "Palliarai Pooja (Bedtime Ceremony)": "पल्लियाराय पूजा (शयन आरती)"
  },
  kn: {
    "Thiruvannamalai Pooja": "ತಿರುವண்ணாமಲೈ ಪೂಜೆ",
    "Thiru Neeru Pooja": "ತಿರು ನೀರು ಪೂಜೆ",
    "Kalasa Pooja": "ಕಳಸ ಪೂಜೆ",
    "Uchikala Pooja": "ಉಚಿಕಾಲ ಪೂಜೆ",
    "Sayaratchai Pooja": "ಸಾಯರಚ್ಚೈ ಪೂಜೆ",
    "Arthajama Pooja": "ಅರ್ಥಜಾಮ ಪೂಜೆ",
    "Iranda Kala Pooja": "ಇರಂಡ ಕಾಲ ಪೂಜೆ",
    "Palliyarai Pooja": "ಪಳ್ಳಿಯರೈ ಪೂಜೆ",
    "Vishvarupa Darshanam": "ವಿಶ್ವರೂಪ ದರ್ಶನಂ",
    "Vila Pooja": "ವಿಲಾ ಪೂಜೆ",
    "Sirukala Shanti Pooja": "ಸಿರುಕಾಲ ಶಾಂತಿ ಪೂಜೆ",
    "Kala Shanthi Pooja": "ಕಾಲ ಶಾಂತಿ ಪೂಜೆ",
    "Sayaraksha Pooja": "ಸಾಯರಕ್ಷಾ ಪೂಜೆ",
    "Rakkala Pooja": "ರಕ್ಕಾಲ ಪೂಜೆ",
    "Thiruvanandal Pooja": "ತಿರುವನಂದಲ್ ಪೂಜೆ",
    "Vizha Pooja / Kalasandhi Pooja": "ವಿಝಾ ಪೂಜೆ / ಕಾಲಸಂಧಿ ಪೂಜೆ",
    "Thrikalasandhi / Uchikkala Pooja (Noon)": "ತ್ರಿಕಾಲಸಂಧಿ / ಉಚಿಕ್ಕಾಲ ಪೂಜೆ (ಮಧ್ಯಾಹ್ನ)",
    "Maalai Pooja (Evening)": "ಮಾಲೈ ಪೂಜೆ (ಸಂಜೆ)",
    "Ardhajama Pooja (Night Pooja)": "ಅರ್ಧಜಾಮ ಪೂಜೆ (ರಾತ್ರಿ ಪೂಜೆ)",
    "Palliarai Pooja (Bedtime Ceremony)": "ಪಳ್ಳಿಯರೈ ಪೂಜೆ (ಮಲಗುವ ಸಮಯದ ಆಚರಣೆ)"
  },
  gu: {
    "Thiruvannamalai Pooja": "તિરુવન્નામલઈ પૂજા",
    "Thiru Neeru Pooja": "તિરુ નીરુ પૂજા",
    "Kalasa Pooja": "કળશ પૂજા",
    "Uchikala Pooja": "ઉચિકાલા પૂજા",
    "Sayaratchai Pooja": "સાયરત્ચાઈ પૂજા",
    "Arthajama Pooja": "અર્થજામા પૂજા",
    "Iranda Kala Pooja": "ઇરંડા કાલા પૂજા",
    "Palliyarai Pooja": "પલ્લિયારાય પૂજા",
    "Vishvarupa Darshanam": "વિશ્વરૂપ દર્શન",
    "Vila Pooja": "વિલા પૂજા",
    "Sirukala Shanti Pooja": "સિરુકાલા શાંતિ પૂજા",
    "Kala Shanthi Pooja": "કાલા શાંતિ પૂજા",
    "Sayaraksha Pooja": "સાયરક્ષા પૂજા",
    "Rakkala Pooja": "રક્કાલા પૂજા",
    "Thiruvanandal Pooja": "થિરુવનંદલ પૂજા",
    "Vizha Pooja / Kalasandhi Pooja": "વિઝા પૂજા / કાલસંધિ પૂજા",
    "Thrikalasandhi / Uchikkala Pooja (Noon)": "ત્રિકાલસંધિ / ઉચિક્કાલા પૂજા (બપોર)",
    "Maalai Pooja (Evening)": "માલાઈ પૂજા (સાંજ)",
    "Ardhajama Pooja (Night Pooja)": "અર્ધજામા પૂજા (રાત્રિ પૂજા)",
    "Palliarai Pooja (Bedtime Ceremony)": "પલ્લિયારાય પૂજા (શયન આરતી)"
  },
  mr: {
    "Thiruvannamalai Pooja": "तिरुवन्नामलई पूजा",
    "Thiru Neeru Pooja": "तिरु नीरु पूजा",
    "Kalasa Pooja": "कलश पूजा",
    "Uchikala Pooja": "उचिकाला पूजा",
    "Sayaratchai Pooja": "सायरत्चाई पूजा",
    "Arthajama Pooja": "अर्थजामा पूजा",
    "Iranda Kala Pooja": "इरंडा काला पूजा",
    "Palliyarai Pooja": "पल्लियाराय पूजा",
    "Vishvarupa Darshanam": "विश्वरूप दर्शन",
    "Vila Pooja": "विला पूजा",
    "Sirukala Shanti Pooja": "सिरुकाल शांती पूजा",
    "Kala Shanthi Pooja": "काल शांती पूजा",
    "Sayaraksha Pooja": "सयारक्षा पूजा",
    "Rakkala Pooja": "रक्काला पूजा",
    "Thiruvanandal Pooja": "थिरुवनंदल पूजा",
    "Vizha Pooja / Kalasandhi Pooja": "विझा पूजा / कालसंधी पूजा",
    "Thrikalasandhi / Uchikkala Pooja (Noon)": "त्रिकालसंधी / उचिक्काला पूजा (दुपार)",
    "Maalai Pooja (Evening)": "मालाई पूजा (संध्याकाळ)",
    "Ardhajama Pooja (Night Pooja)": "अर्धजामा पूजा (रात्रीची पूजा)",
    "Palliarai Pooja (Bedtime Ceremony)": "पल्लियाराय पूजा (शयन आरती)"
  }
};

const localesDir = path.join(__dirname, '..', '..', 'src', 'locales');
const langs = Object.keys(newTranslations);

for (const lang of langs) {
  const file = path.join(localesDir, lang, 'translation.json');
  if (fs.existsSync(file)) {
    const current = JSON.parse(fs.readFileSync(file, 'utf8'));
    const merged = { ...current, ...newTranslations[lang] };
    fs.writeFileSync(file, JSON.stringify(merged, null, 2), 'utf8');
    console.log(`Updated ${lang}`);
  }
}
