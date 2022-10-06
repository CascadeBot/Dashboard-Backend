import { decodeSessionToken } from '@utils/tokens/session';
import { FastifyRequest } from 'fastify';
import { getRollingSession, removeAllSessions, Session } from '@utils/session';
import { User } from '@models/User';
import { ErrorCodes, GraphQLError } from './errors';

export class AuthHelper {
  private hasAuth = false;
  private session?: Session = null;
  private token?: string = null;
  private error?: ErrorCodes = null;

  async populate(authHeader?: string) {
    this.hasAuth = false;
    if (!authHeader) {
      return;
    }
    const [prefix, token] = authHeader.split(' ', 2);
    if (prefix.toLowerCase() !== 'bearer') {
      this.error = ErrorCodes.InvalidTokenType;
      return;
    }
    const decodedToken = decodeSessionToken(token || '');
    if (!decodedToken.valid) {
      this.error = ErrorCodes.InvalidToken;
      return;
    }
    this.session = await getRollingSession(decodedToken.payload.sessionId);
    if (!this.session) {
      this.error = ErrorCodes.InvalidToken; // invalid token will also mean expired in this context
      return;
    }
    this.token = token;
    this.hasAuth = true;
  }

  get authenticated(): boolean {
    return this.hasAuth;
  }

  // throw if user isnt authenticated
  assertAuth() {
    if (this.error) throw new GraphQLError(this.error);
    if (!this.hasAuth) throw new GraphQLError(ErrorCodes.NeedsAuth);
  }

  async fetchUser(): Promise<User> {
    this.assertAuth();
    const user = await User.findOneBy({ id: this.session.uid });

    // user belonging to session doesnt exist anymore, remove all sessions from this (missing) user
    if (!user) {
      await removeAllSessions(this.session.uid);
      throw new GraphQLError(ErrorCodes.InvalidToken); // session without user is an invalid session
    }

    return user;
  }
}

export const buildContext = async (req: FastifyRequest) => {
  const auth = new AuthHelper();
  await auth.populate(req.headers.authorization);
  return {
    auth,
  };
};

type PromiseType<T> = T extends PromiseLike<infer U> ? U : T;

declare module 'mercurius' {
  interface MercuriusContext
    extends PromiseType<ReturnType<typeof buildContext>> {}
}
