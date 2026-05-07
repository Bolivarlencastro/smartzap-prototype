import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { MatSort, MatSortHeader, Sort } from '@angular/material/sort';
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderCellDef,
  MatHeaderRow,
  MatHeaderRowDef,
  MatRow,
  MatRowDef,
  MatTable,
} from '@angular/material/table';
import { TranslocoPipe } from '@jsverse/transloco';
import { constants } from '@keeps-platform-frontend-workspace/ui/constants';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { Led } from '../../../models/led';

@Component({
  selector: 'lp-led-list',
  imports: [
    MatCell,
    MatCellDef,
    MatColumnDef,
    MatHeaderCell,
    MatHeaderRow,
    MatHeaderRowDef,
    MatRow,
    MatRowDef,
    MatTable,
    TranslocoPipe,
    MatHeaderCellDef,
    MatSort,
    MatSortHeader,
    MatIcon,
    NgxSkeletonLoaderModule,
  ],
  templateUrl: './led-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LedListComponent {
  protected readonly displayedColumns = [
    'name',
    'required_progress',
    'next_due_date',
    'last_activity',
    'engagement',
    'general_status',
  ];

  readonly isLoading = input<boolean>();
  readonly led = input<Led[]>();
  readonly sort = output<Sort>();
  readonly hideTable = computed(() => this.isLoading() || !this.led()?.length);
  readonly showEmptyState = computed(() => !this.isLoading() && !this.led()?.length);
  readonly rowClick = output<Led>();
  protected readonly defaultUserAvatar = constants.defaultUserAvatar;
  protected readonly itemsLoaderTheme = { width: '100%', borderRadius: '0', height: '64px' };

  onSort(sort: Sort) {
    this.sort.emit(sort);
  }

  onRowClick(led: Led) {
    this.rowClick.emit(led);
  }
}
