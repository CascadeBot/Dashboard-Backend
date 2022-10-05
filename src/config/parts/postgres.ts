import joi from 'joi';

export interface PostgresConf {
  url: string;
  syncSchema: boolean;
}

export const postgresConfSchema = joi.object<PostgresConf>({
  url: joi.string().uri().required(),
  syncSchema: joi.bool().default(false),
});
