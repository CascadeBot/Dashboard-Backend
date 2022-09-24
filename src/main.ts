import { setupFastify } from '@modules/fastify';
import { scopedLogger } from '@logger';

const log = scopedLogger('backend');

async function bootstrap(): Promise<void> {
  log.info(`App booting...`, {
    evt: 'setup',
  });

  await setupFastify();

  log.info(`App setup, ready to accept connections`, {
    evt: 'success',
  });
}

bootstrap().catch((err) => {
  log.error(err, {
    evt: 'setup-error',
  });
  process.exit(1);
});
