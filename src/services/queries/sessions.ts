import { sessionsKey } from '../../utils/keys';
import { client } from '../../config/redis';

export interface Session {
  id: string;
  userId: string;
  username: string;
}

export const getSession = async (id: string): Promise<Session | null> => {
  const session = (await client.hGetAll(sessionsKey(id))) as { [key: string]: string };

  if (Object.keys(session).length === 0) {
    return null;
  }

  return deserialize(id, session);
};

export const saveSession = async (session: Session): Promise<void> => {
  await client.hSet(sessionsKey(session.id), serialize(session));
};

const deserialize = (id: string, session: { [key: string]: string }): Session => {
  return {
    id,
    userId: session.userId || '',
    username: session.username || ''
  };
};

const serialize = (session: Session) => {
  return {
    userId: session.userId || '',
    username: session.username || ''
  };
};
