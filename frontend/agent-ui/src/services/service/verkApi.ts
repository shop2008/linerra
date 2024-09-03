import { request } from '@umijs/max';

export async function getAvailableCarriers(options?: Record<string, any>) {
  return request<API.R<Array<string>>>('/api/veryk/shipment/getAvailableCarriers', {
    method: 'GET',
    ...(options || {}),
  });
}

export async function getCarriers(options?: Record<string, any>) {
  return request<API.R<Array<VerkType.Carrier>>>('/api/veryk/general/getCarriers', {
    method: 'GET',
    ...(options || {}),
  });
}

export async function getProvinces(regionId: string, options?: Record<string, any>) {
  return request<API.R<Array<VerkType.Province>>>('/api/veryk/general/getProvinces', {
    method: 'GET',
    params: { regionId },
    ...(options || {}),
  });
}

export async function getRegions(options?: Record<string, any>) {
  return request<API.R<Array<VerkType.Region>>>('/api/veryk/general/getRegions', {
    method: 'GET',
    ...(options || {}),
  });
}

export async function postQuote(data: VerkType.QuoteRequest, options?: Record<string, any>) {
  return request<API.R<Array<VerkType.QuoteResponse>>>('/api/veryk/shipment/quote', {
    method: 'POST',
    ...(options || {}),
  });
}
