import { Request, Response } from 'express';
import Dicts from '@linerra/system/src/enum/dicts';

export class DictController {


  async getDicts(req: Request, res: Response) {
    res.ok(Dicts);
  }


}
