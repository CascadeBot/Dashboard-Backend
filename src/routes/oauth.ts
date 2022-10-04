import { Type } from '@sinclair/typebox';
import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';

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
      console.log(req.query.code, req.query.state);
      res.send('Hello world');
      return;
    },
  );
};
