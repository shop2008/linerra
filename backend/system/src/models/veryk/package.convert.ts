import { getDefaultCurrency } from "../../constant/verykConstant";
import { PackageApiReq, PackageDO, PackageItem, PackageItemDO, PackageReqVO } from "./package.entity";

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
