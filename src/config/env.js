import 'dotenv/config';

export const config = {
  port: process.env.PORT || 4000,
  mongoUri: process.env.MONGO_URI,
  jwtSecret: process.env.JWT_SECRET,
  nodeEnv: process.env.NODE_ENV || 'development',
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
  cookieSecure: process.env.COOKIE_SECURE === 'true',
  cookieDomain: process.env.COOKIE_DOMAIN || 'localhost'
};
