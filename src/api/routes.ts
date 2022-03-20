import { ErrorRequestHandler, Request, Router } from 'express';
import { ConfigsInput, getConfigs } from '../workbook/config.js';
import generateWb from '../workbook/generator.js';

interface RequestBody {
  month: number;
  names: string[];
  config?: ConfigsInput;
}

const errorHandler: ErrorRequestHandler = (err, req, res) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
};

export default (app: Router) => {
  app.get('/', (req, res) => {
    res.send('Hello World');
  });

  app.post('/', (req: Request<{}, {}, RequestBody>, res, next) => {
    const { names, month, config } = req.body;
    const wb = generateWb(month, names, getConfigs(config));
    wb.xlsx.writeFile('./workbooks/api-test.xlsx').then(() => {
      res.sendFile('/Users/tterimaa/code/projects/timesheets/workbooks/api-test.xlsx');
    }).catch((err) => next(err));
  });

  app.use(errorHandler);
};
