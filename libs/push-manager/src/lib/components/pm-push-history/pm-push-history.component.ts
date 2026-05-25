import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { DatePipe, DecimalPipe } from '@angular/common';
import { PageEvent } from '@angular/material/paginator';
import { MatSortModule, Sort } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { TranslocoPipe } from '@jsverse/transloco';
import { PushCampaignModel } from '@keeps-platform-frontend-workspace/kp-keeps';
import { KpCardTagComponent } from '@keeps-platform-frontend-workspace/ui/kp-card-tag';
import { KpTableLayoutComponent } from '@keeps-platform-frontend-workspace/ui/kp-table-layout';

@Component({
  selector: 'pm-push-history',
  imports: [
    TranslocoPipe,
    MatTableModule,
    MatSortModule,
    KpCardTagComponent,
    KpTableLayoutComponent,
    DatePipe,
    DecimalPipe,
  ],
  template: `
    <kp-table-layout
      [totalItems]="total()"
      [pageIndex]="page() - 1"
      [pageSize]="limit()"
      [searchPlaceholder]="'PUSH_MANAGER.PANEL.PUSH_HISTORY.SEARCH' | transloco"
      (searchChange)="searchChange.emit($event)"
      (pageChange)="pageChange.emit($event)"
    >
      <mat-table [dataSource]="data() ?? []" matSort (matSortChange)="sortChange.emit($event)" kpTable>
        <ng-container matColumnDef="name">
          <mat-header-cell *matHeaderCellDef mat-sort-header class="min-w-52">
            {{ 'PUSH_MANAGER.PANEL.PUSH_HISTORY.CAMPAIGN' | transloco }}
          </mat-header-cell>
          <mat-cell *matCellDef="let row" class="min-w-52">
            <span class="break-words line-clamp-2 font-bold text-sm">{{ row?.name }}</span>
          </mat-cell>
        </ng-container>

        <ng-container matColumnDef="completed_at">
          <mat-header-cell *matHeaderCellDef mat-sort-header class="min-w-40 max-w-44">
            {{ 'PUSH_MANAGER.PANEL.PUSH_HISTORY.DATE' | transloco }}
          </mat-header-cell>
          <mat-cell *matCellDef="let row" class="min-w-40 max-w-44 text-sm">
            {{ row?.completed_at ? (row.completed_at | date: 'dd/MM/yyyy, HH:mm' : 'UTC') : '-' }}
          </mat-cell>
        </ng-container>

        <ng-container matColumnDef="status">
          <mat-header-cell *matHeaderCellDef mat-sort-header class="min-w-36 max-w-44">
            {{ 'PUSH_MANAGER.PANEL.PUSH_HISTORY.STATUS.LABEL' | transloco }}
          </mat-header-cell>
          <mat-cell *matCellDef="let row" class="min-w-36 max-w-44">
            <kp-card-tag
              keepOpen
              [label]="'PUSH_MANAGER.PANEL.PUSH_HISTORY.STATUS.' + row?.status | transloco"
              [dotColor]="getStatusDotColor(row?.status)"
            ></kp-card-tag>
          </mat-cell>
        </ng-container>

        <ng-container matColumnDef="sent_count">
          <mat-header-cell *matHeaderCellDef mat-sort-header class="min-w-28 max-w-28 justify-center">
            {{ 'PUSH_MANAGER.PANEL.PUSH_HISTORY.SENT_COUNT' | transloco }}
          </mat-header-cell>
          <mat-cell *matCellDef="let row" class="min-w-28 max-w-28 text-sm font-bold justify-center">
            {{ row?.sent_count }}
          </mat-cell>
        </ng-container>

        <ng-container matColumnDef="estimated_cost">
          <mat-header-cell *matHeaderCellDef mat-sort-header class="min-w-32 max-w-32 justify-center">
            {{ 'PUSH_MANAGER.PANEL.PUSH_HISTORY.ESTIMATED_COST' | transloco }}
          </mat-header-cell>
          <mat-cell *matCellDef="let row" class="min-w-32 max-w-32 text-sm font-bold text-primary justify-center">
            R$ {{ row?.estimated_cost | number: '1.2-2' }}
          </mat-cell>
        </ng-container>

        <tr *matNoDataRow>
          <td class="no-data-row">{{ 'PUSH_MANAGER.PANEL.PUSH_HISTORY.EMPTY_LIST' | transloco }}</td>
        </tr>

        <mat-header-row *matHeaderRowDef="displayedColumns; sticky: true"></mat-header-row>
        <mat-row *matRowDef="let row; columns: displayedColumns"></mat-row>
      </mat-table>
    </kp-table-layout>
  `,
  styles: `
    :host {
      display: contents;
    }

    .no-data-row {
      @apply flex items-center justify-center text-sm py-10 w-full opacity-60;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PmPushHistoryComponent {
  data = input<PushCampaignModel[] | null>();
  total = input<number>(0);
  page = input<number>(1);
  limit = input<number>(10);

  searchChange = output<string>();
  sortChange = output<Sort>();
  pageChange = output<PageEvent>();

  protected readonly displayedColumns = ['name', 'completed_at', 'status', 'sent_count', 'estimated_cost'];

  protected getStatusDotColor(status: string): string {
    const colors: Record<string, string> = {
      PROCESSING: '#ff9b40',
      COMPLETED: '#00b400',
      FAILED: '#ff3700',
      CANCELED: '#b5b5b5',
    };
    return colors[status] ?? '#b5b5b5';
  }
}
