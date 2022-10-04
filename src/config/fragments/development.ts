export const developmentFragment = {
  server: {
    port: 8081,
    basePath: '/',
    host: 'http://localhost:8081',
  },
  graphql: {
    playground: {
      enabled: true,
    },
  },
  logging: {
    format: 'pretty',
  },
  redis: {
    url: 'redis://localhost:6379',
  },
  security: {
    sessionSecret: 'hello-world',
  },
};
