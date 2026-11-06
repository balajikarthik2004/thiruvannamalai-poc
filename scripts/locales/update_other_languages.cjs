const fs = require('fs');
const path = require('path');
const localesDir = path.join(__dirname, '../../src/locales');

// We will load the English file, and for each key, provide a translated value for hi, kn, mr, gu.
// Since there are many, we will do some basic replacements.

function translate(text, lang) {
  if (!text) return text;
  
  // Basic UI
  const basic = {
    "Temple Stores": { hi: "मंदिर के स्टोर", kn: "ದೇವಾಲಯದ ಅಂಗಡಿಗಳು", mr: "मंदिराची दुकाने", gu: "મંદિરની દુકાનો" },
    "Purchase authentic prasadam, sacred idols, and merchandise directly from temple premises.": {
      hi: "मंदिर परिसर से सीधे प्रामाणिक प्रसादम, पवित्र मूर्तियां और माल खरीदें।",
      kn: "ದೇವಾಲಯದ ಆವರಣದಿಂದ ನೇರವಾಗಿ ಅಧಿಕೃತ ಪ್ರಸಾದ, ಪವಿತ್ರ ವಿಗ್ರಹಗಳು ಮತ್ತು ಸರಕುಗಳನ್ನು ಖರೀದಿಸಿ.",
      mr: "मंदिराच्या आवारातून थेट अस्सल प्रसादम, पवित्र मूर्ती आणि माल खरेदी करा.",
      gu: "મંદિર પરિસરમાંથી સીધા અધિકૃત પ્રસાદ, પવિત્ર મૂર્તિઓ અને માલ ખરીદો."
    }
  };
  if (basic[text] && basic[text][lang]) return basic[text][lang];

  // Store suffix
  let isStoreName = text.endsWith("Official Store");
  if (isStoreName) {
    let baseEn = text.replace(" Official Store", "");
    let baseT = translateTempleName(baseEn, lang);
    const suffix = { hi: " आधिकारिक स्टोर", kn: " ಅಧಿಕೃತ ಅಂಗಡಿ", mr: " अधिकृत दुकान", gu: " અધિકૃત દુકાન" };
    return baseT + suffix[lang];
  }

  // Store description
  if (text.startsWith("Purchase authentic prasadam, merchandise, and pooja items directly from ") && text.endsWith(". Includes a temple pickup option for your convenience.")) {
    let baseEn = text.replace("Purchase authentic prasadam, merchandise, and pooja items directly from ", "").replace(". Includes a temple pickup option for your convenience.", "");
    let baseT = translateTempleName(baseEn, lang);
    const pre = { hi: "सीधे ", kn: "ನೇರವಾಗಿ ", mr: "थेट ", gu: "સીધા " };
    const post = {
      hi: " से प्रामाणिक प्रसाद, माल और पूजा का सामान खरीदें। आपकी सुविधा के लिए मंदिर पिकअप विकल्प शामिल है।",
      kn: " ನಿಂದ ಅಧಿಕೃತ ಪ್ರಸಾದ, ಸರಕುಗಳು ಮತ್ತು ಪೂಜಾ ವಸ್ತುಗಳನ್ನು ಖರೀದಿಸಿ. ನಿಮ್ಮ ಅನುಕೂಲಕ್ಕಾಗಿ ದೇವಾಲಯದ ಪಿಕಪ್ ಆಯ್ಕೆಯನ್ನು ಒಳಗೊಂಡಿದೆ.",
      mr: " मधून अस्सल प्रसाद, माल आणि पूजेचे साहित्य खरेदी करा. तुमच्या सोयीसाठी मंदिर पिकअप पर्याय समाविष्ट आहे.",
      gu: " થી અધિકૃત પ્રસાદ, માલસામાન અને પૂજાની વસ્તુઓ ખરીદો. તમારી સુવિધા માટે મંદિર પિકઅપ વિકલ્પ સામેલ છે."
    };
    return pre[lang] + baseT + post[lang];
  }
  
  // Products
  const products = {
    "Divine Brass Oil Lamp (Diya)": { hi: "दिव्य पीतल का तेल का दीपक (दीया)", kn: "ದೈವಿಕ ಹಿತ್ತಾಳೆ ತೈಲ ದೀಪ (ದಿಯಾ)", mr: "दिव्य पितळेचा तेलाचा दिवा (दिवा)", gu: "દિવ્ય પિત્તળનો તેલનો દીવો (દીવો)" },
    "Premium Kumkum & Turmeric Sachet Set": { hi: "प्रीमियम कुमकुम और हल्दी पाउच सेट", kn: "ಪ್ರೀಮಿಯಂ ಕುಂಕುಮ ಮತ್ತು ಅರಿಶಿನ ಸ್ಯಾಚೆಟ್ ಸೆಟ್", mr: "प्रीमियम कुंकू आणि हळद सॅशेट सेट", gu: "પ્રીમિયમ કુમકુમ અને હળદર સેશેટ સેટ" },
    "Handcrafted Toran / Door Hanging": { hi: "हस्तनिर्मित तोरण / दरवाजा लटकन", kn: "ಕರಕುಶಲ ತೋರಣ / ಬಾಗಿಲು ನೇತಾಡುವಿಕೆ", mr: "हस्तनिर्मित तोरण", gu: "હાથથી બનાવેલ તોરણ" },
    "Om & Swastika Wall Hanging": { hi: "ओम और स्वास्तिक वॉल हैंगिंग", kn: "ಓಂ ಮತ್ತು ಸ್ವಸ್ತಿಕ ಗೋಡೆಯ ನೇತಾಡುವಿಕೆ", mr: "ओम आणि स्वस्तिक वॉल हँगिंग", gu: "ઓમ અને સ્વસ્તિક વોલ હેંગિંગ" },
    "Customized Temple T-Shirt (Unisex)": { hi: "कस्टमाइज्ड टेम्पल टी-शर्ट (यूनिसेक्स)", kn: "ಕಸ್ಟಮೈಸ್ ಮಾಡಿದ ಟೆಂಪಲ್ ಟಿ-ಶರ್ಟ್", mr: "सानुकूलित मंदिर टी-शर्ट", gu: "કસ્ટમાઇઝ્ડ ટેમ્પલ ટી-શર્ટ" },
    "Framed Deity Photo (8x10)": { hi: "फ्रेमयुक्त देवता फोटो", kn: "ಫ್ರೇಮ್ ಮಾಡಿದ ದೇವತೆ ಫೋಟೋ", mr: "फ्रेम केलेला देवतेचा फोटो", gu: "ફ્રેમ કરેલ દેવતાનો ફોટો" },
    "Silver Vel (Spear) Replica": { hi: "सिल्वर वेल (भाला) रेप्लिका", kn: "ಬೆಳ್ಳಿ ವೇಲ್ (ಈಟಿ) ಪ್ರತಿಕೃತಿ", mr: "सिल्व्हर वेल (भाला) प्रतिकृती", gu: "સિલ્વર વેલ (ભાલો) પ્રતિકૃતિ" },
    "Crystal Shiva Lingam": { hi: "क्रिस्टल शिव लिंगम", kn: "ಕ್ರಿಸ್ಟಲ್ ಶಿವ ಲಿಂಗ", mr: "क्रिस्टल शिव लिंग", gu: "ક્રિસ્ટલ શિવ લિંગ" },
    "Photos": { hi: "तस्वीरें", kn: "ಫೋಟೋಗಳು", mr: "फोटो", gu: "ફોટા" },
    "Merchandise": { hi: "माल", kn: "ಸರಕುಗಳು", mr: "माल", gu: "માલ" },
    "Lamps": { hi: "दीपक", kn: "ದೀಪಗಳು", mr: "दिवे", gu: "દીવા" },
    "Idols": { hi: "मूर्तियां", kn: "ವಿಗ್ರಹಗಳು", mr: "मूर्ती", gu: "મૂર્તિઓ" },
    "Hangings": { hi: "लटकन", kn: "ನೇತಾಡುವಿಕೆ", mr: "हँगिंग्ज", gu: "હેંગિંગ્સ" },
    "Sachets": { hi: "पाउच", kn: "ಸ್ಯಾಚೆಟ್‌ಗಳು", mr: "पाउचेस", gu: "પાઉચ" },
    "Apparel": { hi: "परिधान", kn: "ಉಡುಪು", mr: "पोशाख", gu: "પોશાક" }
  };
  if (products[text] && products[text][lang]) return products[text][lang];

  return translateTempleName(text, lang) || text; // Fallback to original text if no exact match
}

