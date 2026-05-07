import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { GroupMission } from '../../group-mission.model';
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
  selector: 'app-group-mission-list',
  templateUrl: './group-mission-list.component.html',
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
export class GroupMissionListComponent {
  readonly data = input<GroupMission[]>();
  readonly isLoading = input<boolean>();
  readonly removeEvent = output<{ id: string; missionId: string }>();
  readonly sortEvent = output<any>();

  protected readonly displayedColumns = ['icon', 'mission__name', 'created_date', 'actions'];
  protected readonly hiddenTable = computed(() => this.isLoading() || !this.data()?.length);
  protected readonly showSkeleton = computed(() => !this.data()?.length && !!this.isLoading());
  protected readonly itemsLoaderTheme = { width: '100%', borderRadius: '0', height: '64px' };

  onRemove(item: GroupMission): void {
    const { id, mission } = item;
    const { id: missionId } = mission;
    this.removeEvent.emit({ id, missionId });
  }

  sortData({ active, direction }: Sort): void {
    if (!direction) {
      this.sortEvent.emit(null);
      return;
    }
    this.sortEvent.emit({ ordering: direction === 'asc' ? active : `-${active}` });
  }
}
