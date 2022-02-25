const dayHoursFormula = (start: string, finish: string) => `IF(${start}>18,0,IF(${finish}<=18,${finish}-${start},IF(${finish}>18,18-${start},0)))`;
const eveningHoursFormula = (start: string, finish: string) => `IF(${start}>18,${finish}-${start},IF(${finish}>18,${finish}-18,0))`;
const allHoursFormula = (start: string, finish: string) => `${finish}-${start}`;
const sumFormula = (columns: string[], row: number) => columns.map((col) => col + row).join('+');
const totalSumFormula = (cells: string[]) => cells.join('+');

export default {
  dayHoursFormula, eveningHoursFormula, allHoursFormula, sumFormula, totalSumFormula,
};
