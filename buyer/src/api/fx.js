import request from '@/plugins/request.js';

/**
 * 获取展示用汇率列表
 */
export function getFxRates() {
  return request({
    url: '/buyer/maollar/rates',
    method: 'get'
  });
}

/**
 * 获取支持的法币列表
 */
export function getSupportedCurrencies() {
  return request({
    url: '/buyer/maollar/supported-currencies',
    method: 'get'
  });
}
