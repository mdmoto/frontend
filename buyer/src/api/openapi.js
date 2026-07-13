import request from '@/plugins/request';
import { Method } from '@/plugins/request';

/**
 * 获取当前用户的API密钥
 */
export function getMyApiKey() {
  return request({
    url: '/buyer/openapi/key',
    method: Method.GET,
    needToken: true
  });
}

/**
 * 生成/重置API密钥
 */
export function generateApiKey() {
  return request({
    url: '/buyer/openapi/key/generate',
    method: Method.POST,
    needToken: true
  });
}
