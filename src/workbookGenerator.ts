import exceljs, { Workbook, Worksheet } from 'exceljs'

enum DAYS_TO_COL {
  SUNDAY = 'O',
  MONDAY = 'C',
  TUESDAY = 'E',
  WEDNESDAY = 'G',
  THURSDAY = 'I',
  FRIDAY = 'K',
  SATURDAY = 'M'
}

const COLUMNS = [DAYS_TO_COL.SUNDAY, DAYS_TO_COL.MONDAY, DAYS_TO_COL.TUESDAY, DAYS_TO_COL.WEDNESDAY, DAYS_TO_COL.THURSDAY, DAYS_TO_COL.FRIDAY, DAYS_TO_COL.SATURDAY]
const START_ROW = 1
const GAP = 5

const getFirstAndLastDaysOfMonth = (month: number) => {
    const first = new Date(2021, month - 1) // Date API months range 0-11
    const last = new Date(2021, month, 0) // Day 0 gives last day of previous month
    return [first, last]
}

const resolveColumn = (date: Date) => {
  const day = date.getDay()
  return COLUMNS[day]
}

const writeSheet = (sheet: Worksheet, firstDay: Date, lastDay: Date) => {
  const current = firstDay
  let row = START_ROW
  while (current <= lastDay) {
    const col = resolveColumn(current)
    const cell = sheet.getCell(col + row)
    cell.value = current.toLocaleDateString('fi-FI')
    if (col === DAYS_TO_COL.SUNDAY) {
      row = row + GAP
    }
    current.setDate(current.getDate() + 1)
  }
}

interface Input {
  prop1: string,
  prop2: number
}

export const generateWorkBook = (month: number, input: Input): Workbook => {
    const workbook = new exceljs.Workbook()
    const [first, last] = getFirstAndLastDaysOfMonth(input.prop2)
    const sheet = workbook.addWorksheet('Tarmo')
    writeSheet(sheet, first, last)
    return workbook
}