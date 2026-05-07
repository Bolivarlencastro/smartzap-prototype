import { Injectable, Injector } from '@angular/core';
import { LearnContentListItemEvent } from '../../models/learn-content-list-item-event';
import { ManagementActionStrategy } from './management-action-strategy/management-action.strategy';
import { DefaultManagementActionStrategy } from 'app/main/content-management/services/content-management-actions/management-action-strategy/default-management-action-strategy';
import { ContentManagementListActions } from 'app/main/content-management/store/actions';
import { of } from 'rxjs';

@Injectable()
export class ContentManagementActionsService {
  constructor(private readonly injector: Injector) {}

  executeAction(event: LearnContentListItemEvent) {
    if (!event) {
      console.warn('Invalid event to handle');
      return of(ContentManagementListActions.executeActionNoopResult());
    }

    const { action, item, contentType, remainingSeats } = event;
    const actionToken = action?.toString();
    const defaultActionStrategy = new DefaultManagementActionStrategy(action);
    const strategy = this.injector.get<ManagementActionStrategy>(actionToken as any, defaultActionStrategy);
    return strategy.execute(contentType, item, remainingSeats);
  }
}
