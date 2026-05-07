import { booleanAttribute, ChangeDetectionStrategy, Component, Input, numberAttribute } from '@angular/core';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { TranslocoModule } from '@jsverse/transloco';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { KpTimeConversionPipe } from '../../pipes/kp-time-conversion';

@Component({
  selector: 'kp-countdown-container',
  imports: [
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    TranslocoModule,
    MatProgressSpinnerModule,
    KpTimeConversionPipe,
  ],
  templateUrl: './kp-countdown-container.component.html',
  styleUrls: ['./kp-countdown-container.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KpCountdownContainerComponent {
  @Input({ transform: numberAttribute }) count: number;
  @Input({ transform: numberAttribute }) progress: number;
  @Input({ transform: booleanAttribute }) light: boolean;

  get finished() {
    return this.count === 0;
  }
}
