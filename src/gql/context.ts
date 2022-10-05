import { decodeSessionToken } from '@utils/tokens/session';
import { FastifyRequest } from 'fastify';
import { getRollingSession, Session } from '@utils/session';
import { User } from '@models/User';

export class AuthHelper {
  private session?: Session = null;
  private token?: string;

  constructor(token?: string) {
    this.token = token;
  }

  async populate() {
    const decodedToken = decodeSessionToken(this.token || '');
    if (!decodedToken.valid) throw new Error('invalid token');
    this.session = await getRollingSession(decodedToken.payload.sessionId);
  }

  get authenticated(): boolean {
    return !!this.session;
  }

  // throw if user isnt authenticated
  assertAuth() {
    if (!this.authenticated) {
      throw new Error('Requires authentication');
    }
  }

  async fetchUser(): Promise<User> {
    this.assertAuth();
    return await User.findOneBy({ id: this.session.uid });
  }
}

// TODO throw proper errors with status codes
export const buildContext = async (req: FastifyRequest) => {
  let auth = new AuthHelper();
  if (req.headers.authorization) {
    const [prefix, token] = req.headers.authorization.split(' ', 2);
    if (prefix.toLowerCase() !== 'bearer')
      throw new Error('token type unsupported');
    auth = new AuthHelper(token);
    await auth.populate();
  }
  return {
    auth,
  };
};

type PromiseType<T> = T extends PromiseLike<infer U> ? U : T;

declare module 'mercurius' {
  interface MercuriusContext
    extends PromiseType<ReturnType<typeof buildContext>> {}
}
