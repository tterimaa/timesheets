import { Request, Router } from 'express';
import { ConfigsInput, getConfigs } from '../workbook/config.js';
import generateWorkBook from '../workbook/generator.js';

interface RequestBody {
  month: number;
  names: string[];
  config?: ConfigsInput;
}

export default (app: Router) => {
  app.get('/', (req, res) => {
    res.send('Hello World');
  });

  app.post('/', (req: Request<{}, {}, RequestBody>, res, next) => {
    const { names, month, config } = req.body;
    const wb = generateWorkBook(month, names, getConfigs(config));
    wb.xlsx.writeFile('./workbooks/api-test.xlsx').then(() => {
      res.sendFile('/Users/tterimaa/code/projects/timesheets/workbooks/api-test.xlsx');
    }).catch((err) => next(err));
  });
};
