import { Currency } from "./general.entity";

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

export interface QuoteApiRes {
  carrier_id: string;
  currency: Currency;
  name: string;
  services: ServiceApiRes[];
  carrier_code: string;
}

export interface ServiceApiRes {
  id: string;
  name: string;
  code: string;
  charge: string;
  is_manual: number;
  freight: string;
  msrp: string;
  eta: string;
  tax: number;
  message: string;
  zone_id: string;
  carrier_zone_id: number;
  marketPrices: any[];
  charge_details: ChargeDetail[];
  token: string;
  is_standalone_account: number;
  tax_details: TaxDetail[];
}

export interface TaxDetail {
  name: string;
  rate: number;
  price: number;
}

export interface ChargeDetail {
  code: string;
  name: string;
  price: number;
}


export interface QuoteResVO {
  carrierId: string;
  currency: Currency;
  name: string;
  services: ServiceResVO[];
  carrierCode: string;
}

export interface ServiceResVO {
  id: string;
  name: string;
  code: string;
  charge: string;
  isManual: number;
  freight: string;
  msrp: string;
  eta: string;
  tax: number;
  message: string;
  zoneId: string;
  carrierZoneId: number;
  marketPrices: any[];
  chargeDetails: ChargeDetail[];
  token: string;
  isStandaloneAccount: number;
  taxDetails: TaxDetail[];
}



