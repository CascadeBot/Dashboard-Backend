import { config } from '@config';
import { scopedLogger } from '@logger';
import { createClient, RedisClientType } from 'redis';
import { setupSessions } from './sessions';

const log = scopedLogger('redis');

let redis: RedisClientType | null = null;

export function getRedis(): RedisClientType | null {
  return redis;
}

export async function setupRedis(): Promise<void> {
  log.info(`setting up redis...`, { evt: 'setup' });
  const redisClient: RedisClientType = createClient({
    url: config.redis.url,
    socket: {
      reconnectStrategy: (retries) => {
        if (retries > 50) return new Error('Exceeded retry amount');
        return Math.min(retries * 50, 500);
      },
    },
  });

  let promiseMethods: any = null;
  const finishedSetup = new Promise((res, rej) => {
    promiseMethods = [res, rej];
  });

  // redis is now connected (or finished reconnecting)
  redisClient.on('ready', async () => {
    try {
      await redisClient.ping();
    } catch {
      return;
    }
    try {
      log.info(`Connected to redis`, { evt: 'connect-end' });
      log.info(`Configuring redis...`, { evt: 'configure-start' });
      await setupSessions(redisClient);
      log.info(`Configured redis!`, { evt: 'configure-end' });
    } catch (err) {
      log.error(err, { evt: 'configure-error' });
      if (promiseMethods) promiseMethods[1]();
      // TODO maybe exit process here? failure to setup is pretty bad
      return;
    }
    if (promiseMethods) promiseMethods[0]();
  });
  redisClient.on('error', (e) =>
    log.error('Redis connection error', e, { evt: 'connect-error' }),
  );
  redisClient.on('end', () => {
    log.error('Redis connection ended', { evt: 'end' });
    process.exit(1);
  });

  log.info(`connecting to redis...`, { evt: 'connect' });
  await redisClient.connect();
  redis = redisClient;

  await finishedSetup;
  promiseMethods = null;

  log.info(`successfully connected to redis`, { evt: 'success' });
}
