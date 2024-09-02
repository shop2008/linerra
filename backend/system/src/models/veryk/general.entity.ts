
export interface Currency {
  code: string;
  symbol: string;
  value: string;
}

export interface Service {
  id: string;
  code: string;
  name: string;
}

export interface Carrier {
  id: string;
  code: string;
  groupCode: string;
  name: string;
  regionId: string;
  currency: Currency;
  services: Service[];
}

export interface Region {
  id: string;
  name: string;
  type: string;
  timezone: string;
}

export interface Province {
  id: string;
  name: string;
  code: string;
}
