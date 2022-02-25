import { Router } from 'express';

export default (app: Router) => {
  app.get('/', (req, res) => {
    res.send('Hello World');
  });
};
