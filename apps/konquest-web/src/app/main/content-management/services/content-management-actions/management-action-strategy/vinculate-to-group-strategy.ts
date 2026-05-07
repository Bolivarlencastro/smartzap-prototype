import { Injectable } from '@angular/core';
import { ManagementActionStrategy } from './management-action.strategy';
import { LearnContentManagementType } from '../../../models/learn-content-list-filter';
import { LearnContentListItem } from '../../../models/learn-content-list-item';
import { of } from 'rxjs';
import { ContentManagementListActions } from 'app/main/content-management/store/actions';
import { VinculateToGroupActions } from 'app/shared/store';

@Injectable()
export class VinculateToGroupStrategy implements ManagementActionStrategy {
  execute(contentType: LearnContentManagementType, item: LearnContentListItem) {
    switch (contentType) {
      case 'courses':
      case 'events':
        return of(VinculateToGroupActions.openDialog({ vinculateType: 'course', contentId: item.id }));
      case 'trails':
        return of(VinculateToGroupActions.openDialog({ vinculateType: 'learning-trail', contentId: item.id }));
      case 'channels':
        return of(VinculateToGroupActions.openDialog({ vinculateType: 'channel', contentId: item.id }));
      default:
        console.warn(`It is not possible to vinculate ${contentType} to groups.`);
        return of(ContentManagementListActions.executeActionNoopResult());
    }
  }
}
