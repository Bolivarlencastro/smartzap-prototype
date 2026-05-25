import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { DatePipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { PageEvent } from '@angular/material/paginator';
import { MatSortModule, Sort } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTooltip } from '@angular/material/tooltip';
import { TranslocoPipe } from '@jsverse/transloco';
import { PushCampaignModel } from '@keeps-platform-frontend-workspace/kp-keeps';
import { KpTableLayoutComponent } from '@keeps-platform-frontend-workspace/ui/kp-table-layout';

@Component({
  selector: 'pm-upcoming-appointments',
  imports: [
    MatIcon,
    TranslocoPipe,
    MatTableModule,
    MatButtonModule,
    MatSortModule,
    MatTooltip,
    KpTableLayoutComponent,
    DatePipe,
  ],
  template: `
    <kp-table-layout
      [totalItems]="total()"
      [pageIndex]="page() - 1"
      [pageSize]="limit()"
      [searchPlaceholder]="'PUSH_MANAGER.PANEL.UPCOMING_APPOINTMENTS.SEARCH' | transloco"
      (searchChange)="searchChange.emit($event)"
      (pageChange)="pageChange.emit($event)"
    >
      <mat-table [dataSource]="data() ?? []" matSort (matSortChange)="sortChange.emit($event)" kpTable>
        <ng-container matColumnDef="name">
          <mat-header-cell *matHeaderCellDef mat-sort-header class="min-w-52">
            {{ 'PUSH_MANAGER.PANEL.UPCOMING_APPOINTMENTS.CAMPAIGN' | transloco }}
          </mat-header-cell>
          <mat-cell *matCellDef="let row" class="min-w-52">
            <span class="break-words line-clamp-2 font-bold text-sm">{{ row?.name }}</span>
          </mat-cell>
        </ng-container>

        <ng-container matColumnDef="scheduled_at">
          <mat-header-cell *matHeaderCellDef mat-sort-header class="min-w-40 max-w-40">
            {{ 'PUSH_MANAGER.PANEL.UPCOMING_APPOINTMENTS.DATE' | transloco }}
          </mat-header-cell>
          <mat-cell *matCellDef="let row" class="min-w-40 max-w-40 text-sm">
            {{ row?.scheduled_at ? (row.scheduled_at | date: 'dd/MM/yyyy, HH:mm' : 'UTC') : '-' }}
          </mat-cell>
        </ng-container>

        <ng-container matColumnDef="total_items">
          <mat-header-cell *matHeaderCellDef mat-sort-header class="min-w-28 max-w-28 justify-center">
            {{ 'PUSH_MANAGER.PANEL.UPCOMING_APPOINTMENTS.CONTACTS' | transloco }}
          </mat-header-cell>
          <mat-cell *matCellDef="let row" class="min-w-28 max-w-28 text-sm font-bold justify-center">
            {{ row?.total_items }}
          </mat-cell>
        </ng-container>

        <ng-container matColumnDef="actions">
          <mat-header-cell *matHeaderCellDef class="max-w-[72px]"></mat-header-cell>
          <mat-cell *matCellDef="let row" class="max-w-[72px]">
            <button
              mat-icon-button
              [matTooltip]="'PUSH_MANAGER.PANEL.UPCOMING_APPOINTMENTS.CANCEL_BUTTON' | transloco"
              (click)="cancelPush.emit(row.id)"
            >
              <mat-icon>cancel</mat-icon>
            </button>
          </mat-cell>
        </ng-container>

        <tr *matNoDataRow>
          <td class="no-data-row">{{ 'PUSH_MANAGER.PANEL.UPCOMING_APPOINTMENTS.EMPTY_LIST' | transloco }}</td>
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
export class PmUpcomingAppointmentsComponent {
  data = input<PushCampaignModel[] | null>();
  total = input<number>(0);
  page = input<number>(1);
  limit = input<number>(10);

  searchChange = output<string>();
  sortChange = output<Sort>();
  pageChange = output<PageEvent>();
  cancelPush = output<string>();

  protected readonly displayedColumns = ['name', 'scheduled_at', 'total_items', 'actions'];
}
