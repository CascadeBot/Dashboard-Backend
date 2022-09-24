import { config } from '@config';
import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { renderPlaygroundPage } from 'graphql-playground-html';

export async function setupPlayground(app: FastifyInstance): Promise<void> {
  if (!config.graphql.playground.enabled) {
    return;
  }

  // if enabled, get playground
  app.get('/playground', (req: FastifyRequest, res: FastifyReply) => {
    const { host, basePath } = config.server;
    const path = basePath.endsWith('/') ? basePath : basePath + '/';
    res.header('content-type', 'text/html').send(
      renderPlaygroundPage({
        endpoint: `${host}${path}graphql`,
      }),
    );
  });
}
