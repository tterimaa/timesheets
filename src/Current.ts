import { resolveColumn } from './utils.js';
import {
  GAP, START_ROW,
} from './config.js';

class Current {
  private row: number;

  private col: string;

  private day: Date;

  constructor(day: Date) {
    this.day = day;
    this.col = resolveColumn(day);
    this.row = START_ROW;
  }

  getRow() {
    return this.row;
  }

  getCol() {
    return this.col;
  }

  getDay() {
    return this.day;
  }

  incrementDay() {
    this.day.setDate(this.day.getDate() + 1);
    this.col = resolveColumn(this.day);
  }

  incrementRow() {
    this.row += GAP;
  }

  getCurrentCellAddress() {
    return this.col + this.row;
  }
}

export default Current;
