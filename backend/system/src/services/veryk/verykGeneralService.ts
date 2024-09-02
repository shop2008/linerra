import { Carrier } from "../../models/veryk/general.entity";
import { verykCarriers } from "../../constant/verykConstant";
import { getProvince, getRegion } from "system/src/utils/verykUtils";

export class VerykGeneralService {
  public static instance: VerykGeneralService = new VerykGeneralService();

  getCarriers(): Carrier[] {
    return verykCarriers;
  }

  async getRegions(acceptLanguage?: string) {
    const regions = await getRegion({}, acceptLanguage);
    return regions;
  }

  async getProvinces(regionId: string, acceptLanguage?: string) {
    const provinces = await getProvince({ region_id: regionId }, acceptLanguage);
    return provinces;
  }

}
