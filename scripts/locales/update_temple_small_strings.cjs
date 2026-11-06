const fs = require('fs');
const path = require('path');

const newTranslations = {
  en: {
    "District": "District",
    "hr": "hr",
    "Expected": "Expected",
    "Crowd": "Crowd",
    "2000+ years": "2000+ years",
    "Tier 1 Major Kshetram": "Tier 1 Major Kshetram",
    "Mylapore, Chennai": "Mylapore, Chennai",
    "Palani": "Palani",
    "Madurai": "Madurai",
    "Srirangam": "Srirangam",
    "Tiruvannamalai": "Tiruvannamalai",
    "Rameswaram": "Rameswaram",
    "Chidambaram": "Chidambaram",
    "Tiruchendur": "Tiruchendur",
    "Samayapuram": "Samayapuram",
    "Thanjavur": "Thanjavur"
  },
  ta: {
    "District": "மாவட்டம்",
    "hr": "மணி",
    "Expected": "எதிர்பார்க்கப்படுகிறது",
    "Crowd": "கூட்டம்",
    "2000+ years": "2000+ ஆண்டுகள்",
    "Tier 1 Major Kshetram": "முக்கிய திருத்தலம்",
    "Mylapore, Chennai": "மயிலாப்பூர், சென்னை",
    "Palani": "பழனி",
    "Madurai": "மதுரை",
    "Srirangam": "ஸ்ரீரங்கம்",
    "Tiruvannamalai": "திருவண்ணாமலை",
    "Rameswaram": "ராமேஸ்வரம்",
    "Chidambaram": "சிதம்பரம்",
    "Tiruchendur": "திருச்செந்தூர்",
    "Samayapuram": "சமயபுரம்",
    "Thanjavur": "தஞ்சாவூர்"
  },
  hi: {
    "District": "ज़िला",
    "hr": "घंटा",
    "Expected": "अपेक्षित",
    "Crowd": "भीड़",
    "2000+ years": "2000+ वर्ष",
    "Tier 1 Major Kshetram": "प्रमुख तीर्थ स्थल",
    "Mylapore, Chennai": "मायलापुर, चेन्नई",
    "Palani": "पलानी",
    "Madurai": "मदुरै",
    "Srirangam": "श्रीरंगम",
    "Tiruvannamalai": "तिरुवन्नामलई",
    "Rameswaram": "रामेश्वरम",
    "Chidambaram": "चिदंबरम",
    "Tiruchendur": "थिरुचेंदुर",
    "Samayapuram": "समयपुरम",
    "Thanjavur": "तंजावुर"
  },
  kn: {
    "District": "ಜಿಲ್ಲೆ",
    "hr": "ಗಂಟೆ",
    "Expected": "ನಿರೀಕ್ಷಿಸಲಾಗಿದೆ",
    "Crowd": "ಜನದಟ್ಟಣೆ",
    "2000+ years": "2000+ ವರ್ಷಗಳು",
    "Tier 1 Major Kshetram": "ಪ್ರಮುಖ ಕ್ಷೇತ್ರಂ",
    "Mylapore, Chennai": "ಮೈಲಾಪುರ, ಚೆನ್ನೈ",
    "Palani": "ಪಳನಿ",
    "Madurai": "ಮಧುರೈ",
    "Srirangam": "ಶ್ರೀರಂಗಂ",
    "Tiruvannamalai": "ತಿರುವண்ணாமಲೈ",
    "Rameswaram": "ರಾಮೇಶ್ವರಂ",
    "Chidambaram": "ಚಿದಂಬರಂ",
    "Tiruchendur": "ತಿರುಚೆಂದೂರು",
    "Samayapuram": "ಸಮಯಪುರಂ",
    "Thanjavur": "ತಂಜಾವೂರು"
  },
  gu: {
    "District": "જિલ્લો",
    "hr": "કલાક",
    "Expected": "અપેક્ષિત",
    "Crowd": "ભીડ",
    "2000+ years": "2000+ વર્ષો",
    "Tier 1 Major Kshetram": "મુખ્ય યાત્રાધામ",
    "Mylapore, Chennai": "માયલાપોર, ચેન્નાઈ",
    "Palani": "પલાની",
    "Madurai": "મદુરાઈ",
    "Srirangam": "શ્રીરંગમ",
    "Tiruvannamalai": "તિરુવન્નામલઈ",
    "Rameswaram": "રામેશ્વરમ",
    "Chidambaram": "ચિદમ્બરમ",
    "Tiruchendur": "થિરુચેન્દુર",
    "Samayapuram": "સમયપુરમ",
    "Thanjavur": "તંજાવુર"
  },
  mr: {
    "District": "जिल्हा",
    "hr": "तास",
    "Expected": "अपेक्षित",
    "Crowd": "गर्दी",
    "2000+ years": "2000+ वर्षे",
    "Tier 1 Major Kshetram": "प्रमुख तीर्थक्षेत्र",
    "Mylapore, Chennai": "मायलापूर, चेन्नई",
    "Palani": "पलानी",
    "Madurai": "मदुराई",
    "Srirangam": "श्रीरंगम",
    "Tiruvannamalai": "तिरुवन्नामलई",
    "Rameswaram": "रामेश्वरम",
    "Chidambaram": "चिदंबरम",
    "Tiruchendur": "थिरुचेंदुर",
    "Samayapuram": "समयपुरम",
    "Thanjavur": "तंजावर"
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
