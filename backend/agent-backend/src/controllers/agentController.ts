import { Request, Response } from 'express';
import { CognitoService } from '@linerra/system/src/services/cognitoService';
import logger from '@linerra/system/src/utils/logger';
import { ErrorShowType } from '@linerra/system/src/enum/errorShowType';
import { SessionService } from '@linerra/system/src/services/sessionService';
import { accessVerifier, idTokenVerifier } from '@linerra/system/src/utils/tokenVerifier';


const cognitoService = CognitoService.instance;
const sessionService = SessionService.instance;


export class AgentController {
  async signUp(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      const result = await cognitoService.signUp(email, password);
      res.ok({ result });
    } catch (error) {
      logger.error("Error registering agent", error);
      res.fail('Error registering agent', 'ErrorRegisteringAgent', ErrorShowType.ERROR_MESSAGE, 400);
    }
  }

  async signIn(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      const result = await cognitoService.signIn(email, password);
      res.ok(result);
    } catch (error) {
      logger.error("Error signing in agent", error);
      res.fail('Authentication failed', 'AuthenticationFailed', ErrorShowType.ERROR_MESSAGE, 401);
    }
  }

  async getUserInfo(req: Request, res: Response) {
    try {
      const result = await cognitoService.getUser(req.context.accessToken);
      const userInfo = result?.UserAttributes?.reduce((acc: any, attr: any) => {
        if (attr.Name && attr.Value) {
          acc[attr.Name] = attr.Value;
        }
        return acc;
      }, { username: result?.Username });
      res.ok(userInfo);
    } catch (error) {
      logger.error("Error getting user info", error);
      res.fail('Error getting user info', 'ErrorGettingUserInfo', ErrorShowType.ERROR_MESSAGE, 401);
    }
  }

  async refreshToken(req: Request, res: Response) {
    try {
      //console.log(req.context);
      const { accessToken, idToken, sessionId, user: { sub: userId } } = req.context;
      const accessPayload = await accessVerifier.verify(accessToken);
      const idPayload = await idTokenVerifier.verify(idToken);
      const now = Date.now();
      // 检查两个token是否已过期
      if (accessPayload.exp * 1000 < now || idPayload.exp * 1000 < now) {
        return res.fail('Token expired', 'TokenExpired', ErrorShowType.ERROR_MESSAGE, 401);
      }

      // 检查是否有一个token距离过期时间不到15分钟
      const fifteenMinutesInMs = 15 * 60 * 1000;
      const accessTokenExpiresIn = accessPayload.exp * 1000 - now;
      const idTokenExpiresIn = idPayload.exp * 1000 - now;

      if (accessTokenExpiresIn > fifteenMinutesInMs && idTokenExpiresIn > fifteenMinutesInMs) {
        return res.ok({ accessToken, idToken });
      }

      const result = await cognitoService.handleTokenRefresh(userId, sessionId as string, accessToken as string, idToken as string);
      res.ok(result);
    } catch (error) {
      logger.error("Error refreshing token", error);
      res.fail('Error refreshing token', 'ErrorRefreshingToken', ErrorShowType.ERROR_MESSAGE, 401);
    }
  }

  async initiateGoogleSignIn(req: Request, res: Response) {
    try {
      const url = await cognitoService.initiateGoogleSignIn();
      res.ok({ url });
    } catch (error) {
      logger.error("Error initiating Google sign-in", error);
      res.fail('Error initiating Google sign-in', 'ErrorInitiatingGoogleSignIn', ErrorShowType.ERROR_MESSAGE, 400);
    }
  }

  async handleGoogleCallback(req: Request, res: Response) {
    try {
      const { code } = req.query;
      if (typeof code !== 'string') {
        throw new Error('Invalid code');
      }
      const result = await cognitoService.handleGoogleCallback(code);
      res.ok(result);
    } catch (error) {
      //logger.error("Error handling Google callback", error);
      res.fail('Error handling Google callback', 'ErrorHandlingGoogleCallback', ErrorShowType.ERROR_MESSAGE, 400);
    }
  }
}
