import { Injectable } from '@angular/core';
import { ManagementActionStrategy } from './management-action.strategy';
import { LearnContentManagementType } from '../../../models/learn-content-list-filter';
import { LearnContentListItem } from '../../../models/learn-content-list-item';
import { of } from 'rxjs';
import { ContentManagementListActions } from 'app/main/content-management/store/actions';
import { BatchEnrollmentsActions } from 'app/shared/components/batch-enrollment-dialog';
import { BatchEnrollmentType } from 'app/shared/services/batch-enrollment.service';

@Injectable()
export class EnrollUsersStrategy implements ManagementActionStrategy {
  execute(contentType: LearnContentManagementType, item: LearnContentListItem, remainingSeats?: number) {
    switch (contentType) {
      case 'courses':
        return this.openBatchEnrollmentsDialog(item.id, 'mission');
      case 'events':
        return this.openBatchEnrollmentsDialog(item.id, 'event', remainingSeats);
      case 'trails':
        return this.openBatchEnrollmentsDialog(item.id, 'learning-trail');
      default:
        console.warn(`It is not possible to enroll users in ${contentType}.`);
        return of(ContentManagementListActions.executeActionNoopResult());
    }
  }

  private openBatchEnrollmentsDialog(
    learningContentId: string,
    enrollmentType: BatchEnrollmentType,
    remainingSeats?: number,
  ) {
    return of(BatchEnrollmentsActions.openDialog({ learningContentId, enrollmentType, remainingSeats }));
  }
}
