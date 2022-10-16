import joi from 'joi';

interface PostgresUrlParts {
  protocol: string;
  hostname: string;
  port: number;
  username?: string;
  password?: string;
  database: string;
}

export interface PostgresConf {
  url: string | PostgresUrlParts;
  syncSchema: boolean;
}

export const postgresConfSchema = joi.object<PostgresConf>({
  syncSchema: joi.bool().default(false),
  url: joi
    .alternatives()
    .try(
      joi.string().uri({ scheme: 'postgres' }).required(),
      joi
        .object({
          protocol: joi
            .string()
            .valid('postgres')
            .default('postgres')
            .required(),
          hostname: joi.string().required(),
          port: joi.number().default(5432).required(),
          username: joi.string(),
          password: joi.string(),
          database: joi.string().required(),
        })
        .required(),
    )
    .match('one')
    .required(),
});
