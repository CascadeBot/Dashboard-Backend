import Fastify, { FastifyInstance } from 'fastify';
import cors from '@fastify/cors';
import { setupMercurius } from '@modules/fastify/mercurius';
import { setupPlayground } from '@modules/fastify/playground';
import { config } from '@config';
import { makeFastifyLogger, scopedLogger } from '@logger';
import { OauthRouter, OauthRouterPrefix } from '@routes/oauth';
import { StatusError } from '@utils/errors';

const log = scopedLogger('fastify');

export async function setupFastify(): Promise<FastifyInstance> {
  log.info(`setting up fastify...`, { evt: 'setup-start' });
  // create server
  const app = Fastify({
    logger: makeFastifyLogger(log) as any,
  });
  let exportedApp = null;

  app.setErrorHandler((err, req, reply) => {
    if (err.validation) {
      reply.status(500).send({
        status: 500,
        error: err.message,
      });
      return;
    }

    if (err instanceof StatusError) {
      reply.status(err.statusCode).send({
        status: err.statusCode,
        error: err.message,
      });
      return;
    }

    log.error('unhandled exception on server:', err);
    reply.status(500).send({
      status: 500,
      error: 'Internal server error',
    });
  });

  // plugins & routes
  log.info(`setting up plugins and routes`, { evt: 'setup-plugins' });
  await app.register(cors, {
    origin: config.server.cors.split(' ').filter((v) => v.length),
  });
  await app.register(
    async (api, opts, done) => {
      await setupMercurius(api);
      await setupPlayground(api);

      api.register(OauthRouter, { prefix: OauthRouterPrefix });

      exportedApp = api;
      done();
    },
    {
      prefix: config.server.basePath,
    },
  );

  // listen to port
  log.info(`listening to port`, { evt: 'setup-listen' });
  return new Promise((resolve) => {
    app.listen(
      {
        port: config.server.port,
        host: '0.0.0.0',
      },
      function (err) {
        if (err) {
          app.log.error(err);
          log.error(`Failed to setup fastify`, {
            evt: 'setup-error',
          });
          process.exit(1);
        }
        log.info(`fastify setup successfully`, {
          evt: 'setup-success',
        });
        resolve(exportedApp);
      },
    );
  });
}
