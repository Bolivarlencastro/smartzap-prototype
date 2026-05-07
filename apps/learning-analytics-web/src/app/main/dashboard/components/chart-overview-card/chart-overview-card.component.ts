import { Component, Input } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'kp-chart-overview-card',
  templateUrl: './chart-overview-card.component.html',
  styleUrls: ['./chart-overview-card.component.scss'],
  imports: [MatIcon, DecimalPipe],
})
export class ChartOverviewCardComponent {
  @Input() title!: string;
  @Input() subtitle!: string;
  @Input() value!: number;
  @Input() target!: number;
}
