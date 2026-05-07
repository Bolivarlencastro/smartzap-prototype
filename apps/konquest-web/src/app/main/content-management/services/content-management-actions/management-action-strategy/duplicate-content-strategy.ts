import { Injectable } from '@angular/core';
import { ManagementActionStrategy } from './management-action.strategy';
import { LearnContentManagementType } from '../../../models/learn-content-list-filter';
import { LearnContentListItem } from '../../../models/learn-content-list-item';
import { ContentManagementListActions } from '../../../store/actions';
import { of } from 'rxjs';
import { MissionTransferActions } from 'app/main/mission-transfer/store';
import { MissionTransferType } from 'app/main/mission-transfer/models';

@Injectable()
export class DuplicateContentStrategy implements ManagementActionStrategy {
  execute(contentType: LearnContentManagementType, item: LearnContentListItem) {
    if (contentType !== 'courses') {
      console.warn(`It is not possible to duplicate ${contentType}.`);
      return of(ContentManagementListActions.executeActionNoopResult());
    }

    return of(
      MissionTransferActions.openDialog({
        data: { mission: item, transferType: MissionTransferType.DUPLICATE },
      }),
    );
  }
}
