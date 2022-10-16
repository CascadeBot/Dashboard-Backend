import { createUserLoaders } from '@loaders/user';

export async function buildLoaderContext() {
  return {
    loaders: {
      user: await createUserLoaders(),
    },
  };
}
