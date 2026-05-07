import { booleanAttribute, ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatProgressBar } from '@angular/material/progress-bar';
import { TranslocoPipe } from '@jsverse/transloco';
import { KpCategoryLabelPipe, KpContentIconName, KpDurationPipe } from '../../pipes';
import { KpInfoTagComponent } from '../kp-info-tag';
import { PulseCardDto } from './models';

const DEFAULT_BACKGROUND_IMAGE = 'https://assets.keepsdev.com/images/placeholders/v2/pulse.png';

@Component({
  selector: 'kp-pulse-card',
  host: { '[class.kp-pulse-card-legacy]': 'legacyMode', '[class.is-inactive]': 'pulse?.is_active === false' },
  imports: [
    KpInfoTagComponent,
    MatIcon,
    MatProgressBar,
    TranslocoPipe,
    MatIconButton,
    KpContentIconName,
    KpCategoryLabelPipe,
    KpDurationPipe,
  ],
  templateUrl: './kp-pulse-card.component.html',
  styleUrl: './kp-pulse-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KpPulseCardComponent {
  @Input({ required: true }) pulse: PulseCardDto;
  @Input({ transform: booleanAttribute }) showFavoriteButton = true;
  @Input({ transform: booleanAttribute }) legacyMode = true;
  @Output() favoriteToggle = new EventEmitter<void>();

  get backGroundImage() {
    return this.pulse?.cover_image ? `url(${this.pulse.cover_image})` : `url(${DEFAULT_BACKGROUND_IMAGE})`;
  }

  onFavoriteToggle(event: MouseEvent) {
    event?.stopPropagation();
    this.favoriteToggle.emit();
  }
}
