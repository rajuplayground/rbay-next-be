import { randomBytes } from 'crypto';
import keygrip from 'keygrip';
import { Request, Response } from 'express';
import { getSession, saveSession, Session } from './queries/sessions';

const keys = new keygrip([process.env.COOKIE_KEY || 'alskdjf']);

export const getSessionFromRequest = async (req: Request): Promise<Session> => {
  const auth = req.cookies?.auth;

  let sessionId = '';
  let sig = '';
  if (auth) {
    [sessionId, sig] = auth.split(':');
  }

  let session: Session;
  if (!sessionId || !keys.verify(sessionId, sig)) {
    session = await createSession();
  } else {
    const savedSession = await getSession(sessionId);
    session = savedSession || { id: '', userId: '', username: '' };
  }

  return session;
};

export const getSessionFromCookies = async (req: Request): Promise<Session | null> => {
  const auth = req.cookies?.auth;

  if (!auth) {
    return null;
  }

  const [sessionId, sig] = auth.split(':');

  if (!sessionId || !keys.verify(sessionId, sig)) {
    return null;
  }

  const savedSession = await getSession(sessionId);
  return savedSession || null;
};

export const setSessionCookie = (res: Response, session: Session): void => {
  const cookie = `${session.id}:${keys.sign(session.id)}`;
  res.cookie('auth', cookie, {
    httpOnly: false,
    path: '/',
    maxAge: 60 * 60 * 24 * 7 * 52 * 1000 // 1 year in milliseconds
  });
};

export const unsetSessionCookie = (res: Response): void => {
  res.cookie('auth', '', {
    httpOnly: false,
    path: '/',
    maxAge: 0
  });
};

const createSession = async (): Promise<Session> => {
  const id = randomBytes(4).toString('hex');

  const session: Session = {
    id,
    userId: '',
    username: ''
  };

  await saveSession(session);

  return session;
};
