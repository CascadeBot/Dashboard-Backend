import { config } from '@config';
import { scopedLogger } from '@logger';
import { createClient, RedisClientType } from 'redis';

const log = scopedLogger('redis');

let redis: RedisClientType | null = null;

export function getRedis(): RedisClientType | null {
  return redis;
}

export async function setupRedis(): Promise<void> {
  log.info(`setting up redis...`, { evt: 'setup' });
  const redisClient: RedisClientType = createClient({
    url: config.redis.url,
  });

  log.info(`connecting to redis...`, { evt: 'connect' });
  await redisClient.connect();
  redis = redisClient;

  log.info(`successfully connected to redis`, { evt: 'success' });
}
