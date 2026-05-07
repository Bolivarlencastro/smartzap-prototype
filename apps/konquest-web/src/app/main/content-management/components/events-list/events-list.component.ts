import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
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
import { RouterLink } from '@angular/router';
import { TranslocoPipe } from '@jsverse/transloco';
import { KpCardTagComponent } from '@keeps-platform-frontend-workspace/ui/kp-card-tag';
import { KpCourseDevelopmentStatusTagTypePipe } from '@keeps-platform-frontend-workspace/ui/kp-course-development-status-tag-type';
import { LearnContentListItem } from 'app/main/content-management/models/learn-content-list-item';
import { LEARN_CONTENT_LIST_ITEM_ACTION } from 'app/main/content-management/models/learn-content-list-item-action';
import { LearnContentListItemEvent } from 'app/main/content-management/models/learn-content-list-item-event';
import { HasReachedVacancyLimitPipe } from '../../pipes/has-reached-vacancy-limit.pipe';
import { SeatsPipe } from '../../pipes/seats.pipe';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';

@Component({
  selector: 'app-events-list',
  imports: [
    MatTable,
    MatCell,
    MatCellDef,
    MatColumnDef,
    MatHeaderCell,
    TranslocoPipe,
    MatHeaderCellDef,
    DatePipe,
    KpCardTagComponent,
    MatIconButton,
    MatIcon,
    MatHeaderRow,
    MatHeaderRowDef,
    MatRow,
    MatRowDef,
    MatMenuModule,
    KpCourseDevelopmentStatusTagTypePipe,
    MatButton,
    RouterLink,
    MatMenuModule,
    SeatsPipe,
    HasReachedVacancyLimitPipe,
    NgxSkeletonLoaderModule,
  ],
  templateUrl: './events-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EventsListComponent {
  protected readonly displayedColumns = ['icon', 'name', 'date', 'enrolled_count', 'status', 'menu'];

  readonly isLoading = input<boolean>();
  readonly learnContents = input<LearnContentListItem[]>();
  readonly itemAction = output<LearnContentListItemEvent>();
  readonly hiddenTable = computed<boolean>(() => this.isLoading() || !this.learnContents()?.length);
  readonly emptyState = computed<boolean>(() => !this.isLoading() && !this.learnContents()?.length);
  readonly showSkeleton = computed<boolean>(() => !this.learnContents()?.length && !!this.isLoading());

  readonly itemsLoaderTheme = { width: '100%', borderRadius: '0', height: '64px' };

  onItemAction(action: LEARN_CONTENT_LIST_ITEM_ACTION, item: LearnContentListItem) {
    const remainingSeats = this.verifyRemainingSeats(item);
    this.itemAction.emit({ action, item, contentType: 'events', remainingSeats });
  }

  onViewDetails(item: LearnContentListItem) {
    this.itemAction.emit({ action: LEARN_CONTENT_LIST_ITEM_ACTION.DETAILS, item, contentType: 'events' });
  }

  private verifyRemainingSeats(item: LearnContentListItem): number {
    const seats = item.meta?.['seats'];
    const enrolledCount = item.meta?.['enrolledCount'];

    if (!seats) {
      return null;
    }

    return seats - enrolledCount;
  }
}
