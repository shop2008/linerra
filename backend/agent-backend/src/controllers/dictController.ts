import { Request, Response } from 'express';
import Dicts from '@linerra/system/src/enum/dicts';
import { agentSessionService } from 'system/src/services/agentSessionService';

export class DictController {


  async getDicts(req: Request, res: Response) {
    // const session = await agentSessionService.getSession(req.context.user.sub, req.context.sessionId);
    // console.log("session", session);
    // await agentSessionService.updateSessionLastUsed(req.context.user.sub, req.context.sessionId);
    // const updatedSession = await agentSessionService.getSession(req.context.user.sub, req.context.sessionId);
    // console.log("updatedSession", updatedSession);

    res.ok(Dicts);
  }


}
