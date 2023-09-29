import { Injectable } from '@nestjs/common';
import {
  HealthCheck,
} from '@nestjs/terminus';
import * as Redis from 'ioredis';
import * as mysql from 'mysql2/promise';

@Injectable()
export class DataBaseHealthCheckService {
  constructor() {}

  @HealthCheck()
  async mysqlCheck() {
    try {
      const client = await mysql.createConnection({
        host: process.env.DATABASE_HOST,
        user: process.env.DATABASE_USER_NAME,
        password: process.env.DATABASE_PASSWORD,
      });
      await client.execute('SELECT 1');

      return { status: 'up' };
    } catch (err) {
      return { status: 'down', message: err.message };
    }
  }

  @HealthCheck()
  async redisCheck() {
    const client = new Redis.Redis({
      host: process.env.REDIS_HOST,
      port: Number(process.env.REDIS_PORT),
      password: process.env.REDIS_PASSWORD,
    });
    try {
      await client.ping();
      return { status: 'up' };
    } catch (err) {
      return { status: 'down', message: err.message };
    } finally {
      client.disconnect();
    }
  }
}
