import Phaser from 'phaser';
import { GAME_HEIGHT, GAME_WIDTH } from '../config';

const CELL_SIZE = 32;
const FIELD_COLOR = 0x315c32;
const GRID_COLOR = 0x477849;

export class FieldScene extends Phaser.Scene {
  constructor() {
    super('Field');
  }

  create(): void {
    this.cameras.main.setBackgroundColor(FIELD_COLOR);

    const grid = this.add.graphics();
    grid.lineStyle(1, GRID_COLOR, 0.75);

    for (let x = 0; x <= GAME_WIDTH; x += CELL_SIZE) {
      grid.lineBetween(x, 0, x, GAME_HEIGHT);
    }

    for (let y = 0; y <= GAME_HEIGHT; y += CELL_SIZE) {
      grid.lineBetween(0, y, GAME_WIDTH, y);
    }
  }
}
