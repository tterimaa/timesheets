import input from './input.json'
import { generateWorkBook } from './workbookGenerator.js'

const workbook = generateWorkBook(10, input)
workbook.xlsx.writeFile('./workbooks/workbook.xlsx')
