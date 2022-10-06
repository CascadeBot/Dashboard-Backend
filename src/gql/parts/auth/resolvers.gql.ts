import { IResolvers } from 'mercurius';
import { createOauthUrl } from '@utils/discord/oauth';
import { createUserAndSession } from '@utils/session';
import { decodeLoginToken } from '@utils/tokens/login';
import { createSessionToken } from '@utils/tokens/session';
import { redirectUrlSchema } from '@utils/tokens/oauthState';
import { ErrorCodes, GraphQLError } from '@gql/errors';

const resolvers: IResolvers = {
  Query: {
    // needed for some reason?
    getOAuthInfo: () => ({}),
  },
  Mutation: {
    exchangeLoginToken: async (ref, params) => {
      const parsedToken = decodeLoginToken(params.loginToken);
      if (!parsedToken.valid)
        throw new GraphQLError(ErrorCodes.InvalidLoginToken);

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
      const validRedirect = redirectUrlSchema
        .allow(null)
        .optional()
        .validate(params.redirect);
      if (validRedirect.error)
        throw new GraphQLError(ErrorCodes.InvalidRedirect);

      const url = createOauthUrl({
        redirect: validRedirect.value,
      });
      return url;
    },
  },
};
export default resolvers;
