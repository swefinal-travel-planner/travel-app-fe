import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const resources = {
  en: {
    translation: {
      welcome: "Welcome",
      change_language: "Change Language",
    },
  },
  vi: {
    translation: {
      welcome: "Chào mừng",
      change_language: "Thay đổi ngôn ngữ",
    },
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: "en",
  fallbackLng: "en",
  interpolation: { escapeValue: false },
});

export default i18n;
