import { Injectable } from '@angular/core';
import { ManagementActionStrategy } from './management-action.strategy';
import { LearnContentManagementType } from '../../../models/learn-content-list-filter';
import { LearnContentListItem } from '../../../models/learn-content-list-item';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { ContentManagementListActions } from 'app/main/content-management/store/actions';

@Injectable()
export class ViewEvaluationsStrategy implements ManagementActionStrategy {
  constructor(private readonly router: Router) {}

  execute(contentType: LearnContentManagementType, item: LearnContentListItem) {
    if (contentType !== 'courses') {
      console.warn(`It is not possible to see the evaluations for ${contentType}.`);
      return of(ContentManagementListActions.executeActionNoopResult());
    }

    this.router.navigate(['/missions', item.id, 'details', 'evaluations']).then();
    return of(ContentManagementListActions.executeActionNoopResult());
  }
}
