import generateWorkBook from './workbookGenerator.js';

const workbook = generateWorkBook(10, ['John', 'Jane']);
workbook.xlsx.writeFile('./workbooks/workbook.xlsx');
