import express from 'express';
import api from './api/index.js';

const PORT = 8080;

async function startServer() {
  const app = express();
  api(app);
  app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
}

startServer();
