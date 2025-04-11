import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import English from '../src/translates/English'
import Hindi from '../src/translates/Hindi'
import Marathi from '../src/translates/Marathi'

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: English },
      hi: { translation: Hindi },
      mr: { translation: Marathi },
    },
    lng: 'en', // default language
    fallbackLng: 'en', // fallback language
    interpolation: {
      escapeValue: false, // React already does escaping
    },
  });

export default i18n;
