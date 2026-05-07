import { Component, EventEmitter, Input, Output } from '@angular/core';
import { KpChannelCardModel } from './models/kp-channel-card.model';
import { TranslocoPipe } from '@jsverse/transloco';
import { KpCategoryLabelPipe } from '../../pipes/kp-category-label/kp-category-label.pipe';
import { MatIcon } from '@angular/material/icon';
import { KpInfoTagComponent } from '../kp-info-tag/kp-info-tag.component';
import { MatDivider } from '@angular/material/divider';
import { MatTooltip } from '@angular/material/tooltip';
import { NgStyle, UpperCasePipe } from '@angular/common';

@Component({
  selector: 'kp-channel-card',
  templateUrl: './kp-channel-card.component.html',
  styleUrls: ['./kp-channel-card.component.scss'],
  imports: [
    NgStyle,
    MatTooltip,
    MatDivider,
    KpInfoTagComponent,
    MatIcon,
    UpperCasePipe,
    KpCategoryLabelPipe,
    TranslocoPipe,
  ],
})
export class KpChannelCardComponent {
  @Input() channel: KpChannelCardModel;
  @Output() clickEvent = new EventEmitter<KpChannelCardModel>();
  @Output() subscribeEvent = new EventEmitter<KpChannelCardModel>();
  defaultPlaceHolder = `https://assets.keepsdev.com/images/placeholders/v2/pulse.png`;

  onClick(): void {
    this.clickEvent.emit(this.channel);
  }

  get isOwnerOrContributor() {
    return this.channel?.is_owner || this.channel?.is_contributor;
  }

  onSubscribe(event: Event): void {
    event.stopPropagation();
    this.subscribeEvent.emit(this.channel);
  }
}
