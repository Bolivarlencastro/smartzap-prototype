import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { LearnContentManagementType } from '@app/main/content-management/models/learn-content-list-filter';
import { navigateToEvent, navigateToMission, navigateToTrail } from '@app/shared/services';
import { of } from 'rxjs';
import { LearnContentListItem } from '../../../models/learn-content-list-item';
import { ContentManagementListActions } from '../../../store/actions';
import { ManagementActionStrategy } from './management-action.strategy';

@Injectable()
export class ViewDetailsStrategy implements ManagementActionStrategy {
  constructor(private readonly router: Router) {}

  execute(contentType: LearnContentManagementType, item: LearnContentListItem) {
    switch (contentType) {
      case 'courses':
        navigateToMission(this.router, item.id).then();
        break;
      case 'events':
        navigateToEvent(this.router, item.id).then();
        break;
      case 'trails':
        navigateToTrail(this.router, item.id).then();
        break;
      default:
        console.warn(`Unable to view details for this contentType: ${contentType}.`);
    }

    return of(ContentManagementListActions.executeActionNoopResult());
  }
}
