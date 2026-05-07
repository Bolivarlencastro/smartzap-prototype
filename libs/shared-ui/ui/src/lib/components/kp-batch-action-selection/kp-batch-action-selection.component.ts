import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { ACTION_CONFIG, BatchAction, BuildedAction } from '@keeps-platform-frontend-workspace/kp-keeps';
import { TranslocoModule } from '@jsverse/transloco';

@Component({
  selector: 'kp-batch-action-selection',
  imports: [CommonModule, TranslocoModule, MatButtonModule, MatIconModule, MatDividerModule],
  template: `
    <div class="w-[-webkit-fill-available] fixed top-0 bg-default z-50">
      @if (buildedActions) {
        <div class="flex justify-end items-center h-16 px-2">
          <button mat-button class="text-primary mr-auto" (click)="clearSelection()">
            {{ 'UI.BATCH_ACTIONS.ACTIONS.CLEAR_SELECTION' | transloco }}
          </button>

          @for (action of buildedActions; track action.id) {
            <button mat-button class="flex gap-1 items-center text-primary" (click)="dispatchAction(action.id)">
              <mat-icon [ngClass]="action.iconClass">{{ action.icon }}</mat-icon>
              {{ 'UI.BATCH_ACTIONS.ACTIONS.' + action.id | transloco }}
            </button>
          }
        </div>
      }
      <mat-divider></mat-divider>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KpBatchActionSelectionComponent {
  @Input() set actions(value: BatchAction[]) {
    this.buildedActions = this.buildActions(value);
  }
  @Output() dispatch = new EventEmitter<BatchAction>();
  @Output() clear = new EventEmitter<void>();

  buildedActions: BuildedAction[];

  dispatchAction(action: BatchAction) {
    this.dispatch.emit(action);
  }

  clearSelection() {
    this.clear.emit();
  }

  private buildActions(actions: BatchAction[]): BuildedAction[] {
    return actions.map((action) => ({ id: action, ...ACTION_CONFIG[action] }));
  }
}
