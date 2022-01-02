import exceljs, { Workbook } from 'exceljs';
import { getFirstAndLastDaysOfMonth } from './utils.js';
import Sheet from './Sheet.js';

const generateWorkBook = (month: number, names: string[]): Workbook => {
  const workbook = new exceljs.Workbook();
  names.forEach((name) => {
    const [first, last] = getFirstAndLastDaysOfMonth(month);
    const sheet = new Sheet(workbook.addWorksheet(name), name, first, last);
    sheet.writeCalendar();
    sheet.writeMonthlyTotals();
    sheet.protect();
  });
  return workbook;
};

export default generateWorkBook;
