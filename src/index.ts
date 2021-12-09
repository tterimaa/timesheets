import generateWorkBook from './workbookGenerator.js';

const months = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];

months.forEach((month) => {
  const date = new Date();
  date.setMonth(month);
  const workbook = generateWorkBook(month, ['John', 'Jane']);
  workbook.xlsx.writeFile(`./workbooks/${date.toLocaleString('fi', { month: 'long' })}.xlsx`);
});
