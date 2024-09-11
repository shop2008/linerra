
export interface OptionReqVO {
  //referenceNumber?: string;
  memo?: string;
  //vipAccount?: string;
  packingFee?: number;
}

export interface OptionApiReq {
  reference_number?: string;
  memo?: string;
  //vip_account?: string;
  packing_fee?: number;
}


export interface OptionDO {
  memo?: string;
  packingFee?: number;
}

export interface OptionEditResVO {
  memo?: string;
  packingFee?: number;
}
