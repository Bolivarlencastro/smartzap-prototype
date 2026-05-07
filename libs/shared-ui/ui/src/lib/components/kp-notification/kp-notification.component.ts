import { Component, EventEmitter, Input, Output, ViewEncapsulation } from '@angular/core';
import { KpNotification, KpNotificationSelectEvent } from './kp-notification.model';
import { LanguageTypes } from '@keeps-platform-frontend-workspace/kp-keeps';
import { TranslocoPipe } from '@jsverse/transloco';
import { KpFromNowPipe } from '../../pipes/kp-from-now/kp-from-now.pipe';
import { MatTooltip } from '@angular/material/tooltip';
import { MatBadge } from '@angular/material/badge';
import { MatIcon } from '@angular/material/icon';
import { MatMenuTrigger, MatMenu, MatMenuItem } from '@angular/material/menu';
import { MatIconButton } from '@angular/material/button';

@Component({
  selector: 'kp-notification',
  templateUrl: './kp-notification.component.html',
  styleUrls: ['./kp-notification.component.scss'],
  encapsulation: ViewEncapsulation.None,
  imports: [
    MatIconButton,
    MatMenuTrigger,
    MatIcon,
    MatBadge,
    MatMenu,
    MatTooltip,
    MatMenuItem,
    KpFromNowPipe,
    TranslocoPipe,
  ],
})
export class KpNotificationComponent {
  @Input() notifications: KpNotification[] | null;
  @Input() count: number | null;
  @Input() locale!: LanguageTypes;
  @Output() selectItem = new EventEmitter<KpNotificationSelectEvent>();
  @Output() removeItem = new EventEmitter<string>();
  @Output() readAll = new EventEmitter<void>();

  onDiscardNotification(event: MouseEvent, notification: KpNotification): void {
    event.stopPropagation();
    this.removeItem.emit(notification.id);
  }

  onSelectNotification(notification: KpNotification, index: number): void {
    this.selectItem.emit({ notification, index });
  }

  onReadAll(): void {
    this.readAll.emit();
  }
}
