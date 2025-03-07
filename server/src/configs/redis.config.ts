import { RedisOptions } from 'ioredis';

const strToBool = (s: string) => new RegExp(/^\s*(true|1|on)\s*$/i).test(s);

export const redisEnabled =
  strToBool(process.env.REDIS_ENABLED as unknown as string) || false;

export const redisHost = process.env.REDIS_HOST || 'redis';
export const redisPort = parseInt(process.env.REDIS_PORT) || 6379;
export const redisUser = process.env.REDIS_USER || '';
export const redisPassword = process.env.REDIS_PASSWORD || '';
export const redisDb = parseInt(process.env.REDIS_DB) || 0;
export const protocol =
  process.env.NODE_ENV == 'development' ? 'redis://' : 'rediss://';

let url: string;

// TODO: FIX ME TO GENERATE REDIS URL
if (redisEnabled && process.env.REDIS_URL) {
  url = process.env.REDIS_URL;
} else if (redisEnabled && redisUser && redisPassword && redisDb) {
  url = `${protocol}${redisUser}:${redisPassword}@${redisHost}:${redisPort}/${redisDb}`;
} else if (redisEnabled && redisUser && redisPassword) {
  url = `${protocol}${redisUser}:${redisPassword}@${redisHost}:${redisPort}`;
} else if (redisEnabled && redisUser) {
  url = `${protocol}${redisUser}:${redisPassword}@${redisHost}`;
} else {
  url = `${protocol}${redisHost}:${redisPort}`;
}

export const redisUrl: string = url;

export const redisOptions: RedisOptions = {
  host: redisHost,
  port: redisPort,
  ...(redisUser && { username: redisUser }),
  ...(redisUser && { password: redisPassword }),
  ...(redisDb && { db: redisDb }),
  ...(process.env.NODE_ENV !== 'development' && {
    tls: {
      host: redisHost,
      port: redisPort,
    },
  }),
  //ttl: 1000
};
