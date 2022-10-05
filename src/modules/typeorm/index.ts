import { DataSource, Logger } from 'typeorm';
import { config } from '@config';
import { scopedLogger } from '@logger';
import * as path from 'path';

const log = scopedLogger('postgres');
let source: DataSource | null = null;

export class TypeormLogger implements Logger {
  logQuery() {
    // dont wanna log every query, too many unuseful logs
  }

  logQuerySlow(time: number, query: string) {
    log.warn(`Query slow, took ${time}ms. '${query}'`);
  }

  log(level: 'log' | 'info' | 'warn', message: any) {
    const map = {
      log: 'debug',
      warn: 'warn',
      info: 'info',
    };
    log[map[level]](message);
  }

  logSchemaBuild(message: string) {
    log.info(message);
  }

  logMigration(message: string) {
    log.info(message);
  }

  logQueryError(error: string | Error) {
    log.error(error);
  }
}

export function createSource(): DataSource {
  return new DataSource({
    type: 'postgres',
    url: config.postgres.url,
    entities: [path.join(__dirname, '../../models/**/*.ts')],
    synchronize: config.postgres.syncSchema,
    logging: ['warn', 'info', 'log'],
    logger: new TypeormLogger(),
  });
}

export function getSource() {
  return source;
}

export async function setupTypeORM() {
  log.info(`Connecting to postgres`, { evt: 'connecting' });
  const s = createSource();
  await s.initialize();
  source = s;
  log.info(`Connected to postgres - ORM is setup!`, { evt: 'success' });
}
