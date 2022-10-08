import { config } from '@config';
import * as jwt from 'jsonwebtoken';

const sessionAlgorithm: jwt.Algorithm = 'HS256';

export interface SessionTokenInput {
  userId: string;
  sessionId: string;
}

interface InternalSessionTokenData {
  uid: string;
  sid: string;
  ver: number;
}

export interface SessionTokenData {
  userId: string;
  sessionId: string;
}

export type SessionToken = string;

export function createSessionToken(data: SessionTokenInput): SessionToken {
  const tokenObject: InternalSessionTokenData = {
    uid: data.userId,
    sid: data.sessionId,
    ver: 1,
  };

  const token: string = jwt.sign(tokenObject, config.security.sessionSecret, {
    algorithm: sessionAlgorithm,
  });

  return token;
}

export type decodeSessionOutput =
  | { valid: false; payload: null }
  | { valid: true; payload: SessionTokenData };
export function decodeSessionToken(token: SessionToken): decodeSessionOutput {
  let validationData: InternalSessionTokenData;
  try {
    validationData = jwt.verify(token, config.security.sessionSecret, {
      algorithms: [sessionAlgorithm],
    }) as InternalSessionTokenData;
  } catch {
    return {
      valid: false,
      payload: null,
    };
  }

  return {
    valid: true,
    payload: {
      sessionId: validationData.sid,
      userId: validationData.uid,
    },
  };
}
