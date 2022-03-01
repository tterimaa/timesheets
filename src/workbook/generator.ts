import exceljs, { Workbook } from 'exceljs';
import { getDaySupplementorFunc, getRowResolverFunc, getRowResolver } from './resolvers.js';
import { getFirstAndLastDaysOfMonth } from './utils.js';
import { Configs, GAP, START_ROW } from './config.js';
import { writeCalendar, writeMonthlyTotal } from './writer.js';

export interface TotalHours {
  dayHours: Array<string>;
  eveningHours: Array<string>;
}

const generateWb = (month: number, names: string[], config: Configs): Workbook => {
  const wb = new exceljs.Workbook();
  const [first, last] = getFirstAndLastDaysOfMonth(month);
  const rowResolver = getRowResolver(getDaySupplementorFunc(first.getDay()), getRowResolverFunc(START_ROW, GAP));
  names.forEach((name) => {
    const { sheet, hours } = writeCalendar(wb.addWorksheet(name), first, last.getDate(), config, rowResolver, { dayHours: [], eveningHours: [] });
    writeMonthlyTotal(sheet, hours, name);
  });
  return wb;
};

export default generateWb;
