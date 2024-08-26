import { BaseDictEnum } from "./baseDictEnum";

export class PackageType extends BaseDictEnum<string> {
  static readonly ENV = new PackageType('ENV', 'packageType.env', "env", 'Env');
  static readonly PAK = new PackageType('PAK', 'packageType.pak', "pak", 'Pak');
  static readonly PARCEL = new PackageType('PARCEL', 'packageType.parcel', "parcel", 'Parcel');
  static readonly PALLET = new PackageType('PALLET', 'packageType.pallet', "pallet", 'Pallet');

}
