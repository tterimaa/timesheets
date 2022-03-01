import { COLUMNS, DAYS_TO_COL } from './config.js';

/**
 * Gives a function that supplements the given date so that it's possible to
 * resolve the order of the row on which the current day belongs to.
 * Example 1: First day of the month is monday, there is no need to supplement because
 * for example 14/7 = 2 (2nd row).
 * -- m t w t f s s -- 1st row
 * -- m t w t f s S -- 2nd row
 * Example 2: First day of the month is saturday (start column is K). Without supplementing
 * 14/7 = 2 but 14th day is actually on the 3rd row. When empty blocks on first row
 * are added to the day number, the division gives the correct result. Ceil (14+5)/7 = 3
 * -- x x x x x s s -- 1st row
 * -- m t w t f s s -- 2nd row
 * -- m t w t F s s -- 3rd row
 * @param first day of the month (sunday-saturday) 0-6
 * @returns function that adds a constant value from 0 to 6 to the given date
 */
export const getDaySupplementorFunc = (first: number) => (date: number) => {
  switch (COLUMNS[first]) {
    case DAYS_TO_COL.SUNDAY:
      return date + 6;
    case DAYS_TO_COL.SATURDAY:
      return date + 5;
    case DAYS_TO_COL.FRIDAY:
      return date + 4;
    case DAYS_TO_COL.THURSDAY:
      return date + 3;
    case DAYS_TO_COL.WEDNESDAY:
      return date + 2;
    case DAYS_TO_COL.TUESDAY:
      return date + 1;
    default:
      return date;
  }
};

export const getRowResolverFunc = (startRow: number, gap: number) => (rowNumb: number) => startRow + ((rowNumb - 1) * gap);

export const getRowResolver = (daySupplementorFunc: (day: number) => number, rowResolverFunc: (rowNumber: number) => number) => (date: number) => rowResolverFunc(Math.ceil(daySupplementorFunc(date) / 7));

export const columnResolver = (day: number) => COLUMNS[day];
