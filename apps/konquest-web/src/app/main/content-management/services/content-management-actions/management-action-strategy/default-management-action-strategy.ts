import { ManagementActionStrategy } from './management-action.strategy';
import { LearnContentManagementType } from 'app/main/content-management/models/learn-content-list-filter';
import { LearnContentListItem } from 'app/main/content-management/models/learn-content-list-item';
import { ContentManagementListActions } from 'app/main/content-management/store/actions';
import { of } from 'rxjs';

export class DefaultManagementActionStrategy implements ManagementActionStrategy {
  constructor(private readonly action: unknown) {}

  execute(contentType: LearnContentManagementType, item: LearnContentListItem) {
    console.warn(`No management action found for action ${this.action}. ContentType: ${contentType}, Item: ${item}`);
    return of(ContentManagementListActions.executeActionNoopResult());
  }
}
