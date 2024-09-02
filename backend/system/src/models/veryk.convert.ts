import { ProvinceApiReq, ProvinceReqVO } from "./veryk.entity";

export const provinceReqVOToApiReq = (provinceReqVO: ProvinceReqVO): ProvinceApiReq => {
  const { regionId, ...rest } = provinceReqVO;
  return {
    region_id: regionId,
    ...rest,
  };
};


