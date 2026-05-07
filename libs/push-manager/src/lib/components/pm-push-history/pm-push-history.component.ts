import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { TranslocoPipe } from '@jsverse/transloco';
import { PushModel } from '../../models/panel';

@Component({
  selector: 'pm-push-history',
  imports: [MatIcon, TranslocoPipe, MatTableModule],
  template: `
    <div class="header">
      <mat-icon class="s-6">calendar_today</mat-icon>
      <span class="text-sm font-bold">{{ 'PUSH_MANAGER.PANEL.PUSH_HISTORY.TITLE' | transloco }}</span>
    </div>
    <mat-table [dataSource]="data()" class="kp-card-table">
      <ng-container matColumnDef="name">
        <mat-header-cell *matHeaderCellDef class="min-w-[110px]">
          <span class="header-row">{{ 'PUSH_MANAGER.PANEL.PUSH_HISTORY.COURSE_NAME' | transloco }}</span>
        </mat-header-cell>
        <mat-cell *matCellDef="let element" class="min-w-[110px]">
          <span class="break-words line-clamp-2 font-bold text-base">
            {{ element?.courseName }}
          </span>
        </mat-cell>
      </ng-container>

      <ng-container matColumnDef="date">
        <mat-header-cell *matHeaderCellDef class="min-w-[160px] max-w-[160px]">
          <span class="header-row">{{ 'PUSH_MANAGER.PANEL.PUSH_HISTORY.DATE' | transloco }}</span>
        </mat-header-cell>
        <mat-cell *matCellDef="let element" class="min-w-[160px] max-w-[160px] text-xs">
          {{ element?.date }}
        </mat-cell>
      </ng-container>

      <ng-container matColumnDef="count">
        <mat-header-cell *matHeaderCellDef class="min-w-[120px] max-w-[120px] justify-center">
          <span class="header-row">{{ 'PUSH_MANAGER.PANEL.PUSH_HISTORY.PUSH_COUNT' | transloco }}</span>
        </mat-header-cell>
        <mat-cell *matCellDef="let element" class="min-w-[120px] max-w-[120px] text-xs font-bold justify-center">
          {{ element?.pushCount }}
        </mat-cell>
      </ng-container>

      <ng-container matColumnDef="total">
        <mat-header-cell *matHeaderCellDef class="min-w-[120px] max-w-[120px] justify-end">
          <span class="header-row">{{ 'PUSH_MANAGER.PANEL.PUSH_HISTORY.TOTAL_COSTS' | transloco }}</span>
        </mat-header-cell>
        <mat-cell
          *matCellDef="let element"
          class="min-w-[120px] max-w-[120px] text-xs font-bold text-primary justify-end"
        >
          {{ element?.totalCost }}
        </mat-cell>
      </ng-container>

      <mat-header-row *matHeaderRowDef="displayedColumns; sticky: true"></mat-header-row>
      <mat-row *matRowDef="let row; columns: displayedColumns" class="h-12"></mat-row>
    </mat-table>
  `,
  styles: [
    `
      :host {
        @apply flex flex-col border border-default rounded-xl overflow-hidden;
      }

      .header {
        @apply flex items-center h-12 gap-3 py-3.5 px-5 border-b border-default;
        background-color: var(--mat-sys-surface-container);
      }

      .header-row {
        @apply opacity-50 text-xs font-bold;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PmPushHistoryComponent {
  data = input<PushModel[]>();

  protected readonly displayedColumns: string[] = ['name', 'date', 'count', 'total'];
}
