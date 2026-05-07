import { Component, Input } from '@angular/core';
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'kp-progress-circle',
  templateUrl: './kp-progress-circle.component.html',
  styleUrls: ['./kp-progress-circle.component.scss'],
  imports: [DecimalPipe],
})
export class KpProgressCircleComponent {
  @Input() value: number;

  constructor() {
    this.value = 0;
  }
}
