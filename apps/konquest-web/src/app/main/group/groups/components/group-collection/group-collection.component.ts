import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { Group } from '../../group.model';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import {
  MatTable,
  MatColumnDef,
  MatHeaderCellDef,
  MatHeaderCell,
  MatCellDef,
  MatCell,
  MatHeaderRowDef,
  MatHeaderRow,
  MatRowDef,
  MatRow,
} from '@angular/material/table';
import { MatIcon } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';
import { MatIconAnchor, MatIconButton } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { MatMenuTrigger, MatMenu, MatMenuItem } from '@angular/material/menu';
import { TranslocoPipe } from '@jsverse/transloco';

@Component({
  selector: 'app-group-collection',
  templateUrl: './group-collection.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    NgxSkeletonLoaderModule,
    MatTable,
    MatColumnDef,
    MatHeaderCellDef,
    MatHeaderCell,
    MatCellDef,
    MatCell,
    MatIcon,
    MatTooltip,
    MatIconAnchor,
    RouterLink,
    MatIconButton,
    MatMenuTrigger,
    MatMenu,
    MatMenuItem,
    MatHeaderRowDef,
    MatHeaderRow,
    MatRowDef,
    MatRow,
    TranslocoPipe,
  ],
})
export class GroupCollectionComponent {
  readonly groups = input<Group[]>();
  readonly isLoading = input<boolean>();
  readonly deleteEvent = output<string>();
  readonly editEvent = output<Group>();

  protected readonly displayedColumns = ['icon', 'name', 'trails', 'missions', 'channels', 'users', 'actions'];
  protected readonly hiddenTable = computed(() => this.isLoading() || !this.groups()?.length);
  protected readonly emptyState = computed(() => !this.isLoading() && !this.groups()?.length);
  protected readonly showSkeleton = computed(() => !this.groups()?.length && !!this.isLoading());

  protected readonly itemsLoaderTheme = { width: '100%', borderRadius: '0', height: '64px' };
}
