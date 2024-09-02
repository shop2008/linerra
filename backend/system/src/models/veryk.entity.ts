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

