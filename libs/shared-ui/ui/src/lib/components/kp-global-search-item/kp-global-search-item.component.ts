import { UpperCasePipe } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import { MatDivider } from '@angular/material/divider';
import { TranslocoPipe } from '@jsverse/transloco';
import { KpDisableContinueMissionDirective } from '../../directives/kp-disable-continue-mission/kp-disable-continue-mission.directive';
import { KpCardTagComponent } from '../kp-card-tag/kp-card-tag.component';
import { GlobalSearchItem, ItemType } from './model/global-search-item.model';
import { KpDurationPipe } from '../../pipes';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'kp-global-search-item',
  templateUrl: './kp-global-search-item.component.html',
  styles: [
    `
      .continue-button {
        opacity: 0;
        position: absolute;
        right: 0.5rem;
        top: 50%;
        transform: translateY(-50%);
      }

      .container:hover .continue-button {
        opacity: 1;
      }
    `,
  ],
  imports: [
    KpCardTagComponent,
    MatIconButton,
    MatIcon,
    KpDisableContinueMissionDirective,
    MatDivider,
    TranslocoPipe,
    UpperCasePipe,
    KpDurationPipe,
  ],
})
export class KpGlobalSearchItemComponent {
  @Input() item: GlobalSearchItem;
  @Output() openDetails = new EventEmitter<void>();
  @Output() openContent = new EventEmitter<void>();

  itemType = ItemType;

  onOpenDetails(): void {
    this.openDetails.emit();
  }

  onOpenContent(event: Event): void {
    event.stopPropagation();
    this.openContent.emit();
  }
}
