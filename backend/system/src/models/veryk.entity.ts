import { AddressType } from '../enum/dicts/addressType';

export type ProvinceReqVO = {
  regionId: string;
  name?: string;
  code?: string;
}

export type ProvinceApiReq = {
  region_id: string;
  name?: string;
  code?: string;
}

export interface QuoteAddressReqVO {
  regionId: string;
  postalCode: string;
  name?: string;
  company?: string;
  mobilePhone?: string;
  province?: string;
  city?: string;
  address?: string;
  address2?: string;
}

export interface QuoteAddressApiReq {
  region_id: string;
  postalcode: string;
  name?: string;
  company?: string;
  mobile_phone?: string;
  province?: string;
  city?: string;
  address?: string;
  address2?: string;
}

export interface QuoteInitiationReqVO extends QuoteAddressReqVO {
}

export interface QuoteInitiationApiReq extends QuoteAddressApiReq {
}

export interface QuoteDestinationReqVO extends QuoteAddressReqVO {
  type?: string;
}

export interface QuoteDestinationApiReq extends QuoteAddressApiReq {
  type?: string;
}


export interface QuotePackageReqVO {
  type: string;
  packages: QuotePackageItemReqVO[];
}

export interface QuotePackageApiReq {
  type: string;
  packages: QuotePackageItemApiReq[];
}

export interface QuotePackageItemReqVO {
  weight: number;
  dimension: QuotePackageItemDimensionReqVO;
  insurance: number;
}

export interface QuotePackageItemApiReq {
  weight: number;
  dimension: QuotePackageItemDimensionApiReq;
  insurance: number;
}

export interface QuotePackageItemDimensionReqVO {
  length: number;
  width: number;
  height: number;
}

export interface QuotePackageItemDimensionApiReq {
  length: number;
  width: number;
  height: number;
}

export interface QuoteOptionReqVO {
  referenceNumber?: string;
  memo?: string;
  vipAccount?: string;
  packingFee?: number;
}

export interface QuoteOptionApiReq {
  reference_number?: string;
  memo?: string;
  vip_account?: string;
  packing_fee?: number;
}

export interface QuoteReqVO {
  initiation: QuoteInitiationReqVO;
  destination: QuoteDestinationReqVO;
  package: QuotePackageReqVO;
  option: QuoteOptionReqVO;
  carrierId?: string;
  airportTo?: string;
  carrierIds?: string[];
}

export interface QuoteApiReq {
  initiation: QuoteInitiationApiReq;
  destination: QuoteDestinationApiReq;
  package: QuotePackageApiReq;
  option: QuoteOptionApiReq;
  carrier_id?: string;
  airport_to?: string;
  carrier_ids?: string[];
}
