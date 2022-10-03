import joi from 'joi';

export interface RedisConf {
  url: string;
}

export const redisConfSchema = joi.object<RedisConf>({
  url: joi.string().uri().required(),
});
