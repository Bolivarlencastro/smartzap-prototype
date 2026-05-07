import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import { NgStyle } from '@angular/common';

@Component({
  selector: 'kp-status-chip',
  templateUrl: './kp-status-chip.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgStyle],
})
export class KpStatusChipComponent {
  @Input() color = '#606060';
  @Input() disabled = false;
}
