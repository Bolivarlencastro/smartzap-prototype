import { Injectable } from '@angular/core';
import { DevelopmentStatus } from '@keeps-platform-frontend-workspace/kp-keeps';
import { KpMessageService } from '@keeps-platform-frontend-workspace/ui/kp-message-service';
import { MissionServiceV2 } from 'app/main/mission/services/mission.service';
import { map } from 'rxjs/operators';
import { LearnContentListItem } from '../../../models/learn-content-list-item';
import { ContentManagementListActions } from '../../../store/actions';
import { ManagementActionStrategy } from './management-action.strategy';

@Injectable()
export class PublishContentStrategy implements ManagementActionStrategy {
  constructor(
    private missionService: MissionServiceV2,
    private messageService: KpMessageService,
  ) {}

  execute(_, item: LearnContentListItem) {
    return this.missionService.changeMissionStatus(item.id, DevelopmentStatus.DONE).pipe(
      map(() => {
        this.messageService.success('MISSION.DETAILS.PUBLISHED_SUCCESSFULLY');
        return ContentManagementListActions.updateItemActionResult({
          update: {
            id: item.id,
            changes: { meta: { ...item.meta, status: DevelopmentStatus.DONE } },
          },
        });
      }),
    );
  }
}
