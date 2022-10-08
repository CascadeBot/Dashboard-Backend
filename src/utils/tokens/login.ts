import { config } from '@config';
import * as jwt from 'jsonwebtoken';

const loginAlgorithm: jwt.Algorithm = 'ES256';

interface InternalLoginTokenData {
  did: string;
}

export interface LoginTokenData {
  discordId: string;
}

export type LoginToken = string;

export type decodeLoginOutput =
  | { valid: false; payload: null }
  | { valid: true; payload: LoginTokenData };
export function decodeLoginToken(token: LoginToken): decodeLoginOutput {
  let validationData: InternalLoginTokenData;
  try {
    validationData = jwt.verify(token, config.security.loginPublicKey, {
      algorithms: [loginAlgorithm],
    }) as InternalLoginTokenData;
  } catch {
    return {
      valid: false,
      payload: null,
    };
  }

  return {
    valid: true,
    payload: {
      discordId: validationData.did,
    },
  };
}
