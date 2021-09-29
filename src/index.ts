import input from './input.json'
import { generateWorkBook } from './workbookGenerator.js'

interface Input {
  prop1: string,
  prop2: number
}

const workbook = generateWorkBook(input.prop2)
workbook.xlsx.writeFile('./workbooks/workbook.xlsx')
