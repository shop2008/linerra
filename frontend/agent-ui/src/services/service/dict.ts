import { request } from '@umijs/max';


/** 获取字典数据
 * @param options 请求配置
 * @returns 字典数据
 */
export async function getDicts(options?: Record<string, any>) {
  return request<API.R<Record<string, API.Service.DictItem[]>>>('/api/dict/getDicts', {
    method: 'GET',
    ...(options || {}),
  });
}
