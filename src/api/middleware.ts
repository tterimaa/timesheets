import express, {
  NextFunction,
  Request,
  Response,
  Router,
} from 'express';
import { Schema } from 'zod';

const middleware = (app: Router) => {
  app.use(express.json());
};

const validate = (schema: Schema) => (req: Request, res: Response, next: NextFunction) => {
  try {
    schema.parse(req.body);

    return next();
  } catch (err) {
    return res.status(400).send(err);
  }
};

export { middleware, validate };
