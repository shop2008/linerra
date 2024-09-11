import { Currency } from "./general.entity";

export interface BasePackageVO {
  type: string;
  packages: PackageItem[];
}

export interface PackageItem {
  weight: number;
  dimension: PackageItemDimension;
  insurance: number;
}

export interface PackageItemDimension {
  length: number;
  width: number;
  height: number;
}

export interface PackageReqVO extends BasePackageVO {
  //type: string;
  //packages: PackageItemReqVO[];
}

export interface PackageApiReq extends BasePackageVO {
  //type: string;
  //packages: PackageItemApiReq[];
}

export interface PackageEditResVO extends BasePackageVO {
  //type: string;
  //packages: PackageItemReqVO[];
}

// export interface PackageItemReqVO {
//   weight: number;
//   dimension: PackageItemDimensionReqVO;
//   insurance: number;
// }

// export interface PackageItemApiReq {
//   weight: number;
//   dimension: PackageItemDimensionApiReq;
//   insurance: number;
// }

// export interface PackageItemDimensionReqVO {
//   length: number;
//   width: number;
//   height: number;
// }

// export interface PackageItemDimensionApiReq {
//   length: number;
//   width: number;
//   height: number;
// }

export interface PackageDO {
  type: string;
  packages: PackageItemDO[];
}

export interface PackageItemDO {
  waybillNumber?: string;
  weight: number;
  dimension: PackageItemDimensionDO;
  insurance: Currency;
}

export interface PackageItemDimensionDO extends PackageItemDimension {
}

export interface PackageApiRes {
  type: string;
  packages: PackageItemApiRes[];
}

export interface PackageItemApiRes {
  waybill_number: string;
  weight: string;
  dimension: PackageItemDimensionApiRes;
  insurance: Currency;
}

export interface PackageItemDimensionApiRes {
  length: string;
  width: string;
  height: string;
}
