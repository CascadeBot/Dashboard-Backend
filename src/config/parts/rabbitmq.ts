import joi from 'joi';

interface RabbitMQUrlParts {
  protocol: string;
  hostname: string;
  port: number;
  username?: string;
  password?: string;
  vhost: string;
}

export interface RabbitMQConf {
  url: string | RabbitMQUrlParts;
}

export const rabbitMqConfSchema = joi.object({
  url: joi
    .alternatives()
    .try(
      joi.string().uri({ scheme: 'amqp' }).required(),
      joi
        .object({
          protocol: joi.string().valid('amqp').default('amqp').required(),
          hostname: joi.string().required(),
          port: joi.number().default(5672).required(),
          username: joi.string(),
          password: joi.string(),
          vhost: joi.string().default('/'),
        })
        .required(),
    )
    .match('one')
    .required(),
});
