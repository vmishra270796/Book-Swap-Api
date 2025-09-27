import { createApp } from './src/app.js';
import { connectDB } from './src/db/connect.js';
import { config } from './src/config/env.js';

const start = async () => {
  await connectDB();
  const app = createApp();
  app.listen(config.port, () => {
    console.log(`Server running on http://localhost:${config.port}`);
  });
};

start();
