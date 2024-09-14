import { InitiationApiReq, InitiationReqVO, DestinationApiReq, DestinationReqVO, InitiationDO, DestinationDO, AddressApiRes } from "./address.entity";



export const initiationReqVOToApiReq = (initiationReqVO: InitiationReqVO): InitiationApiReq => {
  const { regionId, postalCode, phone, province, ...rest } = initiationReqVO;
  return {
    region_id: regionId,
    postalcode: postalCode,
    ...(phone && { mobile_phone: phone }),
    ...(province && { province: province.code }),
    ...rest,
  };
};

export const destinationReqVOToApiReq = (destinationReqVO: DestinationReqVO): DestinationApiReq => {
  const { regionId, postalCode, phone, province, ...rest } = destinationReqVO;
  return {
    region_id: regionId,
    postalcode: postalCode,
    ...(phone && { mobile_phone: phone }),
    ...(province && { province: province.code }),
    ...rest,
  };
};

export const initiationReqVOToDO = (initiationReqVO: InitiationReqVO): InitiationDO => {
  return { ...initiationReqVO };
};

export const destinationReqVOToDO = (destinationReqVO: DestinationReqVO): DestinationDO => {
  return { ...destinationReqVO };
};

export const addressApiResToInitiationDO = (addressApiRes: AddressApiRes): InitiationDO => {
  const { region_id, postalcode, ...rest } = addressApiRes;
  return {
    regionId: region_id,
    postalCode: postalcode,
    ...rest,
  };
};

export const addressApiResToDestinationDO = (addressApiRes: AddressApiRes): DestinationDO => {
  const { region_id, postalcode, ...rest } = addressApiRes;
  return {
    regionId: region_id,
    postalCode: postalcode,
    ...rest,
  };
};
