import joi from 'joi';
import { GraphqlConf, graphqlConfSchema } from './graphql';
import { LoggingConf, loggingConfSchema } from './logging';
import { RedisConf, redisConfSchema } from './redis';
import { SecurityConf, securityConfSchema } from './security';
import { ServerConf, serverConfSchema } from './server';

export interface Config {
  server: ServerConf;
  logging: LoggingConf;
  graphql: GraphqlConf;
  redis: RedisConf;
  security: SecurityConf;
}

export const configSchema = joi.object<Config>({
  server: serverConfSchema.default(),
  graphql: graphqlConfSchema.default(),
  logging: loggingConfSchema.default(),
  redis: redisConfSchema.default(),
  security: securityConfSchema.default(),
});
