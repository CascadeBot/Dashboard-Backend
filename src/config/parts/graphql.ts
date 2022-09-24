import joi from 'joi';

export interface GraphqlConf {
  playground: {
    enabled: boolean;
  };
}

export const graphqlConfSchema = joi.object({
  playground: joi
    .object({
      enabled: joi.boolean().default(false),
    })
    .default(),
});
