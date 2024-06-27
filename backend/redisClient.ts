// src/redisClient.ts
import Redis from 'ioredis';

const client = new Redis({
  host: '127.0.0.1', // or your Redis server address
  port: 6379,        // default Redis port
});

client.on('error', (err) => {
  console.error('Redis Client Error', err);
});

export default client;
