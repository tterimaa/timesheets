import { DataValidation, Worksheet } from 'exceljs';
import { getNeighbourCell, getColAndRow } from './utils.js';
import {
  totalSumFormula, writeFormula,
} from './formulas.js';
import { Block } from './block.js';
import { Formula } from './config.js';
import { Aggregator } from '../model/request.js';

const writeInputDataValidation = (sheet: Worksheet, cell: string) => {
  const startInput = sheet.getCell(getNeighbourCell(cell, 0, 2));
  const finishInput = sheet.getCell(getNeighbourCell(cell, 1, 2));
  const validation: DataValidation = {
    type: 'decimal',
    operator: 'between',
    showErrorMessage: true,
    formulae: [0.0, 24.0],
    errorStyle: 'error',
    errorTitle: 'Wrong time',
    error: 'Use comma "," for separating hours and minutes, e.g. 16,5. Time must be between 0,0-24,0',
  };
  startInput.dataValidation = validation;
  finishInput.dataValidation = validation;
  startInput.protection = { locked: false };
  finishInput.protection = { locked: false };
};

const writeStartFinish = (sheet: Worksheet, cell: string, startHeader: string, endHeader: string) => {
  const start = sheet.getCell(getNeighbourCell(cell, 0, 1));
  const finish = sheet.getCell(getNeighbourCell(cell, 1, 1));
  start.value = startHeader;
  finish.value = endHeader;
};

const writeFormulas = (sheet: Worksheet, cell: string, formulas: Array<Formula>) => {
  formulas.forEach((formula, i) => {
    if (!formula.disabledForCols.includes(getColAndRow(cell)[0])) {
      writeFormula(sheet, cell, formula.function, i);
    }
  });
};

const writeBlock = (sheet: Worksheet, block: Block, formulas: Array<Formula>, startHeader: string, endHeader: string) => {
  sheet.getCell(block.headerCell).value = block.header;
  writeStartFinish(sheet, block.headerCell, startHeader, endHeader);
  writeInputDataValidation(sheet, block.headerCell);
  writeFormulas(sheet, block.headerCell, formulas);
};

interface FormulaToOutputCells {
  name: string,
  cells: Array<string>,
}

interface TotalCells {
  value: string,
  header: string,
}

const getTotalHoursCells = (startCell: string, formulaNames: string[]): TotalCells[] => formulaNames.map((name, i) => ({
  value: getNeighbourCell(startCell, 0, i + 1),
  header: getNeighbourCell(startCell, 1, i + 1),
}));

const writeTitle = (sheet: Worksheet, name: string, cell: string) => {
  sheet.getCell(cell).value = name;
};

const writeTotalHours = (sheet: Worksheet, formulaToOutputCells: Array<FormulaToOutputCells>, totalHoursCells: TotalCells[]) => {
  formulaToOutputCells.forEach((f, i) => {
    sheet.getCell(totalHoursCells[i].value).value = { formula: totalSumFormula(f.cells), date1904: false };
    sheet.getCell(totalHoursCells[i].header).value = f.name;
  });
};

const writeSummary = (sheet: Worksheet, titleCell: string, aggregators: Aggregator[], totalHoursCells: TotalCells[]) => {
  aggregators.forEach((a, i) => {
    sheet.getCell(getNeighbourCell(titleCell, 0, i)).value = {
      formula: totalSumFormula(a.functionIndexes.map((idx) => totalHoursCells[idx].value)),
      date1904: false,
    };
    sheet.getCell(getNeighbourCell(titleCell, 1, i)).value = a.header;
  });
};

export {
  writeTotalHours, writeBlock, getTotalHoursCells, writeSummary, writeTitle,
};
