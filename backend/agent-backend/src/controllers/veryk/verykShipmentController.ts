import { Request, Response } from 'express';
import { VerykShipmentService } from '@linerra/system/src/services/veryk/verykShipmentService';
import { QuoteResVO } from '@linerra/system/src/models/veryk/quote.entity';
import { shipmentDetail, shipmentList } from 'system/src/utils/verykUtils';

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

  async save(req: Request, res: Response) {
    const shipment = await verykShipmentService.save(req.body, req.context.user);
    res.ok(shipment);
  }

  async get(req: Request, res: Response) {
    const shipment = await verykShipmentService.get(req.params.number);
    res.ok(shipment);
  }

  async getPage(req: Request, res: Response) {
    const shipments = await verykShipmentService.getPage(Number(req.query.limit), req.context.user);
    res.ok(shipments);
  }

  async submit(req: Request, res: Response) {
    const submit = await verykShipmentService.submit(req.body, req.context.user, req.context.acceptLanguage);
    res.ok(submit);
  }

  async shipmentList(req: Request, res: Response) {
    const shipments = await shipmentList({ keyword: req.query.keyword as string }, req.context.acceptLanguage);
    res.ok(shipments);
  }

  async shipmentDetail(req: Request, res: Response) {
    const shipment = await shipmentDetail({ id: req.params.id }, req.context.acceptLanguage);
    res.ok(shipment);
  }


}
