import exceljs, { Workbook, Worksheet, Cell, } from 'exceljs'

enum DAYS_TO_COL {
  SUNDAY = 'O',
  MONDAY = 'C',
  TUESDAY = 'E',
  WEDNESDAY = 'G',
  THURSDAY = 'I',
  FRIDAY = 'K',
  SATURDAY = 'M',
}

const COLUMNS = [
  DAYS_TO_COL.SUNDAY,
  DAYS_TO_COL.MONDAY,
  DAYS_TO_COL.TUESDAY,
  DAYS_TO_COL.WEDNESDAY,
  DAYS_TO_COL.THURSDAY,
  DAYS_TO_COL.FRIDAY,
  DAYS_TO_COL.SATURDAY,
]
const START_ROW = 4
const GAP = 5

const dayHoursFormula = (start: string, finish: string) => `IF(${start}>18,0,IF(${finish}<=18,${finish}-${start},IF(${finish}>18,18-${start},0)))`
const eveningHoursFormula = (start: string, finish: string) => `IF(${start}>18,${finish}-${start},IF(${finish}>18,${finish}-18,0))`

const getFirstAndLastDaysOfMonth = (month: number) => {
  const first = new Date(2021, month - 1) // Date API months range 0-11
  const last = new Date(2021, month, 0) // Day 0 gives last day of previous month
  return [first, last]
}

const resolveColumn = (date: Date) => {
  const day = date.getDay()
  return COLUMNS[day]
}

const getNextColumn = (col: string) => {
  if (col.length > 1) {
    console.error(
      'Next column can only be resolved for single character representing columns from A-Z'
    )
  }
  const char = col[0].toUpperCase()
  if (char === 'Z') {
    console.error('Can\'t resolve next column for last column ')
  }
  return String.fromCharCode(col.charCodeAt(0) + 1)
}

const writeDateCell = (cell: Cell, day: Date) => {
  cell.value = day.toLocaleDateString('fi-FI', { weekday: 'short', month: 'numeric', day: 'numeric', year: 'numeric' })
}

const styleDateCell = (sheet: Worksheet, cell: Cell, col: string, row: number) => {
  const nextCol = getNextColumn(col)
  sheet.mergeCells(col + row, nextCol + row)
  cell.alignment = { vertical: 'middle', horizontal: 'center' }
  cell.font = { size: 18 } 
}

const writeStartFinish = (sheet: Worksheet, col: string, row: number) => {
  const start = sheet.getCell(col + (row + 1))
  const finish = sheet.getCell(getNextColumn(col) + (row + 1))
  start.value = 'Alkaa'
  finish.value = 'Loppuu'
  const font = { size: 18 }
  start.font = font
  finish.font = font
}

const writeDayHoursFunction = (sheet: Worksheet, col: string, row: number) => {
  const cell = sheet.getCell(col + (row + 3))
  const formula = dayHoursFormula(col + (row + 2), getNextColumn(col) + (row + 2))
  cell.value = { formula , date1904: false, result: 0 }
  sheet.mergeCells(col + (row + 3), getNextColumn(col) + (row + 3))
}

const writeEveningHoursFunction = (sheet: Worksheet, col: string, row: number) => {
  const cell = sheet.getCell(col + (row + 4))
  const formula = eveningHoursFormula(col + (row + 2), getNextColumn(col) + (row + 2))
  cell.value = { formula , date1904: false, result: 0 }
  sheet.mergeCells(col + (row + 4), getNextColumn(col) + (row + 4))
}

const writeSheet = (sheet: Worksheet, firstDay: Date, lastDay: Date) => {
  const current = firstDay
  let row = START_ROW
  while (current <= lastDay) {
    const col = resolveColumn(current)
    const cell = sheet.getCell(col + row)
    writeDateCell(cell, current)
    styleDateCell(sheet, cell, col, row)
    writeStartFinish(sheet, col, row)
    writeDayHoursFunction(sheet, col, row)
    writeEveningHoursFunction(sheet, col, row)
    if (col === DAYS_TO_COL.SUNDAY) {
      row = row + GAP
    }
    current.setDate(current.getDate() + 1)
  }
}

export const generateWorkBook = (month: number): Workbook => {
  const workbook = new exceljs.Workbook()
  const [first, last] = getFirstAndLastDaysOfMonth(month)
  const sheet = workbook.addWorksheet('Tarmo', {
    properties: { defaultRowHeight: 20, defaultColWidth: 15 },
  })
  writeSheet(sheet, first, last)
  return workbook
}
