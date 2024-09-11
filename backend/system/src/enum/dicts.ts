import { AddressType } from './dicts/addressType';
import { PackageType } from './dicts/packageType';
import { ShipmentStatus } from './dicts/shipmentStatus';

const Dicts = {
  "addressType": Object.values(AddressType),
  "packageType": Object.values(PackageType),
  "shipmentStatus": Object.values(ShipmentStatus),
};

export default Dicts;
