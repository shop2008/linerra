import { Request, Response, NextFunction } from 'express';
import { accessVerifier } from '@linerra/system/src/utils/tokenVerifier';


export const auth = async (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const payload = await accessVerifier.verify(token);

    // 直接从JWT payload中提取用户信息
    if (!req.context) {
      req.context = {};
    }
    req.context.user = {
      sub: payload.sub,
      email: payload.email,
      // 可以根据需要添加更多字段
    };
    req.context.accessToken = token;
    req.context.idToken = req.headers['identity-token'];
    req.context.sessionId = req.headers['session-id'];

    next();
  } catch (err) {
    console.error('Token verification failed:', err);
    return res.status(401).json({ message: 'Invalid token' });
  }
};
