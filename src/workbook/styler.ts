import { Borders, Worksheet } from 'exceljs';
import { getNeighbourCell } from './utils.js';
import { Block } from './block.js';

const BORDER_STYLE = 'thin';

const BORDER_TOP: Partial<Borders> = {
  top: { style: BORDER_STYLE },
  left: { style: BORDER_STYLE },
  right: { style: BORDER_STYLE },
};

const BORDER_SIDES: Partial<Borders> = {
  left: { style: BORDER_STYLE },
  right: { style: BORDER_STYLE },
};

const BORDER_LEFT: Partial<Borders> = {
  left: { style: BORDER_STYLE },
};

const BORDER_RIGHT: Partial<Borders> = {
  right: { style: BORDER_STYLE },
};

const BORDER_BOTTOM: Partial<Borders> = {
  left: { style: BORDER_STYLE },
  right: { style: BORDER_STYLE },
  bottom: { style: BORDER_STYLE },
};

const styleBlockHeader = (sheet: Worksheet, block: Block) => {
  sheet.mergeCells(block.headerCell, getNeighbourCell(block.headerCell, 1, 0));
  sheet.getCell(block.headerCell).border = BORDER_TOP;
  sheet.getCell(block.headerCell).alignment = {
    vertical: 'middle',
    horizontal: 'center',
  };
  sheet.getCell(block.headerCell).font = { size: 14 };
};

const styleStartFinish = (sheet: Worksheet, block: Block) => {
  sheet.getCell(block.startCell).border = BORDER_LEFT;
  sheet.getCell(block.finishCell).border = BORDER_RIGHT;
};

const styleInputs = (sheet: Worksheet, block: Block) => {
  sheet.getCell(block.startInputCell).border = BORDER_LEFT;
  sheet.getCell(block.finishInputCell).border = BORDER_RIGHT;
};

const styleFormulas = (sheet: Worksheet, block: Block) => {
  block.formulaCells.forEach((cell, i) => {
    sheet.mergeCells(cell, getNeighbourCell(cell, 1, 0));
    if (i === block.formulaCells.length - 1) {
      sheet.getCell(cell).border = BORDER_BOTTOM;
    } else {
      sheet.getCell(cell).border = BORDER_SIDES;
    }
  });
};

const styleBlock = (sheet: Worksheet, block: Block) => {
  styleBlockHeader(sheet, block);
  styleStartFinish(sheet, block);
  styleInputs(sheet, block);
  styleFormulas(sheet, block);
};

export { styleBlock };
