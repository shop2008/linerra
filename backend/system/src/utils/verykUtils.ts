import crypto from 'crypto';
import axios from 'axios';
import { ServiceError } from './serviceError';
import { QuoteApiReq } from '../models/veryk/quote.entity';
import { ProvinceApiReq } from '../models/veryk.entity';
import { ShipmentApiReq } from '../models/veryk/shipment.entity';
import logger from './logger';

const verykApiUrl = process.env.VERYK_API_URL;
const verykAppId = process.env.VERYK_APP_ID;
const verykAppSecret = process.env.VERYK_APP_SECRET;


const ERROR_CODE = 'Veryk.ApiError';

export function buildUrl(action: string): string {
  const params: Record<string, any> = {
    id: verykAppId,
    timestamp: Math.floor(Date.now() / 1000), // ISO8601格式
    action: action,
    format: 'json'
  };

  // 将所有参数key统一改为小写
  const lowercaseParams = Object.keys(params).reduce((acc, key) => {
    acc[key.toLowerCase()] = params[key];
    return acc;
  }, {} as Record<string, any>);

  // 如果有sign，把它去掉
  delete lowercaseParams['sign'];

  // 将参数名按字母顺序排序
  const sortedKeys = Object.keys(lowercaseParams).sort();

  //将每个参数值进行urlEncode
  const queryString = sortedKeys.map(key =>
    `${key}=${encodeURIComponent(lowercaseParams[key])}`
  ).join('&');

  const secret = verykAppSecret as string;

  // 使用 HMAC SHA256 加密
  const hmac = crypto.createHmac('sha256', secret);
  hmac.update(queryString);

  // base64编码，得到签名
  const sign = encodeURIComponent(hmac.digest('base64'));

  return `${verykApiUrl}?${queryString}&sign=${sign}`;
}

export function getResponseData(response: any) {
  if (response.data.status !== 1) {
    //logger.error(response.data);
    throw new ServiceError(response.data.message, ERROR_CODE);
  }
  return response.data.response;
}

export async function getRegion(params: { id?: string }, acceptLanguage?: string) {
  const url = buildUrl('region');
  const headers = acceptLanguage
    ? { 'Accept-Language': acceptLanguage }
    : {};

  let response = await axios.post(url, params, { headers });
  return getResponseData(response);
}

export async function getProvince(params: ProvinceApiReq, acceptLanguage?: string) {
  const url = buildUrl('province');
  const headers = acceptLanguage ? { 'Accept-Language': acceptLanguage } : {};

  let response = await axios.post(url, params, { headers });
  return getResponseData(response);
}

export async function getCarrier(params: { id?: string }, acceptLanguage?: string) {
  const url = buildUrl('carrier');
  const headers = acceptLanguage ? { 'Accept-Language': acceptLanguage } : {};

  let response = await axios.post(url, params, { headers });
  return getResponseData(response);
}

export async function getService(params: { id?: string }, acceptLanguage?: string) {
  const url = buildUrl('service');
  const headers = acceptLanguage ? { 'Accept-Language': acceptLanguage } : {};

  let response = await axios.post(url, params, { headers });
  return getResponseData(response);
}

export async function getAccount(acceptLanguage?: string) {
  const url = buildUrl('account');
  const headers = acceptLanguage ? { 'Accept-Language': acceptLanguage } : {};

  let response = await axios.post(url, {}, { headers });
  return getResponseData(response);
}

export async function quote(params: QuoteApiReq, acceptLanguage?: string) {
  const url = buildUrl('shipment/quote');
  const headers = acceptLanguage ? { 'Accept-Language': acceptLanguage } : {};

  let response = await axios.post(url, params, { headers });
  return getResponseData(response);
}

// export async function submit(params: ShipmentApiReq, acceptLanguage?: string) {
//   const url = buildUrl('shipment/submit');
//   const headers = acceptLanguage ? { 'Accept-Language': acceptLanguage } : {};

//   let response = await axios.post(url, params, { headers });
//   return getResponseData(response);
// }

export async function create(params: ShipmentApiReq, acceptLanguage?: string) {
  const url = buildUrl('shipment/create');
  const headers = acceptLanguage ? { 'Accept-Language': acceptLanguage } : {};

  let response = await axios.post(url, params, { headers });
  return getResponseData(response);
}

export async function shipmentList(params: { page?: number, pageSize?: number, keyword?: string }, acceptLanguage?: string) {
  const url = buildUrl('shipment/list');
  const headers = acceptLanguage ? { 'Accept-Language': acceptLanguage } : {};

  let response = await axios.post(url, params, { headers });
  return getResponseData(response);
}

export async function shipmentDetail(params: { id: string }, acceptLanguage?: string) {
  const url = buildUrl('shipment/detail');
  const headers = acceptLanguage ? { 'Accept-Language': acceptLanguage } : {};

  let response = await axios.post(url, params, { headers });
  return getResponseData(response);
}
