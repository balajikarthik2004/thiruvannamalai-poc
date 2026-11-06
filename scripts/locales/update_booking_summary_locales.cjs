const fs = require('fs');
const path = require('path');
const localesDir = path.join(__dirname, '../../src/locales');

const uiTranslations = {
  "Enhance your visit!": { 
    ta: "உங்கள் வருகையை சிறப்பாக்குங்கள்!", 
    hi: "अपनी यात्रा को बेहतर बनाएं!", 
    kn: "ನಿಮ್ಮ ಭೇಟಿಯನ್ನು ಹೆಚ್ಚಿಸಿ!", 
    mr: "तुमची भेट वाढवा!", 
    gu: "તમારી મુલાકાતને વધારો!" 
  },
  "Add an Archana Thattu to your booking. Delivered in a 100% biodegradable bag directly to the temple pickup counter. Walk in empty-handed!": { 
    ta: "உங்கள் முன்பதிவில் அர்ச்சனை தட்டை சேர்க்கவும். 100% மக்கும் பையில் நேரடியாக கோவில் கவுண்டரில் வழங்கப்படும்.", 
    hi: "अपनी बुकिंग में एक अर्चना थट्टू जोड़ें। 100% बायोडिग्रेडेबल बैग में सीधे मंदिर के पिकअप काउंटर पर दिया गया।", 
    kn: "ನಿಮ್ಮ ಬುಕಿಂಗ್‌ಗೆ ಅರ್ಚನೆ ತಟ್ಟೆಯನ್ನು ಸೇರಿಸಿ. 100% ಜೈವಿಕ ವಿಘಟನೀಯ ಚೀಲದಲ್ಲಿ ನೇರವಾಗಿ ದೇವಾಲಯದ ಪಿಕಪ್ ಕೌಂಟರ್‌ಗೆ ತಲುಪಿಸಲಾಗುತ್ತದೆ.", 
    mr: "तुमच्या बुकिंगमध्ये अर्चना ताट जोडा. 100% बायोडिग्रेडेबल बॅगमध्ये थेट मंदिर पिकअप काउंटरवर वितरित केले.", 
    gu: "તમારા બુકિંગમાં અર્ચના થાળ ઉમેરો. 100% બાયોડિગ્રેડેબલ બેગમાં સીધા મંદિર પિકઅપ કાઉન્ટર પર પહોંચાડાયેલ." 
  },
  "Add for ₹150": { 
    ta: "₹150க்கு சேர்க்கவும்", 
    hi: "₹150 में जोड़ें", 
    kn: "₹150 ಗೆ ಸೇರಿಸಿ", 
    mr: "₹150 मध्ये जोडा", 
    gu: "₹150 માટે ઉમેરો" 
  },
  "Comprehensive Booking Summary": {
    ta: "முழுமையான முன்பதிவு சுருக்கம்",
    hi: "व्यापक बुकिंग सारांश",
    kn: "ಸಮಗ್ರ ಬುಕಿಂಗ್ ಸಾರಾಂಶ",
    mr: "सर्वसमावेशक बुकिंग सारांश",
    gu: "વ્યાપક બુકિંગ સારાંશ"
  },
  "Darshan Details": {
    ta: "தரிசன விவரங்கள்",
    hi: "दर्शन विवरण",
    kn: "ದರ್ಶನ ವಿವರಗಳು",
    mr: "दर्शन तपशील",
    gu: "દર્શન વિગતો"
  },
  "Prasadam & Archana": {
    ta: "பிரசாதம் & அர்ச்சனை",
    hi: "प्रसाद और अर्चना",
    kn: "ಪ್ರಸಾದ ಮತ್ತು ಅರ್ಚನೆ",
    mr: "प्रसाद आणि अर्चना",
    gu: "પ્રસાદ અને અર્ચના"
  },
  "Zero-Plastic Archana Thattu": {
    ta: "பிளாஸ்டிக் இல்லா அர்ச்சனை தட்டு",
    hi: "जीरो-प्लास्टिक अर्चना थट्टू",
    kn: "ಶೂನ್ಯ ಪ್ಲಾಸ್ಟಿಕ್ ಅರ್ಚನೆ ತಟ್ಟೆ",
    mr: "झिरो-प्लास्टिक अर्चना ताट",
    gu: "ઝીરો-પ્લાસ્ટિક અર્ચના થાળ"
  },
  "Partner flower/rice delivery": {
    ta: "கூட்டாளர் பூ/அரிசி விநியோகம்",
    hi: "पार्टनर फूल/चावल डिलीवरी",
    kn: "ಪಾಲುದಾರ ಹೂವು/ಅಕ್ಕಿ ವಿತರಣೆ",
    mr: "भागीदार फूल/तांदूळ वितरण",
    gu: "ભાગીદાર ફૂલ/ચોખા વિતરણ"
  },
  "Campus Facilities": {
    ta: "வளாக வசதிகள்",
    hi: "परिसर की सुविधाएं",
    kn: "ಆವರಣದ ಸೌಲಭ್ಯಗಳು",
    mr: "परिसरातील सुविधा",
    gu: "સંકુલ સુવિધાઓ"
  },
  "Nights": {
    ta: "இரவுகள்",
    hi: "रातें",
    kn: "ರಾತ್ರಿಗಳು",
    mr: "रात्री",
    gu: "રાતો"
  },
  "Devotees": {
    ta: "பக்தர்கள்",
    hi: "भक्त",
    kn: "ಭಕ್ತರು",
    mr: "भक्त",
    gu: "ભક્તો"
  }
};

const targetLangs = ['en', 'ta', 'hi', 'kn', 'mr', 'gu'];
for (const lang of targetLangs) {
  const file = path.join(localesDir, lang, 'translation.json');
  if (fs.existsSync(file)) {
    let data = JSON.parse(fs.readFileSync(file, 'utf8'));
    for (const [key, tMap] of Object.entries(uiTranslations)) {
      if (lang === 'en') {
        data[key] = key;
      } else if (tMap[lang]) {
        data[key] = tMap[lang];
      }
    }
    fs.writeFileSync(file, JSON.stringify(data, null, 2));
    console.log('Updated', lang);
  }
}
