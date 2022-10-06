import { Type } from '@sinclair/typebox';
import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { OauthState, parseOauthState } from '@utils/tokens/oauthState';
import { URL } from 'url';
import { config } from '@config';
import { getUserFromCode } from '@utils/discord/oauth';
import { createSessionToken } from '@utils/tokens/session';
import { createUserAndSession } from '@utils/session';
import { StatusError } from '@utils/errors';

export const OauthRouterPrefix = '/oauth2';

const callbackSchema = Type.Object({
  code: Type.String({ minLength: 1 }),
  state: Type.Optional(Type.String({ minLength: 1 })),
});

export const OauthRouter: FastifyPluginAsyncTypebox = async (app) => {
  app.get(
    '/discord/callback',
    {
      schema: {
        querystring: callbackSchema,
      },
    },
    async (req, res) => {
      // handle state
      let state: OauthState | null = null;
      if (req.query.state) {
        const parsedState = parseOauthState(req.query.state);
        if (!parsedState.valid)
          throw new StatusError('Invalid state variable', 400);
        state = parsedState.payload;
      }

      const discordUser = await getUserFromCode(req.query.code);
      const { sessionId, userId } = await createUserAndSession(discordUser.id);
      const sessionToken = createSessionToken({
        sessionId,
        userId,
      });

      // 302 will redirect to a GET request
      const url = new URL(config.server.appUrl + 'login/callback');
      url.searchParams.append('token', sessionToken);
      if (state?.redirect) url.searchParams.append('redirect', state?.redirect);
      res.redirect(302, url.toString());
      return;
    },
  );
};
