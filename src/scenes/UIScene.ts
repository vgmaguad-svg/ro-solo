import Phaser from 'phaser';
import { APP_TITLE } from '../config';

export class UIScene extends Phaser.Scene {
  constructor() {
    super('UI');
  }

  create(): void {
    this.add
      .text(24, 20, APP_TITLE, {
        color: '#f4f1d0',
        fontFamily: 'monospace',
        fontSize: '24px',
        fontStyle: 'bold',
        stroke: '#17331e',
        strokeThickness: 4,
      })
      .setScrollFactor(0);
  }
}
