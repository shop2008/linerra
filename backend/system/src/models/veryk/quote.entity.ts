import { Currency } from "./general.entity";
import { InitiationApiReq, InitiationReqVO, DestinationApiReq, DestinationReqVO } from "./address.entity";
import { PackageApiReq, PackageReqVO } from "./package.entity";
import { OptionApiReq, OptionReqVO } from "./option.entity";



export interface QuoteReqVO {
  initiation: InitiationReqVO;
  destination: DestinationReqVO;
  package: PackageReqVO;
  option: OptionReqVO;
  //carrierId?: string;
  //airportTo?: string;
  carrierIds?: string[];
}

export interface QuoteApiReq {
  initiation: InitiationApiReq;
  destination: DestinationApiReq;
  package: PackageApiReq;
  option: OptionApiReq;
  //carrier_id?: string;
  //airport_to?: string;
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



