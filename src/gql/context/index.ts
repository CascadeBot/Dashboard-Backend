import { FastifyRequest } from 'fastify';
import { buildAuthContext } from './auth';
import { buildLoaderContext } from './loaders';

export const buildContext = async (req: FastifyRequest) => {
  const authContext = await buildAuthContext(req);
  const loaderContext = await buildLoaderContext();
  return {
    ...authContext,
    ...loaderContext,
  };
};

type PromiseType<T> = T extends PromiseLike<infer U> ? U : T;

declare module 'mercurius' {
  interface MercuriusContext
    extends PromiseType<ReturnType<typeof buildContext>> {}
}
