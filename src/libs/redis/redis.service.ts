import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Redis } from 'ioredis';

@Injectable()
export class RedisService implements OnModuleDestroy {
  private readonly redis: Redis;
  private readonly subscriber: Redis;

  constructor(private configService: ConfigService) {
    const host = this.configService.get<string>('REDIS_HOST');
    const port = this.configService.get<string>('REDIS_PORT');
    const username = this.configService.get<string>('REDIS_USERNAME');
    const password = this.configService.get<string>('REDIS_PASSWORD');

    if (!host || !port || !username || !password) {
      throw new Error('Redis Cloud configuration is missing');
    }

    this.redis = new Redis({
      host,
      port: parseInt(port),
      username,
      password,

      retryStrategy: (times) => {
        const delay = Math.min(times * 50, 2000);
        return delay;
      },
    });

    this.redis.on('error', (err) => {
      console.error('Redis connection error:', err);
    });

    this.redis.on('connect', () => {
      console.log('Successfully connected to Redis Cloud');
    });
  }

  async setRefreshToken(userId: string, token: string): Promise<void> {
    await this.redis.set(
      `refresh_token:${userId}`,
      token,
      'EX',
      7 * 24 * 60 * 60, // 7 days
    );
  }

  async getRefreshToken(userId: string): Promise<string | null> {
    return this.redis.get(`refresh_token:${userId}`);
  }

  async deleteRefreshToken(userId: string): Promise<void> {
    await this.redis.del(`refresh_token:${userId}`);
  }

  async set(key: string, value: string, ttlSeconds?: number): Promise<void> {
    if (ttlSeconds) {
      await this.redis.set(key, value, 'EX', ttlSeconds);
    } else {
      await this.redis.set(key, value);
    }
  }

  async get(key: string): Promise<string | null> {
    return this.redis.get(key);
  }

  async del(key: string): Promise<void> {
    await this.redis.del(key);
  }

  async publish(channel: string, message: string): Promise<void> {
    await this.redis.publish(channel, message);
  }

  async subscribe(
    channel: string,
    handler: (message: string) => void,
  ): Promise<void> {
    await this.subscriber.subscribe(channel);
    this.subscriber.on('message', (ch, msg) => {
      if (ch === channel) {
        handler(msg);
      }
    });
  }

  async subscribeToPattern(
    pattern: string,
    handler: (channel: string, message: string) => void,
  ) {
    await this.subscriber.psubscribe(pattern);
    this.subscriber.on('pmessage', (pattern, channel, message) => {
      handler(channel, message);
    });
  }

  getRedisClient(): Redis {
    return this.redis;
  }

  onModuleDestroy() {
    this.redis.quit();
  }
}
