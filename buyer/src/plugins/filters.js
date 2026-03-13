import * as Foundation from './Foundation.js';

import store from '@/vuex/store';

/**
 * 金钱单位置换  2999 --> 2,999.00
 * 支持多币种转换：基于 priceUsd 进行换算
 * @param val 原始金额 (通常是 priceUsd)
 * @param unit 默认单位 (如果是 USD 模式则会被覆盖)
 * @returns {*}
 */
export function unitPrice (val, unit) {
  if (val === undefined || val === null) val = 0;
  
  // 获取当前币种和汇率表
  const currency = store.state.currency || 'USD';
  const fxRates = store.state.fxRates || { USD: 1.0 };
  
  let displayValue = val;
  let displayUnit = unit || '￥';

  // 汇率转换逻辑
  if (currency !== 'USD') {
    const rate = fxRates[currency];
    if (rate) {
      displayValue = val * rate;
    }
  }

  // 根据不同币种设置符号
  switch (currency) {
    case 'USD': displayUnit = '$'; break;
    case 'CNY': displayUnit = '￥'; break;
    case 'JPY': displayUnit = 'JP¥'; break;
    case 'EUR': displayUnit = '€'; break;
    case 'HKD': displayUnit = 'HK$'; break;
    default: displayUnit = currency + ' ';
  }

  let price = Foundation.formatPrice(displayValue);
  
  return displayUnit + price;
}

/**
 * 处理unix时间戳，转换为可阅读时间格式
 * @param unix
 * @param format
 * @returns {*|string}
 */
export function unixToDate (unix, format) {
  if (!unix) return '';
  let _format = format || 'yyyy-MM-dd hh:mm:ss';
  const d = new Date(unix * 1000);
  const o = {
    'M+': d.getMonth() + 1,
    'd+': d.getDate(),
    'h+': d.getHours(),
    'm+': d.getMinutes(),
    's+': d.getSeconds(),
    'q+': Math.floor((d.getMonth() + 3) / 3),
    S: d.getMilliseconds()
  };
  if (/(y+)/.test(_format)) _format = _format.replace(RegExp.$1, (d.getFullYear() + '').substr(4 - RegExp.$1.length));
  for (const k in o) {
    if (new RegExp('(' + k + ')').test(_format)) _format = _format.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)));
  };
  return _format;
}

/**
 * 替换地址栏 逗号分隔为空格分隔
 */
export function unitAddress (val) {
  if (!val) return '';
  return val.replace(/,/g, ' ');
}

/**
 * 13888888888 -> 138****8888
 * @param mobile
 * @returns {*}
 */
export function secrecyMobile (mobile) {
  mobile = String(mobile);
  if (!/\d{11}/.test(mobile)) {
    return mobile;
  }
  return mobile.replace(/(\d{3})(\d{4})(\d{4})/, '$1****$3');
}
