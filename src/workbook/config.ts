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

export interface Formula {
  id: number,
  name: string,
  function: FormulaFunction
  disabledForCols: string[]
}

export interface Configs {
  days: number;
  formulas: Array<Formula>;
  gap: number;
  startRow: number,
  titleCell: string,
}

export interface ConfigsInput {
  days?: number;
  formulas?: Array<FormulaInput>;
}

const defaultConfig = {
  days: 7,
  formulas: [
    {
      id: 0,
      name: 'Päivätunnit',
      function: dayHoursFormula,
      disabledForCols: [],
    },
    {
      id: 1,
      name: 'Iltatunnit',
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
  const startRow = START_ROW;
  const titleCell = TITLE_CELL;
  return {
    days,
    formulas,
    gap,
    startRow,
    titleCell,
  };
};
