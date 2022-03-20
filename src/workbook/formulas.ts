import { Worksheet } from 'exceljs';
import { FormulaFunction } from './config.js';
import { getNeighbourCell } from './utils.js';

const dayHoursFormula = (start: string, finish: string) => `IF(${start}>18,0,IF(${finish}<=18,${finish}-${start},IF(${finish}>18,18-${start},0)))`;
const eveningHoursFormula = (start: string, finish: string) => `IF(${start}>18,${finish}-${start},IF(${finish}>18,${finish}-18,0))`;
const allHoursFormula = (start: string, finish: string) => `${finish}-${start}`;
const sumFormula = (columns: string[], row: number) => columns.map((col) => col + row).join('+');
const totalSumFormula = (cells: string[]) => cells.join('+');

const writeFormula = (sheet: Worksheet, startCell: string, formula: FormulaFunction, i: number) => {
  const formulaCell = sheet.getCell(getNeighbourCell(startCell, 0, 3 + i));
  formulaCell.value = {
    formula: formula(getNeighbourCell(startCell, 0, 2), getNeighbourCell(startCell, 1, 2)),
    date1904: false,
    result: 0,
  };
};

export {
  dayHoursFormula, eveningHoursFormula, allHoursFormula, sumFormula, totalSumFormula, writeFormula,
};
