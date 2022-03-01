export const BLOCK_HEADER_FORMAT: Intl.DateTimeFormatOptions = {
  weekday: 'short',
  month: 'numeric',
  day: 'numeric',
  year: 'numeric',
};

export const dayHoursCell = (col: string, row: number) => col + (row + 3);

export const eveningHoursCell = (col: string, row: number) => col + (row + 4);

export const allHoursCell = (col: string, row: number) => col + (row + 4);

export const totalEveningHoursCell = 'A3';

export const totalDayHoursCell = 'A2';
