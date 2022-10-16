import joi from 'joi';
import { DiscordConf, discordConfSchema } from './discord';
import { GraphqlConf, graphqlConfSchema } from './graphql';
import { LoggingConf, loggingConfSchema } from './logging';
import { PostgresConf, postgresConfSchema } from './postgres';
import { RabbitMQConf, rabbitMqConfSchema } from './rabbitmq';
import { RedisConf, redisConfSchema } from './redis';
import { SecurityConf, securityConfSchema } from './security';
import { ServerConf, serverConfSchema } from './server';

export interface Config {
  server: ServerConf;
  logging: LoggingConf;
  graphql: GraphqlConf;
  redis: RedisConf;
  postgres: PostgresConf;
  security: SecurityConf;
  discord: DiscordConf;
  rabbitmq: RabbitMQConf;
}

export const configSchema = joi.object<Config>({
  server: serverConfSchema.default(),
  graphql: graphqlConfSchema.default(),
  logging: loggingConfSchema.default(),
  redis: redisConfSchema.default(),
  security: securityConfSchema.default(),
  discord: discordConfSchema.default(),
  postgres: postgresConfSchema.default(),
  rabbitmq: rabbitMqConfSchema.default(),
});
