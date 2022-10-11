import joi from 'joi';

export interface RabbitMQConf {
  url: string;
}

export const rabbitMqConfSchema = joi.object({
  url: joi.string().uri({
    scheme: 'amqp',
  }),
});
