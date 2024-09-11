import { OptionApiReq, OptionReqVO } from "./option.entity";

export const optionReqVOToApiReq = (optionReqVO: OptionReqVO): OptionApiReq => {
  const { packingFee, ...rest } = optionReqVO;
  return {
    //...(referenceNumber && { reference_number: referenceNumber }),
    //...(vipAccount && { vip_account: vipAccount }),
    ...(packingFee && { packing_fee: packingFee }),
    ...rest,
  };
};
