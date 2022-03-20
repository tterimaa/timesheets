import { DAYS_TO_COL, Formula } from './config.js';

const getFirstAndLastDaysOfMonth = (month: number): Array<Date> => {
  const date = new Date();
  const first = new Date(date.getFullYear(), month); // Date API months range 0-11
  const last = new Date(date.getFullYear(), month + 1, 0); // Day 0 gives last day of previous month
  return [first, last];
};

const getExcludedColumns = (days: number): string[] => {
  switch (days) {
    case 5:
      return [DAYS_TO_COL.SATURDAY, DAYS_TO_COL.SUNDAY].map((value) => value.toString());
    case 6:
      return [DAYS_TO_COL.SUNDAY].map((value) => value.toString());
    default:
      return [];
  }
};

const getColAndRow = (cell: string): Array<string> => cell.split(/(\d+)/);

// (cell, 1, 1) = one column to right, one row down
const getNeighbourCell = (cell: string, x: number, y: number) => {
  const [col, row] = getColAndRow(cell);
  const colX = String.fromCharCode(col.charCodeAt(0) + x);
  const rowY = parseInt(row, 10) + y;
  return colX + rowY.toString();
};

const getFormulaCells = (headerCell: string, formulas: Array<Formula>) => formulas.map((val, i) => getNeighbourCell(headerCell, 0, 3 + i));

export {
  getFormulaCells, getNeighbourCell, getColAndRow, getExcludedColumns, getFirstAndLastDaysOfMonth,
};
