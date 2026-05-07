import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { GroupChannel } from '../../group-channel.model';
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
import { MatIcon } from '@angular/material/icon';
import { MatIconButton } from '@angular/material/button';
import { MatTooltip } from '@angular/material/tooltip';
import { DatePipe } from '@angular/common';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { TranslocoPipe } from '@jsverse/transloco';

@Component({
  selector: 'app-group-channel-list',
  templateUrl: './group-channel-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatTable,
    MatSort,
    MatColumnDef,
    MatHeaderCellDef,
    MatHeaderCell,
    MatCellDef,
    MatCell,
    MatIcon,
    MatSortHeader,
    MatIconButton,
    MatTooltip,
    MatHeaderRowDef,
    MatHeaderRow,
    MatRowDef,
    MatRow,
    NgxSkeletonLoaderModule,
    DatePipe,
    TranslocoPipe,
  ],
})
export class GroupChannelListComponent {
  readonly data = input<GroupChannel[]>();
  readonly isLoading = input<boolean>();
  readonly removeEvent = output<any>();
  readonly sortEvent = output<any>();

  protected readonly displayedColumns = ['icon', 'channel__name', 'channel__created_date', 'actions'];
  protected readonly hiddenTable = computed(() => this.isLoading() || !this.data()?.length);
  protected readonly showSkeleton = computed(() => !this.data()?.length && !!this.isLoading());
  protected readonly itemsLoaderTheme = { width: '100%', borderRadius: '0', height: '64px' };

  onRemove(item: GroupChannel): void {
    const { id, channel } = item;
    const { id: channelId } = channel;
    this.removeEvent.emit({ id, channelId });
  }

  sortData({ active, direction }: Sort): void {
    if (!direction) {
      this.sortEvent.emit(null);
      return;
    }
    this.sortEvent.emit({ ordering: direction === 'asc' ? active : `-${active}` });
  }
}