function translateTempleName(enName, lang) {
  const temples = {
    "Palani Murugan Temple": { hi: "पलानी मुरुगन मंदिर", kn: "ಪಳನಿ ಮುರುಗನ್ ದೇವಾಲಯ", mr: "पलानी मुरुगन मंदिर", gu: "પલાની મુરુગન મંદિર" },
    "Madurai Meenakshi Temple": { hi: "मदुरै मीनाक्षी मंदिर", kn: "ಮದುರೈ ಮೀನಾಕ್ಷಿ ದೇವಾಲಯ", mr: "मदुराई मीनाक्षी मंदिर", gu: "મદુરાઈ મીનાક્ષી મંદિર" },
    "Srirangam Temple": { hi: "श्रीरंगम मंदिर", kn: "ಶ್ರೀರಂಗಂ ದೇವಾಲಯ", mr: "श्रीरंगम मंदिर", gu: "શ્રીરંગમ મંદિર" },
    "Tiruvannamalai Arunachaleswarar Temple": { hi: "तिरुवन्नमलई अरुणाचलेश्वर मंदिर", kn: "ತಿರುವಣ್ಣಾಮಲೈ ಅರುಣಾಚಲೇಶ್ವರ ದೇವಾಲಯ", mr: "तिरुवन्नमलाई अरुणाचलेश्वर मंदिर", gu: "તિરુવન્નામલાઈ અરુણાચલેશ્વર મંદિર" },
    "Rameswaram Temple": { hi: "रामेश्वरम मंदिर", kn: "ರಾಮೇಶ್ವರಂ ದೇವಾಲಯ", mr: "रामेश्वरम मंदिर", gu: "રામેશ્વરમ મંદિર" },
    "Chidambaram Natarajar Temple": { hi: "चिदंबरम नटराज मंदिर", kn: "ಚಿದಂಬರಂ ನಟರಾಜರ್ ದೇವಾಲಯ", mr: "चिदंबरम नटराज मंदिर", gu: "ચિદમ્બરમ નટરાજ મંદિર" },
    "Tiruchendur Murugan Temple": { hi: "तिरुचेंदूर मुरुगन मंदिर", kn: "ತಿರುಚೆಂದೂರ್ ಮುರುಗನ್ ದೇವಾಲಯ", mr: "तिरुचेंदूर मुरुगन मंदिर", gu: "તિરુચેન્દુર મુરુગન મંદિર" },
    "Samayapuram Mariamman Temple": { hi: "समयपुरम मरियम्मन मंदिर", kn: "ಸಮಯಪುರಂ ಮರಿಯಮ್ಮನ್ ದೇವಾಲಯ", mr: "समयपुरम मरिअम्मन मंदिर", gu: "સમયપુરમ મરિયમ્મન મંદિર" },
    "Kapaleeshwarar Temple": { hi: "कपालीश्वरर मंदिर", kn: "ಕಪಾಲೀಶ್ವರರ್ ದೇವಾಲಯ", mr: "कपालेश्वर मंदिर", gu: "કપાલિશ્વરર મંદિર" },
    "Brihadeeswarar Temple": { hi: "बृहदीश्वरर मंदिर", kn: "ಬೃಹದೀಶ್ವರರ್ ದೇವಾಲಯ", mr: "बृहदीश्वर मंदिर", gu: "બૃહદીશ્વરર મંદિર" },
    "Virupaksha Temple": { hi: "विरुपाक्ष मंदिर", kn: "ವಿರೂಪಾಕ್ಷ ದೇವಾಲಯ", mr: "विरुपाक्ष मंदिर", gu: "વિરુપાક્ષ મંદિર" },
    "Udupi Sri Krishna Matha": { hi: "उडुपी श्री कृष्ण मठ", kn: "ಉಡುಪಿ ಶ್ರೀ ಕೃಷ್ಣ ಮಠ", mr: "उडुपी श्री कृष्ण मठ", gu: "ઉડુપી શ્રી કૃષ્ણ મઠ" },
    "Murudeshwara Temple": { hi: "मुरुदेश्वर मंदिर", kn: "ಮುರುಡೇಶ್ವರ ದೇವಾಲಯ", mr: "मुरुदेश्वर मंदिर", gu: "મુરુદેશ્વર મંદિર" },
    "Mahabaleshwara Temple": { hi: "महाबलेश्वर मंदिर", kn: "ಮಹಾಬಲೇಶ್ವರ ದೇವಾಲಯ", mr: "महाबळेश्वर मंदिर", gu: "મહાબળેશ્વર મંદિર" },
    "Chennakeshava Temple": { hi: "चेन्नाकेशव मंदिर", kn: "ಚೆನ್ನಕೇಶವ ದೇವಾಲಯ", mr: "चेन्नाकेशव मंदिर", gu: "ચેન્નાકેશવ મંદિર" },
    "Kukke Subramanya Temple": { hi: "कुक्के सुब्रमण्य मंदिर", kn: "ಕುಕ್ಕೆ ಸುಬ್ರಹ್ಮಣ್ಯ ದೇವಾಲಯ", mr: "कुक्के सुब्रमण्य मंदिर", gu: "કુક્કે સુબ્રમણ્ય મંદિર" },
    "Dharmasthala Temple": { hi: "धर्मस्थल मंदिर", kn: "ಧರ್ಮಸ್ಥಳ ದೇವಾಲಯ", mr: "धर्मस्थळ मंदिर", gu: "ધર્મસ્થલા મંદિર" },
    "Sringeri Sharada Peetham": { hi: "श्रृंगेरी शारदा पीठ", kn: "ಶೃಂಗೇರಿ ಶಾರದಾ ಪೀಠ", mr: "शृंगेरी शारदा पीठ", gu: "શૃંગેરી શારદા પીઠ" },
    "Mookambika Temple": { hi: "मूकाम्बिका मंदिर", kn: "ಮೂಕಾಂಬಿಕಾ ದೇವಾಲಯ", mr: "मूकाम्बिका मंदिर", gu: "મૂકામ્બિકા મંદિર" },
    "Hoysaleswara Temple": { hi: "होयसलेश्वर मंदिर", kn: "ಹೊಯ್ಸಳೇಶ್ವರ ದೇವಾಲಯ", mr: "होयसलेश्वर मंदिर", gu: "હોયસલેશ્વર મંદિર" },
    "Shirdi Sai Baba Temple": { hi: "शिरडी साईं बाबा मंदिर", kn: "ಶಿರಡಿ ಸಾಯಿ ಬಾಬಾ ದೇವಾಲಯ", mr: "शिर्डी साईबाबा मंदिर", gu: "શિરડી સાંઈ બાબા મંદિર" },
    "Siddhivinayak Temple": { hi: "सिद्धिविनायक मंदिर", kn: "ಸಿದ್ಧಿವಿನಾಯಕ ದೇವಾಲಯ", mr: "सिद्धिविनायक मंदिर", gu: "સિદ્ધિવિનાયક મંદિર" },
    "Trimbakeshwar Temple": { hi: "त्र्यंबकेश्वर मंदिर", kn: "ತ್ರ್ಯಂಬಕೇಶ್ವರ ದೇವಾಲಯ", mr: "त्र्यंबकेश्वर मंदिर", gu: "ત્ર્યંબકેશ્વર મંદિર" },
    "Bhimashankar Temple": { hi: "भीमाशंकर मंदिर", kn: "ಭೀಮಾಶಂಕರ ದೇವಾಲಯ", mr: "भीमाशंकर मंदिर", gu: "ભીમાશંકર મંદિર" },
    "Grishneshwar Temple": { hi: "घृष्णेश्वर मंदिर", kn: "ಗ್ರಿಶ್ನೇಶ್ವರ ದೇವಾಲಯ", mr: "घृष्णेश्वर मंदिर", gu: "ઘૃષ્ણેશ્વર મંદિર" },
    "Mahalaxmi Temple": { hi: "महालक्ष्मी मंदिर", kn: "ಮಹಾಲಕ್ಷ್ಮಿ ದೇವಾಲಯ", mr: "महालक्ष्मी मंदिर", gu: "મહાલક્ષ્મી મંદિર" },
    "Shani Shingnapur": { hi: "शनि शिंगणापुर", kn: "ಶನಿ ಶಿಂಗ್ಣಾಪುರ", mr: "शनी शिंगणापूर", gu: "શનિ શિંગણાપુર" },
    "Tulja Bhavani Temple": { hi: "तुलजा भवानी मंदिर", kn: "ತುಳಜಾ ಭವಾನಿ ದೇವಾಲಯ", mr: "तुळजा भवानी मंदिर", gu: "તુલજા ભવાની મંદિર" },
    "Vithoba Temple": { hi: "विठोबा मंदिर", kn: "ವಿಠೋಬಾ ದೇವಾಲಯ", mr: "विठोबा मंदिर", gu: "વિઠોબા મંદિર" },
    "Khandoba Temple": { hi: "खंडोबा मंदिर", kn: "ಖಂಡೋಬಾ ದೇವಾಲಯ", mr: "खंडोबा मंदिर", gu: "ખંડોબા મંદિર" },
    "Somnath Temple": { hi: "सोमनाथ मंदिर", kn: "ಸೋಮನಾಥ ದೇವಾಲಯ", mr: "सोमनाथ मंदिर", gu: "સોમનાથ મંદિર" },
    "Dwarkadhish Temple": { hi: "द्वारकाधीश मंदिर", kn: "ದ್ವಾರಕಾಧೀಶ ದೇವಾಲಯ", mr: "द्वारकाधीश मंदिर", gu: "દ્વારકાધીશ મંદિર" },
    "BAPS Akshardham": { hi: "बीएपीएस अक्षरधाम", kn: "ಬಿಎಪಿಎಸ್ ಅಕ್ಷರಧಾಮ", mr: "बीएपीएस अक्षरधाम", gu: "બીએપીએસ અક્ષરધામ" },
    "Ambaji Temple": { hi: "अंबाजी मंदिर", kn: "ಅಂಬಾಜಿ ದೇವಾಲಯ", mr: "अंबाजी मंदिर", gu: "અંબાજી મંદિર" },
    "Sun Temple": { hi: "सूर्य मंदिर", kn: "ಸೂರ್ಯ ದೇವಾಲಯ", mr: "सूर्य मंदिर", gu: "સૂર્ય મંદિર" },
    "Palitana Jain Temples": { hi: "पालीताना जैन मंदिर", kn: "ಪಾಲಿಟಾನಾ ಜೈನ ದೇವಾಲಯಗಳು", mr: "पालीताना जैन मंदिर", gu: "પાલીતાણા જૈન મંદિરો" },
    "Rukmini Devi Temple": { hi: "रुक्मिणी देवी मंदिर", kn: "ರುಕ್ಮಿಣಿ ದೇವಿ ದೇವಾಲಯ", mr: "रुक्मिणी देवी मंदिर", gu: "રુક્મિણી દેવી મંદિર" },
    "Kalika Mata Temple": { hi: "कालिका माता मंदिर", kn: "ಕಾಳಿಕಾ ಮಾತಾ ದೇವಾಲಯ", mr: "कालिका माता मंदिर", gu: "કાલિકા માતા મંદિર" },
    "Shree Swaminarayan Mandir": { hi: "श्री स्वामीनारायण मंदिर", kn: "ಶ್ರೀ ಸ್ವಾಮಿನಾರಾಯಣ ಮಂದಿರ", mr: "श्री स्वामीनारायण मंदिर", gu: "શ્રી સ્વામિનારાયણ મંદિર" },
    "Ranchhodrai Temple": { hi: "रणछोड़राय मंदिर", kn: "ರಾಂಚೋಡ್ರಾಯ್ ದೇವಾಲಯ", mr: "रणछोडराय मंदिर", gu: "રણછોડરાય મંદિર" }
  };
  return temples[enName] ? temples[enName][lang] : null;
}

const targetLangs = ['hi', 'kn', 'mr', 'gu'];
const enFile = path.join(localesDir, 'en', 'translation.json');
const enData = JSON.parse(fs.readFileSync(enFile, 'utf8'));

for (const lang of targetLangs) {
  const file = path.join(localesDir, lang, 'translation.json');
  if (fs.existsSync(file)) {
    let data = JSON.parse(fs.readFileSync(file, 'utf8'));
    
    for (const [key, _] of Object.entries(enData)) {
      // Overwrite the tamil placeholder with actual translation if available
      const translated = translate(key, lang);
      if (translated && translated !== key) {
        data[key] = translated;
      }
    }
    fs.writeFileSync(file, JSON.stringify(data, null, 2));
    console.log('Updated', lang);
  }
}
