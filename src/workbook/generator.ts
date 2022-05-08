import exceljs, { Workbook } from 'exceljs';
import { getDaySupplementorFunc, getRowResolverFunc, getRowResolver } from './resolvers.js';
import { getExcludedColumns, getFirstAndLastDaysOfMonth } from './utils.js';
import { Configs } from './config.js';
import {
  getTotalHoursCells,
  writeBlock, writeSummary, writeTitle, writeTotalHours,
} from './writer.js';
import { getBlocksForTheMonth } from './block.js';
import { styleBlock } from './styler.js';

export interface TotalHours {
  dayHours: Array<string>;
  eveningHours: Array<string>;
}

const generateWb = (month: number, names: string[], config: Configs): Workbook => {
  const wb = new exceljs.Workbook();
  const [first, last] = getFirstAndLastDaysOfMonth(month);
  const rowResolver = getRowResolver(getDaySupplementorFunc(first.getDay()), getRowResolverFunc(config.startRow, config.gap));
  const blocks = getBlocksForTheMonth(first, last.getDate(), rowResolver, [], getExcludedColumns(config.days), config.formulas);
  names.forEach((name) => {
    const sheet = wb.addWorksheet(name);
    blocks.forEach((block) => writeBlock(sheet, block, config.formulas));
    blocks.forEach((block) => styleBlock(sheet, block));
    const formulaCells = config.formulas.map((f, i) => ({ name: f.name, cells: blocks.map((b) => b.formulaCells[i]) }));
    const totalHoursCells = getTotalHoursCells(config.totalsStartCell, config.formulas.map((f) => f.name));
    writeTitle(sheet, name, config.titleCell);
    writeTotalHours(sheet, formulaCells, totalHoursCells);
    writeSummary(sheet, config.summary.startCell, config.summary.aggregators, totalHoursCells);
  });
  return wb;
};

export default generateWb;
