import { ProvinceApiReq, ProvinceReqVO, QuoteApiReq, QuoteDestinationApiReq, QuoteDestinationReqVO, QuoteInitiationApiReq, QuoteInitiationReqVO, QuoteOptionApiReq, QuoteOptionReqVO, QuotePackageApiReq, QuotePackageItemApiReq, QuotePackageItemReqVO, QuotePackageReqVO, QuoteReqVO } from "./veryk.entity";

export const provinceReqVOToApiReq = (provinceReqVO: ProvinceReqVO): ProvinceApiReq => {
  const { regionId, ...rest } = provinceReqVO;
  return {
    region_id: regionId,
    ...rest,
  };
};

export const quoteInitiationReqVOToApiReq = (quoteInitiationReqVO: QuoteInitiationReqVO): QuoteInitiationApiReq => {
  const { regionId, postalCode, mobilePhone, ...rest } = quoteInitiationReqVO;
  return {
    region_id: regionId,
    postalcode: postalCode,
    ...(mobilePhone && { mobile_phone: mobilePhone }),
    ...rest,
  };
};

export const quoteDestinationReqVOToApiReq = (quoteDestinationReqVO: QuoteDestinationReqVO): QuoteDestinationApiReq => {
  const { regionId, postalCode, mobilePhone, ...rest } = quoteDestinationReqVO;
  return {
    region_id: regionId,
    postalcode: postalCode,
    ...(mobilePhone && { mobile_phone: mobilePhone }),
    ...rest,
  };
};

export const quotePackageItemReqVOToApiReq = (quotePackageItemReqVO: QuotePackageItemReqVO): QuotePackageItemApiReq => {
  return {
    ...quotePackageItemReqVO
  }
};

export const quotePackageReqVOToApiReq = (quotePackageReqVO: QuotePackageReqVO): QuotePackageApiReq => {
  return {
    type: quotePackageReqVO.type,
    packages: quotePackageReqVO.packages.map(quotePackageItemReqVOToApiReq),
  };
};

export const quoteOptionReqVOToApiReq = (quoteOptionReqVO: QuoteOptionReqVO): QuoteOptionApiReq => {
  const { referenceNumber, vipAccount, packingFee, ...rest } = quoteOptionReqVO;
  return {
    ...(referenceNumber && { reference_number: referenceNumber }),
    ...(vipAccount && { vip_account: vipAccount }),
    ...(packingFee && { packing_fee: packingFee }),
    ...rest,
  };
};

export const quoteReqVOToApiReq = (quoteReqVO: QuoteReqVO): QuoteApiReq => {
  const { initiation, destination, package: pkg, option, carrierId, airportTo, carrierIds } = quoteReqVO;
  return {
    initiation: quoteInitiationReqVOToApiReq(initiation),
    destination: quoteDestinationReqVOToApiReq(destination),
    package: quotePackageReqVOToApiReq(pkg),
    option: quoteOptionReqVOToApiReq(option),
    carrier_id: carrierId,
    airport_to: airportTo,
    carrier_ids: carrierIds,
  };
};
