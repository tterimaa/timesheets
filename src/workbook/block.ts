import { getFormulaCells, getNeighbourCell } from './utils.js';
import { columnResolver } from './resolvers.js';
import { Formula } from './config.js';

/**
 * Block represents a section in the sheet that contains the header (date),
 * subheaders for inputs (start, finish), input cells and function cells.
 * Example:
 * --------------
 *  Mon 1.1.2022
 * Start   Finish
 * <input> <input>
 *     func1
 *     func2
 *     func3
 * ---------------
 * Functions perform calculations on inputs and output results.
 */

export interface Block {
  headerCell: string,
  header: string,
  startCell: string,
  finishCell: string
  startInputCell: string,
  finishInputCell: string,
  formulaCells: Array<string>,
}

export const BLOCK_HEADER_FORMAT: Intl.DateTimeFormatOptions = {
  weekday: 'short',
  month: 'numeric',
  day: 'numeric',
  year: 'numeric',
};

export const getBlocksForTheMonth = (date: Date, last: number, rowResolver: (date: number) => number, blocks: Array<Block>, excludedCols: string[], formulas: Array<Formula>, locale: string): Array<Block> => {
  const col = columnResolver(date.getDay());
  const row = rowResolver(date.getDate());
  const headerCell = (col + row);
  const newBlock = {
    headerCell,
    header: date.toLocaleDateString(locale, BLOCK_HEADER_FORMAT),
    startCell: getNeighbourCell(headerCell, 0, 1),
    finishCell: getNeighbourCell(headerCell, 1, 1),
    startInputCell: getNeighbourCell(headerCell, 0, 2),
    finishInputCell: getNeighbourCell(headerCell, 1, 2),
    formulaCells: getFormulaCells(headerCell, formulas),
  };
  const isColExcluded = excludedCols.includes(col);
  if (date.getDate() >= last) {
    return isColExcluded ? blocks : [...blocks, newBlock];
  }
  const nextDate = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1);
  return isColExcluded
    ? getBlocksForTheMonth(nextDate, last, rowResolver, [...blocks], excludedCols, formulas, locale)
    : getBlocksForTheMonth(nextDate, last, rowResolver, [...blocks, newBlock], excludedCols, formulas, locale);
};
