import { QuoteInitiationApiReq, QuoteInitiationReqVO, QuoteDestinationApiReq, QuoteDestinationReqVO, QuotePackageApiReq, QuotePackageReqVO, QuoteOptionApiReq, QuoteOptionReqVO, QuoteApiReq, QuoteReqVO, QuotePackageItemReqVO, QuotePackageItemApiReq, QuoteApiRes, QuoteResVO, ServiceApiRes, ServiceResVO } from "./quote.entity";

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


export const serviceApiResToResVO = (serviceApiRes: ServiceApiRes): ServiceResVO => {
  const { is_manual, zone_id, carrier_zone_id, charge_details, is_standalone_account, tax_details, ...rest } = serviceApiRes;
  return {
    isManual: is_manual,
    zoneId: zone_id,
    carrierZoneId: carrier_zone_id,
    chargeDetails: charge_details,
    isStandaloneAccount: is_standalone_account,
    taxDetails: tax_details,
    ...rest,
  };
};

export const quoteApiResToResVO = (quoteApiRes: QuoteApiRes): QuoteResVO => {
  const { carrier_id, services, carrier_code, ...rest } = quoteApiRes;
  return {
    carrierId: carrier_id,
    services: services.map(serviceApiResToResVO),
    carrierCode: carrier_code,
    ...rest,
  };
};
