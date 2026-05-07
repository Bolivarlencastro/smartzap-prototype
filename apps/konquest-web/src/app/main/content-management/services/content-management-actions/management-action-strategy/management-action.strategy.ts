import { LearnContentListItem } from '../../../models/learn-content-list-item';
import { LearnContentManagementType } from '../../../models/learn-content-list-filter';
import { Action } from '@ngrx/store';
import { Observable } from 'rxjs';

export interface ManagementActionStrategy {
  execute(
    contentType: LearnContentManagementType,
    item: LearnContentListItem,
    remainingSeats?: number,
  ): Observable<Action>;
}
