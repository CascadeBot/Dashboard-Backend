import 'reflect-metadata'; // always first instruction of app, needed for reflection

import { setupFastify } from '@modules/fastify';
import { scopedLogger } from '@logger';
import { setupRedis } from '@modules/redis';
import { setupTypeORM } from '@modules/typeorm';
import { setupRabbitMQ } from '@modules/rabbitmq';

const log = scopedLogger('backend');

async function bootstrap(): Promise<void> {
  log.info(`App booting...`, {
    evt: 'setup',
  });

  await setupRabbitMQ();
  await setupTypeORM();
  await setupRedis();
  await setupFastify();

  log.info(`App setup, ready to accept connections`, {
    evt: 'success',
  });
  log.info(`--------------------------------------`);
}

bootstrap().catch((err) => {
  log.error(err, {
    evt: 'setup-error',
  });
  process.exit(1);
});
