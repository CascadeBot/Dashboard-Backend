import { createOauthUrl } from '@utils/discord/oauth';
import { decodeLoginToken } from '@utils/tokens/login';

export default {
  Query: {
    // needed for some reason?
    getOAuthInfo: () => ({}),
  },
  Mutation: {
    exchangeLoginToken: (ref, params) => {
      const parsedToken = decodeLoginToken(params.loginToken);
      // TODO throw official graphql error (status 400 with error code)
      if (!parsedToken.valid) throw new Error('invalid login token');

      // TODO create session token and session
      return {
        token: 'Hello world',
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
