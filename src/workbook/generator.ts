import exceljs, { Workbook } from 'exceljs';
import { getDaySupplementorFunc, getRowResolverFunc, getRowResolver } from './resolvers.js';
import { getExcludedColumns, getFirstAndLastDaysOfMonth } from './utils.js';
import { Configs, GAP, START_ROW } from './config.js';
import {
  writeBlock,
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
  const rowResolver = getRowResolver(getDaySupplementorFunc(first.getDay()), getRowResolverFunc(START_ROW, GAP));
  const blocks = getBlocksForTheMonth(first, last.getDate(), rowResolver, [], getExcludedColumns(config.days), config.formulas);
  names.forEach((name) => {
    const sheet = wb.addWorksheet(name);
    blocks.forEach((block) => writeBlock(sheet, block, config.formulas));
    blocks.forEach((block) => styleBlock(sheet, block));
  });
  return wb;
};

export default generateWb;
