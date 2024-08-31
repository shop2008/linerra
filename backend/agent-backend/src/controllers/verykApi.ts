import { Request, Response } from 'express';
import { getAccount, getCarrier, getProvince, getRegion, getService, quote } from '@linerra/system/src/utils/verykUtils';
import { ProvinceReqVO, QuoteApiReq, QuoteReqVO } from '@linerra/system/src/models/veryk.entity';
import { provinceReqVOToApiReq, quoteReqVOToApiReq } from 'system/src/models/veryk.convert';

export class VerykApi {


  async getRegion(req: Request, res: Response) {
    const region = await getRegion({ id: req.query.id as string }, req.headers['accept-language'] as string);
    res.ok(region);
  }


  async getProvince(req: Request, res: Response) {
    const province = await getProvince(provinceReqVOToApiReq(req.body as ProvinceReqVO), req.headers['accept-language'] as string);
    res.ok(province);

  }

  async getCarrier(req: Request, res: Response) {
    const carrier = await getCarrier({ id: req.query.id as string }, req.headers['accept-language'] as string);
    res.ok(carrier);
  }

  async getService(req: Request, res: Response) {
    const service = await getService({ id: req.query.id as string }, req.headers['accept-language'] as string);
    res.ok(service);
  }

  async getAccount(req: Request, res: Response) {
    const account = await getAccount(req.headers['accept-language'] as string);
    res.ok(account);
  }

  async quote(req: Request, res: Response) {
    const quoteRes = await quote(quoteReqVOToApiReq(req.body as QuoteReqVO), req.headers['accept-language'] as string);
    res.ok(quoteRes);
  }
}
