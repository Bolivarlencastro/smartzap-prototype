import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { LearnContentListItem } from '../../../models/learn-content-list-item';
import { ContentManagementListActions } from '../../../store/actions';
import { ManagementActionStrategy } from './management-action.strategy';

@Injectable()
export class ManageEnrollmentsStrategy implements ManagementActionStrategy {
  constructor(private readonly router: Router) {}

  execute(_, item: LearnContentListItem) {
    this.router.navigate(['/event-management', item.id]);
    return of(ContentManagementListActions.executeActionNoopResult());
  }
}
