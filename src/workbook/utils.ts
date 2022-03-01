import { DAYS_TO_COL } from './config.js';

export const getFirstAndLastDaysOfMonth = (month: number): Array<Date> => {
  const date = new Date();
  const first = new Date(date.getFullYear(), month); // Date API months range 0-11
  const last = new Date(date.getFullYear(), month + 1, 0); // Day 0 gives last day of previous month
  return [first, last];
};

export const getExcludedColumns = (days: number): string[] => {
  switch (days) {
    case 5:
      return [DAYS_TO_COL.SATURDAY, DAYS_TO_COL.SUNDAY].map((value) => value.toString());
    case 6:
      return [DAYS_TO_COL.SUNDAY].map((value) => value.toString());
    default:
      return [];
  }
};

export const getNthNextColumn = (col: string, n: number): string => {
  if (col.length > 1) {
    console.error(
      'Next column can only be resolved for single character representing columns from A-Z',
    );
  }
  const char = col[0].toUpperCase();
  if (String.fromCharCode(char.charCodeAt(0) + n) > 'Z') {
    console.error(`Can't resolve ${n}:th next column because it's greater than Z, which is the last column of the sheet`);
  }
  return String.fromCharCode(col.charCodeAt(0) + n);
};
