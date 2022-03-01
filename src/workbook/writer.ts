/* eslint-disable no-param-reassign */
import { DataValidation, Worksheet } from 'exceljs';
import { columnResolver } from './resolvers.js';
import {
  ROWS_IN_UNIT, Configs,
} from './config.js';
import { totalSumFormula, writeDayHours, writeEveningHours } from './formulas.js';
import {
  getNthNextColumn, getExcludedColumns,
} from './utils.js';
import { TotalHours } from './generator.js';
import {
  BLOCK_HEADER_FORMAT, dayHoursCell, eveningHoursCell, totalDayHoursCell, totalEveningHoursCell,
} from './block.js';

const writeInputDataValidation = (sheet: Worksheet, col: string, row: number) => {
  const startInput = sheet.getCell(col + (row + 2));
  const finishInput = sheet.getCell(
    getNthNextColumn(col, 1) + (row + 2),
  );
  const validation: DataValidation = {
    type: 'decimal',
    operator: 'between',
    showErrorMessage: true,
    formulae: [0.0, 24.0],
    errorStyle: 'error',
    errorTitle: 'Virheellinen kellonaika',
    error: 'Käytä pilkkua erottaessasi tunnit ja minuutit, esim. 16,5. Kellonaika täytyy olla välillä 0,0-24,0',
  };
  startInput.dataValidation = validation;
  finishInput.dataValidation = validation;
  startInput.protection = { locked: false };
  finishInput.protection = { locked: false };
};

const writeStartFinish = (sheet: Worksheet, col: string, row: number) => {
  const start = sheet.getCell(col + (row + 1));
  const finish = sheet.getCell(getNthNextColumn(col, 1) + (row + 1));
  start.value = 'Alkaa';
  finish.value = 'Loppuu';
};

const addBorders = (sheet: Worksheet, col: string, row: number) => {
  const cell = sheet.getCell(col + row);
  cell.border = {
    top: { style: 'thin' },
    left: { style: 'thin' },
    right: { style: 'thin' },
  };
  let i = 1;
  while (i < ROWS_IN_UNIT - 1) {
    const leftCellBelow = sheet.getCell(col + (row + i));
    leftCellBelow.border = { left: { style: 'thin' } };
    const rightCellBelow = sheet.getCell(getNthNextColumn(col, 1) + (row + i));
    rightCellBelow.border = { right: { style: 'thin' } };
    // eslint-disable-next-line no-plusplus
    i++;
  }
  const bottomLeftCell = sheet.getCell(col + (row + i));
  bottomLeftCell.border = {
    bottom: { style: 'thin' },
    left: { style: 'thin' },
    right: { style: 'thin' },
  };
};

const styleDateCell = (sheet: Worksheet, col: string, row: number) => {
  const nextCol = getNthNextColumn(col, 1);
  sheet.mergeCells(col + row, nextCol + row);
  sheet.getCell(col + row).alignment = {
    vertical: 'middle',
    horizontal: 'center',
  };
  sheet.getCell(col + row).font = { size: 14 };
  addBorders(sheet, col, row);
};

const writeFormulas = (sheet: Worksheet, col: string, row: number) => {
  const dayHourCol = writeDayHours(sheet, col, row);
  const eveningHourCol = writeEveningHours(sheet, col, row);
  return { dayHourCol, eveningHourCol };
};

const writeBlock = (sheet: Worksheet, col: string, row: number, value: string) => {
  sheet.getCell(col + row).value = value;
  writeStartFinish(sheet, col, row);
  writeInputDataValidation(sheet, col, row);
  styleDateCell(sheet, col, row);
  writeFormulas(sheet, col, row);
  return sheet;
};

const writeCalendar = (sheet: Worksheet, current: Date, last: number, config: Configs, getRow: (date: number) => number, hours: TotalHours): { sheet: Worksheet, hours: TotalHours } => {
  const currentDate = current.getDate();
  const nextDate = new Date(current.getFullYear(), current.getMonth(), current.getDate() + 1);
  const col = columnResolver(current.getDay());
  if (!getExcludedColumns(config.days).includes(col)) {
    const row = getRow(current.getDate());
    const value = current.toLocaleDateString('fi-FI', BLOCK_HEADER_FORMAT);
    const mutatedSheet = writeBlock(sheet, col, row, value);
    const hourCols = { dayHours: dayHoursCell(col, row), eveningHours: eveningHoursCell(col, row) };
    const newHours: TotalHours = { dayHours: [...hours.dayHours, hourCols.dayHours], eveningHours: [...hours.eveningHours, hourCols.eveningHours] };
    return (currentDate === last) ? { sheet: mutatedSheet, hours: newHours } : writeCalendar(mutatedSheet, nextDate, last, config, getRow, newHours);
  }
  return (currentDate === last) ? { sheet, hours } : writeCalendar(sheet, nextDate, last, config, getRow, hours);
};

const writeMonthlyTotal = (sheet: Worksheet, hours: TotalHours, name: string) => {
  sheet.getCell(totalDayHoursCell).value = {
    formula: totalSumFormula(hours.dayHours),
    date1904: false,
  };
  sheet.getCell(totalEveningHoursCell).value = {
    formula: totalSumFormula(hours.eveningHours),
    date1904: false,
  };
  sheet.getCell('B2').value = 'Päivätuntia';
  sheet.getCell('B3').value = 'Iltatuntia';
  sheet.getCell('A1').value = name;
  sheet.getCell('A1').alignment = {
    vertical: 'middle',
    horizontal: 'center',
  };
  sheet.mergeCells('A1', 'B1');
};

export { writeMonthlyTotal, writeCalendar };
