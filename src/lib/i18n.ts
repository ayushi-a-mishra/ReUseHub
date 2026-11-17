import { useState, useEffect } from 'react'

export type Language = 'en' | 'hi'

const translations = {
  en: {
    tagline: 'Give it a second life',
    heroTitlePrefix: 'Give campus materials',
    heroTitleAccent: 'a second life.',
    heroSubtitle: 'Pass down textbooks, lab hardware, dorm essentials, and electronics to peers. Zero money involved. Verified campus handovers only.',
    searchPlaceholder: 'Search textbooks, Arduino kits, calculators, monitors...',
    searchBtn: 'Search',
    browseItems: 'Browse Items',
    campusImpact: 'Campus Impact',
    adminConsole: 'Admin Console',
    listItem: 'List Item',
    myRequests: 'My Requests',
    myListings: 'My Listings',
    history: 'History',
    wishlist: 'Wishlist',
    free: 'Free',
    materialsReused: 'Materials Reused',
    wasteAvoided: 'Landfill Waste Diverted',
    moneySaved: 'Student Money Saved',
    howItWorks: 'How Campus Reuse Works',
    trustedCommunity: 'Trusted by Students, Faculty & Staff',
    rankings: 'Department Circularity Leaderboard',
    ctaTitle: 'Have unused textbooks or electronics sitting in your dorm?',
    ctaSubtitle: "Don't let valuable tools collect dust or end up in landfills. Give them a second life today.",
    listNow: 'List an Item Now',
    browseAll: 'Browse All Materials',
    requestModalTitle: 'Request Campus Material',
    chat: 'Handover Chat',
    qrCode: 'Handover QR Code',
    scanQr: 'Scan QR at Handover',
  },
  hi: {
    tagline: 'सामग्रियों को दें दूसरा जीवन',
    heroTitlePrefix: 'कैंपस सामग्रियों को दें',
    heroTitleAccent: 'एक नया जीवन।',
    heroSubtitle: 'सहपाठियों को पाठ्यपुस्तकें, लैब उपकरण, छात्रावास की वस्तुएं और इलेक्ट्रॉनिक्स सौंपें। कोई पैसा शामिल नहीं। केवल सत्यापित कैंपस आदान-प्रदान।',
    searchPlaceholder: 'किताबें, आर्डुइनो किट, कैलकुलेटर खोजें...',
    searchBtn: 'खोजें',
    browseItems: 'सामग्रियां खोजें',
    campusImpact: 'कैंपस प्रभाव',
    adminConsole: 'व्यवस्थापक कंसोल',
    listItem: 'सामग्री जोड़ें',
    myRequests: 'मेरे अनुरोध',
    myListings: 'मेरी सामग्रियां',
    history: 'इतिहास',
    wishlist: 'इच्छा सूची',
    free: 'निःशुल्क',
    materialsReused: 'पुनः उपयोग की गई वस्तुएं',
    wasteAvoided: 'कचरा जाने से रोका',
    moneySaved: 'छात्रों की बचत',
    howItWorks: 'कैंपस में पुनः उपयोग कैसे काम करता है',
    trustedCommunity: 'छात्रों और शिक्षकों द्वारा विश्वसनीय',
    rankings: 'विभाग चक्रीय रैंकिंग',
    ctaTitle: 'क्या आपके हॉस्टल में अप्रयुक्त किताबें या गैजेट्स रखे हैं?',
    ctaSubtitle: 'महत्वपूर्ण उपकरणों पर धूल न जमने दें। आज ही अपने किसी साथी छात्र को दें।',
    listNow: 'अभी सामग्री जोड़ें',
    browseAll: 'सभी सामग्रियां देखें',
    requestModalTitle: 'सामग्री के लिए अनुरोध करें',
    chat: 'हैंडओवर बातचीत',
    qrCode: 'हैंडओवर क्यूआर कोड',
    scanQr: 'हैंडओवर पर क्यूआर स्कैन करें',
  },
}

type TranslationKey = keyof typeof translations.en

let currentLang: Language = (typeof window !== 'undefined' && (localStorage.getItem('reusehub_lang') as Language)) || 'en'
const listeners = new Set<(lang: Language) => void>()

export function setLanguage(lang: Language) {
  currentLang = lang
  if (typeof window !== 'undefined') {
    localStorage.setItem('reusehub_lang', lang)
  }
  listeners.forEach((listener) => listener(lang))
}

export function getLanguage(): Language {
  return currentLang
}

export function useTranslation() {
  const [lang, setLangState] = useState<Language>(currentLang)

  useEffect(() => {
    const handleLangChange = (newLang: Language) => {
      setLangState(newLang)
    }
    listeners.add(handleLangChange)
    return () => {
      listeners.delete(handleLangChange)
    }
  }, [])

  const t = (key: TranslationKey): string => {
    return translations[lang][key] || translations.en[key] || key
  }

  return {
    t,
    lang,
    setLanguage,
  }
}
