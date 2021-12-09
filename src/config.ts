export enum DAYS_TO_COL {
  SUNDAY = 'M',
  MONDAY = 'A',
  TUESDAY = 'C',
  WEDNESDAY = 'E',
  THURSDAY = 'G',
  FRIDAY = 'I',
  SATURDAY = 'K',
}

export const COLUMNS = [
  DAYS_TO_COL.SUNDAY,
  DAYS_TO_COL.MONDAY,
  DAYS_TO_COL.TUESDAY,
  DAYS_TO_COL.WEDNESDAY,
  DAYS_TO_COL.THURSDAY,
  DAYS_TO_COL.FRIDAY,
  DAYS_TO_COL.SATURDAY,
];
export const START_ROW = 5;
export const GAP = 5; // Minimum 5
export const ROWS_IN_UNIT = 5; // Number of rows in one unit (date + input + functions)
