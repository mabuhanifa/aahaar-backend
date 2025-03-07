const serverConfig = {
  host: process.env.HOST || 'localhost',
  port: (process.env.PORT as unknown as number) || 2023,
  globalPrefix: 'api',
  swaggerPrefix: 'api/docs',
};

export default serverConfig;
