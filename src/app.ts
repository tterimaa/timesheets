import express from 'express';
import routes from './api/routes.js';
import { middleware } from './api/middleware.js';

const PORT = 8080;

async function startServer() {
  const app = express();
  middleware(app);
  routes(app);
  app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
}

startServer();
