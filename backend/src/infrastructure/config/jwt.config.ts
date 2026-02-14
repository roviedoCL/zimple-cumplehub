import { registerAs } from '@nestjs/config';

export default registerAs('jwt', () => ({
  secret: process.env.JWT_SECRET || 'your-secret-key-change-in-production',
  expiresIn: process.env.JWT_EXPIRES_IN || '24h',
  refreshSecret: process.env.JWT_REFRESH_SECRET || 'your-refresh-secret-change-in-production',
  refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  issuer: process.env.JWT_ISSUER || 'zimple-cumplehub',
  audience: process.env.JWT_AUDIENCE || 'zimple-cumplehub-api',
}));