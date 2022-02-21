import exceljs, { Workbook } from 'exceljs';
import { getFirstAndLastDaysOfMonth } from './utils.js';
import Sheet from './sheet.js';
import { Configs } from '../config.js';

const generateWorkBook = (month: number, names: string[], configs: Configs): Workbook => {
  const workbook = new exceljs.Workbook();
  const [first, last] = getFirstAndLastDaysOfMonth(month);
  const sheets = names.map((name) => new Sheet(workbook.addWorksheet(name), name, first, last, configs));
  sheets.forEach((sheet) => {
    sheet.writeCalendar();
    sheet.writeMonthlyTotals();
    sheet.protect();
  });
  return workbook;
};

export default generateWorkBook;
