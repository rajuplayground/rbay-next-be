import { Request, Response, NextFunction } from 'express';
import { getSessionFromCookies } from '../services/session';
import { Session } from '../services/queries/sessions';

declare global {
  namespace Express {
    interface Request {
      session?: Session;
    }
  }
}

export const requireAuth = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const session = await getSessionFromCookies(req);

    if (!session || !session.userId) {
      res.status(401).json({ message: 'unauthorized' });
      return;
    }

    // Attach session to request object for use in route handlers
    req.session = session;
    next();
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};
