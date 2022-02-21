import { DataValidation, Worksheet } from 'exceljs';
import { Configs } from '../config';
import { DAYS_TO_COL, ROWS_IN_UNIT } from '../config.js';
import Current from './current.js';
import { getLastDayOfWeek, getNthNextColumn } from './utils.js';
import formulas from './formulas.js';

class Sheet {
  sheet: Worksheet;

  name: string;

  first: Date;

  last: Date;

  daySumCells: string[] = [];

  eveningSumCells: string[] = [];

  current: Current;

  configs: Configs;

  constructor(worksheet: Worksheet, name: string, first: Date, last: Date, configs: Configs) {
    this.sheet = worksheet;
    this.name = name;
    this.first = first;
    this.last = last;
    this.current = new Current(first);
    this.configs = configs;
  }

  private writeCurrentDateCell() {
    this.sheet.getCell(this.current.getCol() + this.current.getRow())
      .value = this.current.getDay().toLocaleDateString('fi-FI', {
        weekday: 'short',
        month: 'numeric',
        day: 'numeric',
        year: 'numeric',
      });
  }

  private writeStartFinish = () => {
    const start = this.sheet.getCell(this.current.getCol() + (this.current.getRow() + 1));
    const finish = this.sheet.getCell(
      getNthNextColumn(this.current.getCol(), 1) + (this.current.getRow() + 1),
    );
    start.value = 'Alkaa';
    finish.value = 'Loppuu';
  };

