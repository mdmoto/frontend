import { commonRequest } from '@/plugins/request.js';

/**
 * 获取展示用汇率列表
 */
export function getFxRates() {
  return commonRequest({
    url: '/buyer/other/maollar/rates',
    method: 'get'
  });
}

/**
 * 获取支持的法币列表
 */
export function getSupportedCurrencies() {
  return commonRequest({
    url: '/buyer/other/maollar/supported-currencies',
    method: 'get'
  });
}
