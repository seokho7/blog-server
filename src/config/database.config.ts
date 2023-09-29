import { registerAs } from '@nestjs/config';

export default registerAs('database', () => ({
  DATABASE_PORT: process.env.DATABASE_PORT,
  DATABASE_USER_NAME: process.env.DATABASE_USER_NAME,
  DATABASE_PASSWORD: process.env.DATABASE_PASSWORD,
  DATABASE_NAME: process.env.DATABASE_NAME,
}));
