import { DecimalPipe } from '@angular/common';
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
import { KpTrailStatusTagTypePipe } from '@keeps-platform-frontend-workspace/ui/kp-trail-status-tag-type';
import { LEARN_CONTENT_LIST_ITEM_ACTION } from 'app/main/content-management/models/learn-content-list-item-action';
import { LearnContentListItemEvent } from 'app/main/content-management/models/learn-content-list-item-event';
import { LearnContentListItem } from '../../models/learn-content-list-item';
import { KpCategoryLabelPipe } from '@keeps-platform-frontend-workspace/ui/kp-category-label';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';

@Component({
  selector: 'app-channels-list',
  imports: [
    MatTable,
    MatCell,
    MatCellDef,
    MatColumnDef,
    MatHeaderCell,
    TranslocoPipe,
    MatHeaderCellDef,
    DecimalPipe,
    KpCardTagComponent,
    MatIconButton,
    MatIcon,
    MatHeaderRow,
    MatHeaderRowDef,
    MatRow,
    MatRowDef,
    MatMenuModule,
    KpTrailStatusTagTypePipe,
    MatButton,
    RouterLink,
    KpCategoryLabelPipe,
    NgxSkeletonLoaderModule,
  ],
  templateUrl: './channels-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChannelsListComponent {
  protected readonly displayedColumns = [
    'icon',
    'name',
    'creator',
    'category',
    'pulses_count',
    'subscribers_count',
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

  onItemAction(action: LEARN_CONTENT_LIST_ITEM_ACTION, item: LearnContentListItem) {
    this.itemAction.emit({ action, item, contentType: 'channels' });
  }
}
