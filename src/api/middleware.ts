import express, { Router } from 'express';

export default (app: Router) => {
  app.use(express.json());
};
