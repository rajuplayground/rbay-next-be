import { createClient } from 'redis';

const redisConfig: any = {
  socket: {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379')
  }
};

// Add password if provided
if (process.env.REDIS_PW) {
  redisConfig.password = process.env.REDIS_PW;
}

const client = createClient(redisConfig);

client.on('error', (err) => console.error('Redis Client Error', err));
client.on('connect', () => console.log('Redis Client Connecting...'));
client.on('ready', () => console.log('Redis Client Ready'));

// Ensure connection is established
if (!client.isOpen) {
  client.connect().catch((err) => {
    console.error('Failed to connect to Redis:', err);
  });
}

export { client };
