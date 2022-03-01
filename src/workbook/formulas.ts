import { Worksheet } from 'exceljs';
import { dayHoursCell, eveningHoursCell } from './block.js';
import { getNthNextColumn } from './utils.js';

const dayHoursFormula = (start: string, finish: string) => `IF(${start}>18,0,IF(${finish}<=18,${finish}-${start},IF(${finish}>18,18-${start},0)))`;
const eveningHoursFormula = (start: string, finish: string) => `IF(${start}>18,${finish}-${start},IF(${finish}>18,${finish}-18,0))`;
const allHoursFormula = (start: string, finish: string) => `${finish}-${start}`;
const sumFormula = (columns: string[], row: number) => columns.map((col) => col + row).join('+');
const totalSumFormula = (cells: string[]) => cells.join('+');

// const writeAllHours = (sheet: Worksheet, col: string, row: number) => {
//   const cell = sheet.getCell(allHoursCell(col, row));
//   const formula = allHoursFormula(col + (row + 2), getNthNextColumn(col, 1) + (row + 2));
//   cell.value = {
//     formula,
//     date1904: false,
//     result: 0,
//   };
//   sheet.mergeCells(allHoursCell(col, row), getNthNextColumn(col, 1) + (row + 4));
//   return allHoursCell(col, row);
// };

const writeEveningHours = (sheet: Worksheet, col: string, row: number) => {
  const cell = sheet.getCell(eveningHoursCell(col, row));
  const formula = eveningHoursFormula(
    col + (row + 2),
    getNthNextColumn(col, 1) + (row + 2),
  );
  cell.value = {
    formula,
    date1904: false,
    result: 0,
  };
  sheet.mergeCells(eveningHoursCell(col, row), getNthNextColumn(col, 1) + (row + 4));
  return eveningHoursCell(col, row);
};

const writeDayHours = (sheet: Worksheet, col: string, row: number) => {
  const cell = sheet.getCell(dayHoursCell(col, row));
  const formula = dayHoursFormula(
    col + (row + 2),
    getNthNextColumn(col, 1) + (row + 2),
  );
  cell.value = {
    formula,
    date1904: false,
    result: 0,
  };
  sheet.mergeCells(dayHoursCell(col, row), getNthNextColumn(col, 1) + (row + 3));
  return dayHoursCell(col, row);
};

export {
  dayHoursFormula, eveningHoursFormula, allHoursFormula, sumFormula, totalSumFormula, writeDayHours, writeEveningHours,
};
