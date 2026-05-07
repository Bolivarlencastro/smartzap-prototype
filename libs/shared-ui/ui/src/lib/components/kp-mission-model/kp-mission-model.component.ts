import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import { TranslocoPipe } from '@jsverse/transloco';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'kp-mission-model',
  templateUrl: './kp-mission-model.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatIcon, TranslocoPipe],
})
export class KpMissionModelComponent {
  @Input() mission: any;
  @Input() withShadow = false;
}
