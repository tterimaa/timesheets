import { COLUMNS } from './config.js';

export const getFirstAndLastDaysOfMonth = (month: number): Array<Date> => {
  const first = new Date(2021, month); // Date API months range 0-11
  const last = new Date(2021, month + 1, 0); // Day 0 gives last day of previous month
  return [first, last];
};

export const resolveColumn = (date: Date): string => {
  const day = date.getDay();
  return COLUMNS[day];
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
