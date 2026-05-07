import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { KpActionMenuItem } from './kp-action-menu-item';
import { TranslocoPipe } from '@jsverse/transloco';
import { MatIcon } from '@angular/material/icon';
import { MatMenu, MatMenuItem, MatMenuTrigger } from '@angular/material/menu';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'kp-action-menu',
  templateUrl: './kp-action-menu.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatButton, MatMenuTrigger, MatIcon, MatMenu, MatMenuItem, TranslocoPipe, MatIconButton, MatTooltipModule],
})
export class KpActionMenuComponent {
  @Input()
  set actions(actions: KpActionMenuItem[]) {
    this.splitActions(actions);
  }

  @Input() disabled: boolean;
  @Input() color: 'primary' | 'accent' | 'warn' = 'primary';
  @Input() isMobile = false;
  @Input() hasEnrollment: boolean;
  @Output() actionClick = new EventEmitter();

  mainAction: KpActionMenuItem;
  remainingActions: KpActionMenuItem[];

  get hasSecondaryActions(): boolean {
    return !!this.remainingActions?.length;
  }

  get shouldDisplaySeatsTooltip(): boolean {
    return (
      (this.mainAction.id === 'enroll-presential-live-mission' && this.mainAction.disabled) ||
      (this.mainAction.id === 'enter-live-event-not-enrolled' && this.mainAction.disabled && !this.hasEnrollment)
    );
  }

  private splitActions(actions: KpActionMenuItem[]): void {
    if (!actions?.length) {
      return;
    }
    const actionsCopy = [...actions];

    this.mainAction = actionsCopy.shift();
    this.remainingActions = actionsCopy;
  }

  protected actionsTrackBy(_index: number, action: KpActionMenuItem) {
    return action.id;
  }

  protected mainActionClick(): void {
    this.actionClick.emit(this.mainAction);
  }

  protected onActionClick(action: KpActionMenuItem): void {
    this.actionClick.emit(action);
  }
}
