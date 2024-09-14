import { getDefaultCurrency } from "../../constant/verykConstant";
import { PackageApiReq, PackageApiRes, PackageDO, PackageEditResVO, PackageItem, PackageItemApiRes, PackageItemDO, PackageReqVO } from "./package.entity";

// export const packageItemReqVOToApiReq = (packageItemReqVO: PackageItemReqVO): PackageItemApiReq => {
//   return {
//     ...packageItemReqVO
//   }
// };

export const packageReqVOToApiReq = (packageReqVO: PackageReqVO): PackageApiReq => {
  return {
    type: packageReqVO.type,
    packages: packageReqVO.packages,
  };
};

export const packageReqVOToDO = (packageReqVO: PackageReqVO): PackageDO => {
  const { type, packages } = packageReqVO;
  return {
    type,
    packages: packages.map(packageItemToDO),
  }
}

export const packageItemToDO = (packageItem: PackageItem): PackageItemDO => {
  const { weight, dimension, insurance } = packageItem;
  return {
    weight,
    dimension,
    insurance: getDefaultCurrency(insurance),
  }
}

export const packageDOToEditResVO = (packageDO: PackageDO): PackageEditResVO => {
  return {
    type: packageDO.type,
    packages: packageDO.packages.map(packageItemDOToPackageItem),
  }
}

export const packageItemDOToPackageItem = (packageItem: PackageItemDO): PackageItem => {
  const { weight, dimension, insurance } = packageItem;
  return {
    weight,
    dimension,
    insurance: Number(insurance.value),
  }
}

export const packageApiResToDO = (packageApiRes: PackageApiRes): PackageDO => {
  const { type, packages } = packageApiRes;
  return {
    type,
    packages: packages.map(packageItemApiResToDO),
  }
}

export const packageItemApiResToDO = (packageItemApiRes: PackageItemApiRes): PackageItemDO => {
  const { waybill_number, weight, dimension, insurance } = packageItemApiRes;
  return {
    waybillNumber: waybill_number,
    weight: Number(weight),
    dimension: {
      length: Number(dimension.length),
      width: Number(dimension.width),
      height: Number(dimension.height),
    },
    insurance: insurance,
  }
}
