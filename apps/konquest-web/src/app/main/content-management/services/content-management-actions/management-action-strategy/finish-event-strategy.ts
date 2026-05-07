import { Injectable } from '@angular/core';
import { ManagementActionStrategy } from './management-action.strategy';
import { LearnContentManagementType } from '../../../models/learn-content-list-filter';
import { LearnContentListItem } from '../../../models/learn-content-list-item';
import { of } from 'rxjs';
import { ContentManagementListActions } from 'app/main/content-management/store/actions';
import { MissionServiceV2 } from 'app/main/mission/services/mission.service';
import { MissionModel } from 'app/main/mission/mission.model';
import { catchError, map } from 'rxjs/operators';

@Injectable()
export class FinishEventStrategy implements ManagementActionStrategy {
  constructor(private missionService: MissionServiceV2) {}

  execute(contentType: LearnContentManagementType, item: LearnContentListItem) {
    if (contentType !== 'events') {
      console.warn(`It is not possible to finish ${contentType}.`);
      return of(ContentManagementListActions.executeActionNoopResult());
    }

    return this.finishEvent(item);
  }

  private finishEvent(item: LearnContentListItem) {
    const eventModel = item.meta['eventType'] as MissionModel;
    const eventId = item.id;

    return this.missionService.finishMission(eventId, eventModel).pipe(
      map(() =>
        ContentManagementListActions.updateItemActionResult({
          update: {
            id: eventId,
            changes: { meta: { ...item.meta, status: 'FINISHED' } },
          },
        }),
      ),
      catchError((error) => of(ContentManagementListActions.executeActionErrorResult({ error }))),
    );
  }
}
