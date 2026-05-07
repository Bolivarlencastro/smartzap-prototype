import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { GroupLearningTrail } from '../../group-learning-trail.model';
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
  selector: 'app-group-learning-trail-list',
  templateUrl: './group-learning-trail-list.component.html',
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
export class GroupLearningTrailListComponent {
  readonly data = input<GroupLearningTrail[]>();
  readonly isLoading = input<boolean>();
  readonly removeEvent = output<{ id: string; learningTrailId: string }>();
  readonly sortEvent = output<any>();

  protected readonly displayedColumns = ['icon', 'learning_trail__name', 'learning_trail__created_date', 'actions'];
  protected readonly hiddenTable = computed(() => this.isLoading() || !this.data()?.length);
  protected readonly showSkeleton = computed(() => !this.data()?.length && !!this.isLoading());
  protected readonly itemsLoaderTheme = { width: '100%', borderRadius: '0', height: '64px' };

  onRemove(item: GroupLearningTrail): void {
    const { id, learning_trail } = item;
    const { id: learningTrailId } = learning_trail;
    this.removeEvent.emit({ id, learningTrailId });
  }

  sortData({ active, direction }: Sort): void {
    if (!direction) {
      this.sortEvent.emit(null);
      return;
    }
    this.sortEvent.emit({ ordering: direction === 'asc' ? active : `-${active}` });
  }
}
