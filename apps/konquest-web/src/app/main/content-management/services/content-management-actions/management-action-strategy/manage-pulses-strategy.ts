import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { LearnContentListItem } from '../../../models/learn-content-list-item';
import { ContentManagementListActions } from '../../../store/actions';
import { ManagementActionStrategy } from './management-action.strategy';

@Injectable()
export class ManagePulsesStrategy implements ManagementActionStrategy {
  constructor(private readonly router: Router) {}

  execute(_, item: LearnContentListItem) {
    this.router.navigate(['/channel-pulses-management', item.id], { state: { channelName: item.name } });
    return of(ContentManagementListActions.executeActionNoopResult());
  }
}
