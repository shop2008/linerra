declare namespace VerkType {
  type Currency = {
    code: string;
    symbol: string;
    value: string;
  };

  type Service = {
    id: string;
    code: string;
    name: string;
  };

  type Carrier = {
    id: string;
    code: string;
    groupCode: string;
    name: string;
    regionId: string;
    currency: Currency;
    services: Service[];
  };

  type Region = {
    id: string;
    name: string;
    type: string;
    timezone: string;
  };

  type Province = {
    id: string;
    name: string;
    code: string;
  };

  type QuoteRequest = {
    carrierIds: string[];
    serviceId: string;
    initiation: Destination;
    destination: Destination;
    option: Option;
    package: Package;
  };

  type Destination = {
    address: string;
    address2: string;
    address3: string;
    city: string;
    company: string;
    mobilePhone: string;
    name: string;
    postalCode: string;
    province: string;
    regionId: string;
    type: string;
  };

  type Option = {
    memo: string;
    packingFee: number;
    vipAccount: string;
  };

  type Package = {
    packages: PackageAttribute[];
    type: string;
  };

  type PackageAttribute = {
    dimension?: {
      height: number;
      length: number;
      width: number;
    };
    insurance?: number;
    weight?: number;
  };

  type QuoteResponse = {
    carrierId: string;
    carrierCode: string;
    name: string;
    currency: Currency;
    services: QuoteService[];
  };

  type QuoteService = {
    carrierZoneId: number;
    charge: string;
    chargeDetails: {
      code: string;
      name: string;
      price: number;
    }[];
    code: string;
    eta: string;
    freight: string;
    id: string;
    isManual: number;
    isStandaloneAccount: number;
    marketPrices: any[];
    message: string;
    msrp: string;
    name: string;
    tax: number;
    taxDetails: any[];
    token: string;
    zoneId: string;
    zoneprice: any[];
  };
}
