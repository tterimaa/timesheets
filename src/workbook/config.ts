import {
  allHoursFormula,
  dayHoursFormula, eveningHoursFormula, FormulaFunction, FormulaInput, FORMULA_TYPE,
} from './formulas.js';

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

const START_ROW = 5;
const TITLE_CELL = 'A1';
const SUMMARY_START_CELL = 'A2';
const TOTALS_START_CELL = 'F1';
const START_HEADER = 'Start';
const END_HEADER = 'Finish';
const LOCALE = 'en-US';

export interface Formula {
  id: number,
  name: string,
  function: FormulaFunction
  disabledForCols: string[]
}

export interface Aggregator {
  functionIndexes: number[], // [1, 2] == total of function 1 + total of function 2
  header: string,
}

export interface Configs {
  days: number;
  formulas: Array<Formula>;
  startHeader: string,
  endHeader: string,
  gap: number;
  startRow: number,
  titleCell: string,
  totalsStartCell: string,
  summary: Summary
  locale: string,
}

interface Summary {
  startCell: string,
  aggregators: Aggregator[]
}

export interface ConfigsInput {
  days?: number;
  formulas?: Array<FormulaInput>;
  startHeader?: string,
  endHeader?: string,
  summary?: Summary
  locale?: string
}

const defaultConfig = {
  days: 7,
  formulas: [
    {
      id: 0,
      name: 'Day hours',
      function: dayHoursFormula,
      disabledForCols: [],
    },
    {
      id: 1,
      name: 'Evening hours',
      function: eveningHoursFormula,
      disabledForCols: [],
    },
  ],
};

const getFormula = (type: FORMULA_TYPE) => {
  switch (type) {
    case FORMULA_TYPE.DAY:
      return dayHoursFormula;
    case FORMULA_TYPE.EVENING:
      return eveningHoursFormula;
    case FORMULA_TYPE.ALL:
      return allHoursFormula;
    default:
      throw Error('Unknown formula type: should be DAY, EVENING or ALL');
  }
};

const getFormulas = (input: Array<FormulaInput>): Array<Formula> => input.map((f, i) => ({
  id: i, function: getFormula(f.type), name: f.name, disabledForCols: f.disabledForCols ? f.disabledForCols : [],
}));

export const getConfigs = (configsInput: ConfigsInput | undefined): Configs => {
  const days = !configsInput?.days ? defaultConfig.days : configsInput.days;
  const formulas = !configsInput?.formulas ? defaultConfig.formulas : getFormulas(configsInput.formulas);
  const gap = formulas.length + 3;
  const startHeader = configsInput?.startHeader ? configsInput.startHeader : START_HEADER;
  const endHeader = configsInput?.endHeader ? configsInput.endHeader : END_HEADER;
  const startRow = START_ROW;
  const titleCell = TITLE_CELL;
  const totalsStartCell = TOTALS_START_CELL;
  const summaryStartCell = SUMMARY_START_CELL;
  const aggregators = configsInput?.summary?.aggregators ? configsInput.summary.aggregators : [];
  const summary = { startCell: summaryStartCell, aggregators };
  const locale = configsInput?.locale ? configsInput.locale : LOCALE;
  return {
    days,
    formulas,
    startHeader,
    endHeader,
    gap,
    startRow,
    titleCell,
    totalsStartCell,
    summary,
    locale,
  };
};
