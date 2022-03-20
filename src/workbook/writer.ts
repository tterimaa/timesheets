import { DataValidation, Worksheet } from 'exceljs';
import { getNeighbourCell, getColAndRow } from './utils.js';
import {
  totalSumFormula, writeFormula,
} from './formulas.js';
import { TotalHours } from './generator.js';
import { Block } from './block.js';
import { Formula } from './config.js';

const writeInputDataValidation = (sheet: Worksheet, cell: string) => {
  const startInput = sheet.getCell(getNeighbourCell(cell, 0, 2));
  const finishInput = sheet.getCell(getNeighbourCell(cell, 1, 2));
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

const writeStartFinish = (sheet: Worksheet, cell: string) => {
  const start = sheet.getCell(getNeighbourCell(cell, 0, 1));
  const finish = sheet.getCell(getNeighbourCell(cell, 1, 1));
  start.value = 'Alkaa';
  finish.value = 'Loppuu';
};

const writeFormulas = (sheet: Worksheet, cell: string, formulas: Array<Formula>) => {
  formulas.forEach((formula, i) => {
    if (!formula.disabledForCols.includes(getColAndRow(cell)[0])) {
      writeFormula(sheet, cell, formula.function, i);
    }
  });
};

const writeBlock = (sheet: Worksheet, block: Block, formulas: Array<Formula>) => {
  sheet.getCell(block.headerCell).value = block.header;
  writeStartFinish(sheet, block.headerCell);
  writeInputDataValidation(sheet, block.headerCell);
  writeFormulas(sheet, block.headerCell, formulas);
};

const writeMonthlyTotal = (sheet: Worksheet, hours: TotalHours, name: string) => {
  sheet.getCell('A2').value = {
    formula: totalSumFormula(hours.dayHours),
    date1904: false,
  };
  sheet.getCell('A3').value = {
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

export { writeMonthlyTotal, writeBlock };
