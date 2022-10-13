import { ErrorCodes, GraphQLError } from '@gql/errors';
import { User } from '@models/User';
import { getRollingSession, removeAllSessions, Session } from '@utils/session';
import { decodeSessionToken } from '@utils/tokens/session';
import DataLoader from 'dataloader';
import { FastifyRequest } from 'fastify';

class AuthHelper {
  private hasAuth = false;
  private session?: Session = null;
  private error?: ErrorCodes = null;
  private currentUserLoader: DataLoader<string, User>;

  constructor() {
    this.currentUserLoader = new DataLoader(
      async ([id]: string[]): Promise<User[]> => {
        return [await User.findOneBy({ id })];
      },
      {
        batch: false,
      },
    );
  }

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

  // clears cache for user
  clearCache() {
    this.currentUserLoader.clearAll();
  }

  // gets user from db, cached per request
  async fetchUser(): Promise<User> {
    this.assertAuth();
    const user = await this.currentUserLoader.load(this.session.uid);

    // user belonging to session doesnt exist anymore, remove all sessions from this (missing) user
    if (!user) {
      await removeAllSessions(this.session.uid);
      throw new GraphQLError(ErrorCodes.InvalidToken); // session without user is an invalid session
    }

    return user;
  }
}

export async function buildAuthContext(req: FastifyRequest) {
  const auth = new AuthHelper();
  await auth.populate(req.headers.authorization);
  return {
    auth,
  };
}
