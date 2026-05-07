import { booleanAttribute, ChangeDetectionStrategy, Component, HostBinding, Input } from '@angular/core';

import { MatIconModule } from '@angular/material/icon';
import { ICONS_MAP, LABELS_MAP } from './helpers';
import { TranslocoModule } from '@jsverse/transloco';
import { CardTagType } from '../../models';

const DISPLAY_LABEL_TYPES: CardTagType[] = ['goal-to', 'goal-due-by', 'goal-expires-in'];

@Component({
  selector: 'kp-card-tag',
  imports: [MatIconModule, TranslocoModule],
  templateUrl: './kp-card-tag.component.html',
  styleUrls: ['./kp-card-tag.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KpCardTagComponent {
  @Input() icon: string;
  @Input() type: CardTagType;
  @Input() label: string;
  @Input() backgroundColor: string;
  @Input({ transform: booleanAttribute }) keepOpen: boolean;
  @Input({ transform: booleanAttribute }) textOnly = false;
  @Input({ transform: booleanAttribute }) noShadow = false;
  @Input() dotColor: string;

  @HostBinding('class.opened') get openedClass() {
    return this.keepOpen || this.textOnly;
  }

  @HostBinding('style.--dot-background') get dotBackground() {
    return this.dotColor;
  }

  @HostBinding('class.cast-shadow') get shadowClass() {
    return !this.noShadow;
  }

  @HostBinding('class') get typeClass() {
    return this.type;
  }

  get displayByType() {
    return !!this.type;
  }

  get includeLabelInTranslation() {
    return DISPLAY_LABEL_TYPES.includes(this.type);
  }

  get typeLabel() {
    return LABELS_MAP.get(this.type);
  }

  get templateIcon() {
    return ICONS_MAP.get(this.type) || this.icon;
  }
}