  private writeInputDataValidation = () => {
    const startInput = this.sheet.getCell(this.current.getCol() + (this.current.getRow() + 2));
    const finishInput = this.sheet.getCell(
      getNthNextColumn(this.current.getCol(), 1) + (this.current.getRow() + 2),
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

  private styleDateCell = () => {
    const nextCol = getNthNextColumn(this.current.getCol(), 1);
    this.sheet.mergeCells(this.current.getCurrentCellAddress(), nextCol + this.current.getRow());
    this.sheet.getCell(this.current.getCurrentCellAddress()).alignment = {
      vertical: 'middle',
      horizontal: 'center',
    };
    this.sheet.getCell(this.current.getCurrentCellAddress()).font = { size: 14 };
    this.addBorders();
  };

  private writeAllHoursFunction = () => {
    const col = this.current.getCol();
    const row = this.current.getRow();
    const cell = this.sheet.getCell(col + (row + 4));
    const formula = formulas.allHoursFormula(col + (row + 2), getNthNextColumn(col, 1) + (row + 2));
    cell.value = {
      formula,
      date1904: false,
      result: 0,
    };
    this.sheet.mergeCells(col + (row + 4), getNthNextColumn(col, 1) + (row + 4));
  };

  private writeDayHoursFunction = () => {
    const row = this.current.getRow();
    const col = this.current.getCol();
    const cell = this.sheet.getCell(col + (row + 3));
    const formula = formulas.dayHoursFormula(
      col + (row + 2),
      getNthNextColumn(col, 1) + (row + 2),
    );
    cell.value = {
      formula,
      date1904: false,
      result: 0,
    };
    this.sheet.mergeCells(col + (row + 3), getNthNextColumn(col, 1) + (row + 3));
  };

  private writeEveningHoursFunction = () => {
    const row = this.current.getRow();
    const col = this.current.getCol();
    const cell = this.sheet.getCell(col + (row + 4));
    const formula = formulas.eveningHoursFormula(
      col + (row + 2),
      getNthNextColumn(col, 1) + (row + 2),
    );
    cell.value = {
      formula,
      date1904: false,
      result: 0,
    };
    this.sheet.mergeCells(col + (row + 4), getNthNextColumn(col, 1) + (row + 4));
  };

  private writeWeekTotal = (
    dayColumns: string[],
    eveningColumns: string[],
  ) => {
    const row = this.current.getRow();
    const col = getNthNextColumn(this.current.getCol(), 2);
    this.sheet.getCell(col + row).value = 'VIIKKO YHTEENSÄ';
    this.sheet.getCell(col + row).font = { size: 18 };
    this.sheet.mergeCells(col + row, getNthNextColumn(col, 3) + row);
    const daySum = this.sheet.getCell(col + (row + 3));
    daySum.value = {
      formula: formulas.sumFormula(dayColumns, row + 3),
      date1904: false,
    };
    const daySumText = this.sheet.getCell(getNthNextColumn(col, 1) + (row + 3));
    daySumText.value = 'Päivätuntia';
    const eveningSum = this.sheet.getCell(col + (row + 4));
    eveningSum.value = {
      formula: formulas.sumFormula(eveningColumns, row + 4),
      date1904: false,
    };
    const eveningSumText = this.sheet.getCell(getNthNextColumn(col, 1) + (row + 4));
    eveningSumText.value = 'Iltatuntia';
    return [daySum.address, eveningSum.address];
  };

  private addBorders = () => {
    const col = this.current.getCol();
    const row = this.current.getRow();
    const cell = this.sheet.getCell(col + row);
    cell.border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      right: { style: 'thin' },
    };
    let i = 1;
    while (i < ROWS_IN_UNIT - 1) {
      const leftCellBelow = this.sheet.getCell(col + (row + i));
      leftCellBelow.border = { left: { style: 'thin' } };
      const rightCellBelow = this.sheet.getCell(getNthNextColumn(col, 1) + (row + i));
      rightCellBelow.border = { right: { style: 'thin' } };
      // eslint-disable-next-line no-plusplus
      i++;
    }
    const bottomLeftCell = this.sheet.getCell(col + (row + i));
    bottomLeftCell.border = {
      bottom: { style: 'thin' },
      left: { style: 'thin' },
      right: { style: 'thin' },
    };
  };

  writeCalendar() {
    let dayHourColumnsOfCurrentRow: string[] = [];
    let eveningHourColumnsOfCurrentRow: string[] = [];
    while (this.current.getDay() <= this.last) {
      eveningHourColumnsOfCurrentRow.push(this.current.getCol());
      this.writeCurrentDateCell();
      this.writeStartFinish();
      this.writeInputDataValidation();
      this.styleDateCell();
      if (this.current.getCol() !== DAYS_TO_COL.SATURDAY
     && this.current.getCol() !== DAYS_TO_COL.SUNDAY) {
        dayHourColumnsOfCurrentRow.push(this.current.getCol());
        this.writeDayHoursFunction();
        this.writeEveningHoursFunction();
      } else {
        this.writeAllHoursFunction();
      }
      if (this.current.getCol() === getLastDayOfWeek(this.configs.days)) {
        const [daySum, eveningSum] = this.writeWeekTotal(
          dayHourColumnsOfCurrentRow,
          eveningHourColumnsOfCurrentRow,
        );
        this.daySumCells.push(daySum);
        this.eveningSumCells.push(eveningSum);
        dayHourColumnsOfCurrentRow = [];
        eveningHourColumnsOfCurrentRow = [];
      }
      this.current.incrementDay(this.configs.days);
    }
  }

  writeMonthlyTotals() {
    this.sheet.getCell('A2').value = {
      formula: formulas.totalSumFormula(this.daySumCells),
      date1904: false,
    };
    this.sheet.getCell('A3').value = {
      formula: formulas.totalSumFormula(this.eveningSumCells),
      date1904: false,
    };
    this.sheet.getCell('B2').value = 'Päivätuntia';
    this.sheet.getCell('B3').value = 'Iltatuntia';
    this.sheet.getCell('A1').value = this.name;
    this.sheet.getCell('A1').alignment = {
      vertical: 'middle',
      horizontal: 'center',
    };
    this.sheet.mergeCells('A1', 'B1');
  }

  protect() {
    this.sheet.protect('password', {});
  }
}

export default Sheet;
