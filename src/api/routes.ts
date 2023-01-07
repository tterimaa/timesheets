import {
  ErrorRequestHandler, Request, Response, Router,
} from 'express';
import path from 'path';
import fs from 'fs';
import { getConfigs } from '../workbook/config.js';
import generateWb from '../workbook/generator.js';
import { RequestBody, RequestBodySchema } from '../model/request.js';
import { validate } from './middleware.js';

const errorHandler: ErrorRequestHandler = (err, req, res) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
};

export default (app: Router) => {
  app.get('/', (req, res) => {
    res.send('Hello World');
  });

  app.post('/', validate(RequestBodySchema), async (req: Request<{}, {}, RequestBody>, res: Response, next) => {
    const {
      names, month, year, config,
    } = req.body;
    try {
      const wb = generateWb(month, names, getConfigs(config));
      const locale = config?.locale ? config.locale : 'en-US';
      const date = new Date(year, month);
      const fileName = `${date.toLocaleString(locale, { month: 'long' })}${year}.xlsx`;
      const directory = path.resolve('./workbooks');
      const absolutePath = `${directory}/${fileName}`;
      await wb.xlsx.writeFile(absolutePath);
      res.download(absolutePath, fileName, (err) => {
        fs.promises.unlink(absolutePath);
        if (err) throw err;
      });
    } catch (error) {
      next(error);
    }
  });

  app.use(errorHandler);
};
