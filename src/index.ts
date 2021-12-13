import generateWorkBook from './workbookGenerator.js';
import { configs } from './config.js';

const months = [0, 1];
configs.days = 6;

months.forEach((month) => {
  const date = new Date();
  date.setMonth(month);
  const workbook = generateWorkBook(month, ['John', 'Jane']);
  workbook.xlsx.writeFile(`./workbooks/${date.toLocaleString('fi', { month: 'long' })}.xlsx`);
});
