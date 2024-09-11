import { InitiationApiReq, DestinationApiReq, InitiationReqVO, DestinationReqVO, InitiationDO, DestinationDO, AddressApiRes, InitiationResVO, DestinationResVO } from "./address.entity";
import { PackageApiReq, PackageApiRes, PackageDO, PackageEditResVO, PackageReqVO } from "./package.entity";
import { OptionApiReq, OptionDO, OptionEditResVO, OptionReqVO } from "./option.entity";
import { Currency, ServiceApiRes } from "./general.entity";

export interface ShipmentReqVO {
  //token?: string;
  number?: string;
  serviceId: string;
  //state: "open" | "order";
  initiation: InitiationReqVO;
  destination: DestinationReqVO;
  package: PackageReqVO;
  option: OptionReqVO;
}

export interface ShipmentApiReq {
  //token: string;
  service_id: string;
  payment_method: "account";
  state: "order";
  initiation: InitiationApiReq;
  destination: DestinationApiReq;
  package: PackageApiReq;
  option: OptionApiReq;
}

export interface ShipmentDO {
  number: string;
  waybillNumber?: string;
  serviceId: string;
  status: "open" | "submitted" | "completed" | "cancelled";
  initiationRegionId?: string;
  destinationRegionId?: string;
  initiation: InitiationDO;
  destination: DestinationDO;
  package: PackageDO;
  option: OptionDO;
  price?: Price;
  payments?: PaymentDO[];
  total?: Currency;
  submittedAt?: string;

  stationId: string;
  sortTimestamp: string;
  //GSI1PK: "SHIPMENT_NO";
}

export interface ShipmentEditResVO {
  number: string;
  serviceId: string;
  initiation: InitiationResVO;
  destination: DestinationResVO;
  package: PackageEditResVO;
  option: OptionEditResVO;
  //price: Price;
  //payments: PaymentDO[];
  //total: Currency;
  //submittedAt: string;
}

export interface ShipmentDetailResVO {
  number: string;
  waybillNumber: string;
  serviceId: string;
  status: "open" | "submitted" | "completed" | "cancelled";
  initiationRegionId: string;
  destinationRegionId: string;
  initiation: InitiationDO;
  destination: DestinationDO;
  package: PackageDO;
  option: OptionDO;
  price: Price;
  payments: PaymentDO[];
  total: Currency;
  submittedAt: string;
}

export interface Price {
  msrp?: Currency;
  details: PriceDetail[];
  charges: PriceDetail[];
}

export interface PriceDetail {
  code: string;
  description: string;
  price: Currency;
}




export interface PaymentDO {
  dateTime: string;
  description: string;
  subtotal: Currency;
}

export interface ShipmentApiRes {
  id: string;
  reference_number: string;
  waybill_number: string;
  initiation_region_id: string;
  destination_region_id: string;
  initiation: {
    en_US: AddressApiRes;
  };
  destination: {
    en_US: AddressApiRes;
  };
  service: ServiceApiRes;
  iselink: number;
  package: PackageApiRes;
  price: Price;
  state: {
    id: string;
    code: string;
    name: string;
  };
  payments: {
    [key: string]: PaymentApiRes;
  };
  total: Currency;
  message: string;
  creationtime: string;
}

export interface PaymentApiRes {
  datetime: string;
  description: string;
  subtotal: Currency;
}
