import generateWorkBook from './generator.js';
import { getConfigs } from './config.js';

const months = [0, 1];
const configs = getConfigs(6);

months.forEach((month) => {
  const date = new Date();
  date.setMonth(month);
  const workbook = generateWorkBook(month, ['John', 'Jane'], configs);
  workbook.xlsx.writeFile(`./workbooks/${date.toLocaleString('fi', { month: 'long' })}.xlsx`);
});
