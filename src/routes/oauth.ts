import { Type } from '@sinclair/typebox';
import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { OauthState, parseOauthState } from '@utils/tokens/oauthState';
import { URL } from 'url';
import { config } from '@config';
import { getUserFromCode } from '@utils/discord/oauth';

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
        // TODO invalid state -> status 400
        if (!parsedState.valid) throw new Error('Invalid state variable');
        state = parsedState.payload;
      }

      // TODO handle invalid code -> status 400
      const discordUser = await getUserFromCode(req.query.code);
      // TODO create session and create session token

      // 302 will redirect to a GET request
      // TODO verify if redirect is valid
      const url = new URL(config.server.appUrl + 'login/callback');
      url.searchParams.append('token', 'hello-world');
      if (state?.redirect) url.searchParams.append('redirect', state?.redirect);
      res.redirect(302, url.toString());
      return;
    },
  );
};
