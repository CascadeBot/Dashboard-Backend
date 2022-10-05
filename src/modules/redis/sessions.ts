import { scopedLogger } from '@logger';
import { RedisClientType, SchemaFieldTypes } from 'redis';

const log = scopedLogger('redis');

export const sessionsPrefix = 'cascade:sessions';
export const sessionIndex = 'cascade:idx:sessions';

export const sessionKey = (sid: string) => `${sessionsPrefix}:${sid}`;

// TODO maybe run this on every reconnect, as indexes are not persistent by default
export async function setupSessions(client: RedisClientType) {
  try {
    await client.ft.create(
      sessionIndex,
      {
        '$.uid': {
          type: SchemaFieldTypes.TEXT,
          AS: 'uid',
        },
      },
      {
        ON: 'JSON',
        PREFIX: sessionsPrefix,
      },
    );
  } catch (e) {
    if (e.message === 'Index already exists') {
      log.info('Sessions index already exists, skipping', {
        evt: 'index-create',
      });
    } else {
      log.error('Failed to create sessions index:', e);
      throw e;
    }
  }
}
