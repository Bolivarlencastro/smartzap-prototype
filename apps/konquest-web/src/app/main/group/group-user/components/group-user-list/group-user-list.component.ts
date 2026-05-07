import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { environment } from 'environments/environment';
import { GroupUser } from '../../group-user.model';
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
import { MatIconButton } from '@angular/material/button';
import { MatTooltip } from '@angular/material/tooltip';
import { MatIcon } from '@angular/material/icon';
import { DatePipe, UpperCasePipe } from '@angular/common';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { TranslocoPipe } from '@jsverse/transloco';

@Component({
  selector: 'app-group-user-list',
  templateUrl: './group-user-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatTable,
    MatSort,
    MatColumnDef,
    MatHeaderCellDef,
    MatHeaderCell,
    MatCellDef,
    MatCell,
    MatSortHeader,
    MatIconButton,
    MatTooltip,
    MatIcon,
    MatHeaderRowDef,
    MatHeaderRow,
    MatRowDef,
    MatRow,
    NgxSkeletonLoaderModule,
    UpperCasePipe,
    DatePipe,
    TranslocoPipe,
  ],
})
export class GroupUserListComponent {
  readonly data = input<GroupUser[]>();
  readonly isLoading = input<boolean>();
  readonly removeEvent = output<{ id: string; userId: string }>();
  readonly sortEvent = output<any>();

  readonly defaultUserAvatar = environment.defaultUserAvatar;

  protected readonly displayedColumns = ['avatar', 'user__name', 'job', 'created_date', 'actions'];
  protected readonly hiddenTable = computed(() => this.isLoading() || !this.data()?.length);
  protected readonly showSkeleton = computed(() => !this.data()?.length && !!this.isLoading());
  protected readonly itemsLoaderTheme = { width: '100%', borderRadius: '0', height: '64px' };

  onRemove(item: GroupUser): void {
    const { id, user } = item;
    const { id: userId } = user;
    if (id) {
      this.removeEvent.emit({ id, userId });
    }
  }

  sortData({ active, direction }: Sort): void {
    if (!direction) {
      this.sortEvent.emit(null);
      return;
    }
    this.sortEvent.emit({ ordering: direction === 'asc' ? active : `-${active}` });
  }
}
