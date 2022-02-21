import { COLUMNS, DAYS_TO_COL } from '../config.js';

export const getFirstAndLastDaysOfMonth = (month: number): Array<Date> => {
  const date = new Date();
  const first = new Date(date.getFullYear(), month); // Date API months range 0-11
  const last = new Date(date.getFullYear(), month + 1, 0); // Day 0 gives last day of previous month
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

export const getLastDayOfWeek = (days: number) => {
  switch (days) {
    case 5:
      return DAYS_TO_COL.FRIDAY;
    case 6:
      return DAYS_TO_COL.SATURDAY;
    default:
      return DAYS_TO_COL.SUNDAY;
  }
};
