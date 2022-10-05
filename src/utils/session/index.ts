import { User } from '@models/User';
import { getRedis } from '@modules/redis';
import { sessionKey } from '@modules/redis/sessions';
import { randomUUID } from 'crypto';

const expireSeconds = 7 * 24 * 60 * 60; // 1 week

export interface Session {
  ver: 1;
  uid: string;
}

export async function createSession(userId: string): Promise<string> {
  const sid = randomUUID();
  const key = sessionKey(sid);
  const data: Session = {
    uid: userId,
    ver: 1,
  };
  await getRedis()
    .multi()
    .json.set(key, '$', data as any)
    .expire(key, expireSeconds)
    .exec();
  return sid;
}

/**
 * creates a session and user if it doesnt exist yet. returns the session id
 */
export async function createUserAndSession(
  discordId: string,
): Promise<{ sessionId: string; userId: string }> {
  const foundUser = await User.findOneBy({ discordId });
  let userId;
  if (!foundUser) {
    const usr = new User();
    usr.discordId = discordId;
    const savedUser = await usr.save();
    userId = savedUser.id;
  } else {
    userId = foundUser.id;
  }
  const sessionId = await createSession(userId);
  return {
    sessionId,
    userId,
  };
}

/**
 * This function gets a session by id, but also increases the expiry. Use when its a request from a client.
 * Do not use if this is for background tasks as this will potentionally make session infinitely long
 */
export async function getRollingSession(sessionId: string): Promise<Session> {
  const key = sessionKey(sessionId);
  const [session] = await getRedis()
    .multi()
    .json.get(key)
    .expire(key, expireSeconds)
    .exec();
  return session as any;
}

export async function getSession(sessionId: string): Promise<Session> {
  const session = await getRedis().json.get(sessionKey(sessionId));
  return session as any;
}
