import input from './input.json'
import { generateWorkBook } from './workbookGenerator.js'

const workbook = generateWorkBook(input.prop2)
workbook.xlsx.writeFile('./workbooks/workbook.xlsx')
