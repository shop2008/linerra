import { BaseDictEnum } from "./baseDictEnum";

export class AddressType extends BaseDictEnum<string> {
  static readonly RESIDENTIAL = new AddressType('RESIDENTIAL', 'residentType.residential', "residential", '民用住宅');
  static readonly COMMERCIAL = new AddressType('COMMERCIAL', 'residentType.commercial', "commercial", '商业地址');
}
