import { VerykGeneralService } from "@linerra/system/src/services/veryk/verykGeneralService";
import { Request, Response } from 'express';

const verykGeneralService = VerykGeneralService.instance;

export class VerykGeneralController {

  async getCarriers(req: Request, res: Response) {
    const carriers = verykGeneralService.getCarriers();
    res.ok(carriers);
  }

  async getRegions(req: Request, res: Response) {
    const regions = await verykGeneralService.getRegions(req.context.acceptLanguage);
    res.ok(regions);
  }

  async getProvinces(req: Request, res: Response) {
    const regionId = req.query.regionId;
    const provinces = await verykGeneralService.getProvinces(regionId as string, req.context.acceptLanguage);
    res.ok(provinces);
  }

}
