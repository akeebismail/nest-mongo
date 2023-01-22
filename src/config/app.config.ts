import { registerAs } from '@nestjs/config';

export default registerAs('app', () => ({
  name: process.env.APP_NAME,
  host: process.env.APP_HOST,
  port: parseInt(process.env.APP_PORT, 10),
  url: `${process.env.APP_HOST}:${parseInt(process.env.APP_PORT, 10)}`,
}));
