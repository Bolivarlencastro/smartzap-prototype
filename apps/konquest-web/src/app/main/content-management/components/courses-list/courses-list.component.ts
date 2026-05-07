import { DecimalPipe, PercentPipe } from '@angular/common';
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
import { CreateLearnContentButtonService } from '@app/shared/components/create-learn-content-button/create-learn-content-button.service';
import { TranslocoPipe } from '@jsverse/transloco';
import { KpCardTagComponent } from '@keeps-platform-frontend-workspace/ui/kp-card-tag';
import { KpCourseDevelopmentStatusTagTypePipe } from '@keeps-platform-frontend-workspace/ui/kp-course-development-status-tag-type';
import { KpDurationPipe } from '@keeps-platform-frontend-workspace/ui/kp-duration';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { LearnContentListItem } from '../../models/learn-content-list-item';
import { LEARN_CONTENT_LIST_ITEM_ACTION } from '../../models/learn-content-list-item-action';
import { LearnContentListItemEvent } from '../../models/learn-content-list-item-event';

@Component({
  selector: 'app-courses-list',
  imports: [
    MatTable,
    MatCell,
    MatCellDef,
    MatColumnDef,
    MatHeaderCell,
    TranslocoPipe,
    MatHeaderCellDef,
    PercentPipe,
    DecimalPipe,
    KpCardTagComponent,
    MatIconButton,
    MatIcon,
    MatHeaderRow,
    MatHeaderRowDef,
    MatRow,
    MatRowDef,
    KpDurationPipe,
    MatMenuModule,
    KpCourseDevelopmentStatusTagTypePipe,
    MatButton,
    RouterLink,
    NgxSkeletonLoaderModule,
  ],
  templateUrl: './courses-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CoursesListComponent {
  protected readonly displayedColumns = [
    'icon',
    'name',
    'creator',
    'type',
    'duration',
    'performance',
    'enrolled_count',
    'status',
    'menu',
  ];

  readonly isLoading = input<boolean>();
  readonly learnContents = input<LearnContentListItem[]>();
  readonly itemAction = output<LearnContentListItemEvent>();
  readonly hiddenTable = computed<boolean>(() => this.isLoading() || !this.learnContents()?.length);
  readonly emptyState = computed<boolean>(() => !this.isLoading() && !this.learnContents()?.length);
  readonly showSkeleton = computed<boolean>(() => !this.learnContents()?.length && !!this.isLoading());

  readonly itemsLoaderTheme = { width: '100%', borderRadius: '0', height: '64px' };

  constructor(private readonly createLearnContentButtonService: CreateLearnContentButtonService) {}

  onItemAction(action: LEARN_CONTENT_LIST_ITEM_ACTION, item: LearnContentListItem) {
    this.itemAction.emit({ action, item, contentType: 'courses' });
  }

  onCreateScormCourse() {
    this.createLearnContentButtonService.createScorm();
  }

  onViewDetails(item: LearnContentListItem) {
    this.itemAction.emit({ action: LEARN_CONTENT_LIST_ITEM_ACTION.DETAILS, item, contentType: 'courses' });
  }

  trackByFn(_, item: LearnContentListItem): string {
    return item.id;
  }
}
