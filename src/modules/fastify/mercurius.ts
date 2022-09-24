import { FastifyInstance } from 'fastify';
import { mergeResolvers, mergeTypeDefs } from '@graphql-tools/merge';
import { loadFiles } from '@graphql-tools/load-files';
import { print } from 'graphql';
import * as path from 'path';
import mercurius from 'mercurius';
import { scopedLogger } from '@logger';

const log = scopedLogger('graphql');

interface GraphQLResolvableSchema {
  resolvers: any;
  schema: string;
}

async function loadGraphqlParts(dir: string): Promise<GraphQLResolvableSchema> {
  const resolversArray = await loadFiles(path.join(dir, '**/*.gql.ts'));
  const typesArray = await loadFiles(path.join(dir, '**/*.graphql'));

  const resolvers = mergeResolvers(resolversArray);
  const typeDefs = mergeTypeDefs(typesArray);

  return {
    resolvers,
    schema: print(typeDefs),
  };
}

export async function setupMercurius(app: FastifyInstance): Promise<void> {
  log.info('Building graphQL schema from parts', {
    evt: 'load',
  });
  const schema = await loadGraphqlParts(
    path.join(__dirname, '../../gql/parts'),
  );
  log.info('Successfully built graphQL schema', {
    evt: 'load-success',
  });
  log.info('Registering graphQL schema', { evt: 'setup' });
  app.register(mercurius, {
    resolvers: schema.resolvers,
    schema: schema.schema,
  });
  log.info('Successfully loaded GraphQL', {
    evt: 'setup-success',
  });
}
