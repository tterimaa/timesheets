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
const GAP = 5 // Minimum 5

const dayHoursFormula = (start: string, finish: string) => `IF(${start}>18,0,IF(${finish}<=18,${finish}-${start},IF(${finish}>18,18-${start},0)))`
const eveningHoursFormula = (start: string, finish: string) => `IF(${start}>18,${finish}-${start},IF(${finish}>18,${finish}-18,0))`
const sumFormula = (columns: string[], row: number) => {
  const cells = columns.map(col => col + row)
  return cells.join('+')
}
const totalSumFormula = (cells: string[]) => cells.join('+')

const getFirstAndLastDaysOfMonth = (month: number) => {
  const first = new Date(2021, month - 1) // Date API months range 0-11
  const last = new Date(2021, month, 0) // Day 0 gives last day of previous month
  return [first, last]
}

const resolveColumn = (date: Date) => {
  const day = date.getDay()
  return COLUMNS[day]
}

const getNthNextColumn = (col: string, n: number) => {
  if (col.length > 1) {
    console.error(
      'Next column can only be resolved for single character representing columns from A-Z'
    )
  }
  const char = col[0].toUpperCase()
  if (String.fromCharCode(char.charCodeAt(0) + n) > 'Z') {
    console.error(`Can't resolve ${n}:th next column because it's greater than Z, which is the last column of the sheet`)
  }
  return String.fromCharCode(col.charCodeAt(0) + n)
}

const writeDateCell = (cell: Cell, day: Date) => {
  cell.value = day.toLocaleDateString('fi-FI', { weekday: 'short', month: 'numeric', day: 'numeric', year: 'numeric' })
}

const styleDateCell = (sheet: Worksheet, cell: Cell, col: string, row: number) => {
  const nextCol = getNthNextColumn(col, 1)
  sheet.mergeCells(col + row, nextCol + row)
  cell.alignment = { vertical: 'middle', horizontal: 'center' }
  cell.font = { size: 18 } 
}

const writeStartFinish = (sheet: Worksheet, col: string, row: number) => {
  const start = sheet.getCell(col + (row + 1))
  const finish = sheet.getCell(getNthNextColumn(col, 1) + (row + 1))
  start.value = 'Alkaa'
  finish.value = 'Loppuu'
  const font = { size: 18 }
  start.font = font
  finish.font = font
}

const writeDayHoursFunction = (sheet: Worksheet, col: string, row: number) => {
  const cell = sheet.getCell(col + (row + 3))
  const formula = dayHoursFormula(col + (row + 2), getNthNextColumn(col, 1) + (row + 2))
  cell.value = { formula , date1904: false, result: 0 }
  sheet.mergeCells(col + (row + 3), getNthNextColumn(col, 1) + (row + 3))
}

const writeEveningHoursFunction = (sheet: Worksheet, col: string, row: number) => {
  const cell = sheet.getCell(col + (row + 4))
  const formula = eveningHoursFormula(col + (row + 2), getNthNextColumn(col, 1) + (row + 2))
  cell.value = { formula , date1904: false, result: 0 }
  sheet.mergeCells(col + (row + 4), getNthNextColumn(col, 1) + (row + 4))
}

const writeWeekTotal = (sheet: Worksheet, columns: string[], row: number, col: string) => {
  sheet.getCell(col + row).value = 'VIIKKO YHTEENSÄ'
  sheet.getCell(col + row).font = { size: 18 }
  sheet.mergeCells(col + row, getNthNextColumn(col, 3) + row)
  const daySum = sheet.getCell(col + (row + 3))
  daySum.value = { formula: sumFormula(columns, row + 3), date1904: false }
  const daySumText = sheet.getCell(getNthNextColumn(col, 1) + (row + 3))
  daySumText.value = 'Päivätuntia'
  const eveningSum = sheet.getCell(col + (row + 4))
  eveningSum.value = { formula: sumFormula(columns, row + 4), date1904: false }
  const eveningSumText = sheet.getCell(getNthNextColumn(col, 1) + (row + 4))
  eveningSumText.value = 'Iltatuntia'
  return [daySum.address, eveningSum.address]
}

const writeMonthlyTotals = (sheet: Worksheet, name: string, daySumCells: string[], eveningSumCells: string[]) => {
  sheet.getCell('A2').value = { formula: totalSumFormula(daySumCells), date1904: false }
  sheet.getCell('A3').value = { formula: totalSumFormula(eveningSumCells), date1904: false }
  sheet.getCell('B2').value = 'Päivätuntia'
  sheet.getCell('B3').value = 'Iltatuntia'
  sheet.getCell('A1').value = name
  sheet.getCell('A1').font = { size: 18 }
  sheet.getCell('A1').alignment = { vertical: 'middle', horizontal: 'center' }
  sheet.mergeCells('A1','B1')
}

const writeSheet = (sheet: Worksheet, name: string, firstDay: Date, lastDay: Date) => {
  const current = firstDay
  let row = START_ROW
  let columnsOfCurrentRow: string[] = []
  const daySumCells = []
  const eveningSumCells = []
  while (current <= lastDay) {
    const col = resolveColumn(current)
    columnsOfCurrentRow.push(col)
    const cell = sheet.getCell(col + row)
    writeDateCell(cell, current)
    styleDateCell(sheet, cell, col, row)
    writeStartFinish(sheet, col, row)
    writeDayHoursFunction(sheet, col, row)
    writeEveningHoursFunction(sheet, col, row)
    if (col === DAYS_TO_COL.SUNDAY) {
      const [daySum, eveningSum] = writeWeekTotal(sheet, columnsOfCurrentRow, row, getNthNextColumn(col, 2))
      daySumCells.push(daySum)
      eveningSumCells.push(eveningSum)
      row = row + GAP
      columnsOfCurrentRow = []
    }
    current.setDate(current.getDate() + 1)
  }
  writeMonthlyTotals(sheet, name, daySumCells, eveningSumCells)
}

export const generateWorkBook = (month: number, names: string[]): Workbook => {
  const workbook = new exceljs.Workbook()
  const [first, last] = getFirstAndLastDaysOfMonth(month)
  for(const name of names) {
  const sheet = workbook.addWorksheet(name, {
    properties: { defaultRowHeight: 20, defaultColWidth: 15 },
  })
  writeSheet(sheet, name, first, last)
  }
  return workbook
}
