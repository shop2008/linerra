import { Request, Response } from 'express';
import { VerykShipmentService } from '@linerra/system/src/services/veryk/verykShipmentService';
import { QuoteResVO } from 'system/src/models/veryk/quote.entity';

const verykShipmentService = VerykShipmentService.instance;

export class VerykShipmentController {

  async getAvailableCarriers(req: Request, res: Response) {
    const carriers: string[] = await verykShipmentService.getAvailableCarriers();
    res.ok(carriers);
  }

  async quote(req: Request, res: Response) {
    const quotes: QuoteResVO[] = await verykShipmentService.quote(req.body, req.context.acceptLanguage);
    res.ok(quotes);
  }


}
