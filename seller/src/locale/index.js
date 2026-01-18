import Vue from 'vue';
import VueI18n from 'vue-i18n';
import zhLocale from './lang/zh-CN';
import enLocale from './lang/en-US';
import jaLocale from './lang/ja-JP';

import zhCnLocale from 'view-design/src/locale/lang/zh-CN';
import enUsLocale from 'view-design/src/locale/lang/en-US';
import jaJpLocale from 'view-design/src/locale/lang/ja-JP';

Vue.use(VueI18n);

// 根据浏览器信息自动设置语言
const navLang = navigator.language;
const localLang = (navLang === 'zh-CN' || navLang === 'en-US' || navLang === 'ja-JP') ? navLang : false;
const lang = window.localStorage.lang || localLang || 'zh-CN';

// 多语言配置
const messages = {
    'zh-CN': Object.assign(zhCnLocale, zhLocale),
    'en-US': Object.assign(enUsLocale, enLocale),
    'ja-JP': Object.assign(jaJpLocale, jaLocale)
};

const i18n = new VueI18n({
    locale: lang,
    messages
});

export default i18n;
