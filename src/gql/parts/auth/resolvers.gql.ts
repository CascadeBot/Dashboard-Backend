import { IResolvers } from 'mercurius';
import { createOauthUrl } from '@utils/discord/oauth';
import { createUserAndSession } from '@utils/session';
import { decodeLoginToken } from '@utils/tokens/login';
import { createSessionToken } from '@utils/tokens/session';

const resolvers: IResolvers = {
  Query: {
    // needed for some reason?
    getOAuthInfo: () => ({}),
  },
  Mutation: {
    exchangeLoginToken: async (ref, params) => {
      const parsedToken = decodeLoginToken(params.loginToken);
      // TODO throw official graphql error (status 400 with error code)
      if (!parsedToken.valid) throw new Error('invalid login token');

      const { sessionId, userId } = await createUserAndSession(
        parsedToken.payload.discordId,
      );
      const sessionToken = createSessionToken({
        sessionId,
        userId,
      });

      return {
        token: sessionToken,
      };
    },
  },
  OAuthInfo: {
    authorizeUrl: (ref, params) => {
      // TODO check if redirect is valid
      const url = createOauthUrl({
        redirect: params.redirect,
      });
      return url;
    },
  },
};
export default resolvers;
