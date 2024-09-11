export interface BaseAddressReqVO {
  regionId: string;
  postalCode: string;
  name?: string;
  company?: string;
  phone?: string;
  province?: Province;
  city?: string;
  address?: string;
  address2?: string;
  address3?: string;
}

export interface BaseAddressApiReq {
  region_id: string;
  postalcode: string;
  name?: string;
  company?: string;
  mobile_phone?: string;
  province?: string;
  city?: string;
  address?: string;
  address2?: string;
  address3?: string;
}

export interface InitiationReqVO extends BaseAddressReqVO {
}

export interface InitiationApiReq extends BaseAddressApiReq {
}

export interface DestinationReqVO extends BaseAddressReqVO {
  type?: string;
  email?: string;

}

export interface DestinationApiReq extends BaseAddressApiReq {
  type?: string;

}

export interface Province {
  id: string;
  name: string;
  code: string;
}

export interface InitiationDO extends BaseAddressReqVO {
}

export interface DestinationDO extends BaseAddressReqVO {
  type?: string;
  email?: string;
}

export interface InitiationResVO extends BaseAddressReqVO {
}

export interface DestinationResVO extends BaseAddressReqVO {
  type?: string;
  email?: string;

}

export interface AddressApiRes {
  name: string;
  company: string;
  phone: string;
  email: string;
  region_id: string;
  province: Province;
  city: string;
  district: string;
  address: string;
  address2: string;
  address3: string;
  postalcode: string;
}
