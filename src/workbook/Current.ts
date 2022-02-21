import { resolveColumn } from './utils.js';
import {
  GAP, START_ROW,
  DAYS_TO_COL,
} from '../config.js';

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

  incrementDay(days: number) {
    switch (days) {
      case 6:
        if (this.col === DAYS_TO_COL.SATURDAY) {
          this.day.setDate(this.day.getDate() + 2);
          this.incrementRow();
        } else this.day.setDate(this.day.getDate() + 1);
        break;
      case 5:
        if (this.col === DAYS_TO_COL.FRIDAY) {
          this.day.setDate(this.day.getDate() + 3);
          this.incrementRow();
        } else this.day.setDate(this.day.getDate() + 1);
        break;
      default:
        if (this.col === DAYS_TO_COL.SUNDAY) {
          this.incrementRow();
        }
        this.day.setDate(this.day.getDate() + 1);
    }
    this.col = resolveColumn(this.day);
  }

  private incrementRow() {
    this.row += GAP;
  }

  getCurrentCellAddress() {
    return this.col + this.row;
  }
}

export default Current;
