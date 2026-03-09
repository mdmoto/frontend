import Vue from 'vue';
import VueI18n from 'vue-i18n';
import zhLocale from './lang/zh-CN';
import enLocale from './lang/en-US';
import jaLocale from './lang/ja-JP';
import koLocale from './lang/ko-KR';
import arLocale from './lang/ar-SA';
import esLocale from './lang/es-ES';
import frLocale from './lang/fr-FR';
import thLocale from './lang/th-TH';
import deLocale from './lang/de-DE';

import zhCnLocale from 'view-design/src/locale/lang/zh-CN';
import enUsLocale from 'view-design/src/locale/lang/en-US';
import jaJpLocale from 'view-design/src/locale/lang/ja-JP';
import koKrLocale from 'view-design/src/locale/lang/ko-KR';
import arSaLocale from 'view-design/src/locale/lang/ar-SA';
import esEsLocale from 'view-design/src/locale/lang/es-ES';
import frFrLocale from 'view-design/src/locale/lang/fr-FR';
import thThLocale from 'view-design/src/locale/lang/th-TH';
import deDeLocale from 'view-design/src/locale/lang/de-DE';

Vue.use(VueI18n);

// 根据浏览器信息自动设置语言
const navLang = navigator.language;
const localLang = ['zh-CN', 'en-US', 'ja-JP', 'ko-KR', 'ar-SA', 'es-ES', 'fr-FR', 'th-TH', 'de-DE'].includes(navLang) ? navLang : false;
const lang = window.localStorage.getItem('lang') || localLang || 'en-US';

Vue.config.lang = lang;

// 多语言配置 vue-i18n 6.x+
Vue.locale = () => { };
const messages = {
    'zh-CN': Object.assign(zhCnLocale, zhLocale),
    'en-US': Object.assign(enUsLocale, enLocale),
    'ja-JP': Object.assign(jaJpLocale, jaLocale),
    'ko-KR': Object.assign(koKrLocale, koLocale),
    'ar-SA': Object.assign(arSaLocale, arLocale),
    'es-ES': Object.assign(esEsLocale, esLocale),
    'fr-FR': Object.assign(frFrLocale, frLocale),
    'th-TH': Object.assign(thThLocale, thLocale),
    'de-DE': Object.assign(deDeLocale, deLocale)
};
const i18n = new VueI18n({
    locale: lang,
    messages
});

export default i18n;
