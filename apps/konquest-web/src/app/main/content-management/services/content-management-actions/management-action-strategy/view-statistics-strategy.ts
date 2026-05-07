import { Injectable } from '@angular/core';
import { ManagementActionStrategy } from './management-action.strategy';
import { LearnContentManagementType } from '../../../models/learn-content-list-filter';
import { LearnContentListItem } from '../../../models/learn-content-list-item';
import { MatDialog } from '@angular/material/dialog';
import { CourseDetailsDialogComponent } from '@keeps-platform-frontend-workspace/analytics';
import { of } from 'rxjs';
import { ContentManagementListActions } from 'app/main/content-management/store/actions';

@Injectable()
export class ViewStatisticsStrategy implements ManagementActionStrategy {
  constructor(private readonly dialog: MatDialog) {}

  execute(contentType: LearnContentManagementType, item: LearnContentListItem) {
    if (contentType !== 'courses' && contentType !== 'events') {
      console.warn(`It is not possible to view the statistics for ${contentType}.`);
      return of(ContentManagementListActions.executeActionNoopResult());
    }

    this.openStatisticsDialog(item.id);
    return of(ContentManagementListActions.executeActionNoopResult());
  }

  private openStatisticsDialog(courseId: string) {
    this.dialog.open<CourseDetailsDialogComponent>(CourseDetailsDialogComponent, {
      autoFocus: 'dialog',
      panelClass: 'analytics-dialog-container',
      data: { id: courseId },
    });
  }
}
