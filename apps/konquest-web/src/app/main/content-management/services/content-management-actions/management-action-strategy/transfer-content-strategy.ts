import { Injectable } from '@angular/core';
import { ManagementActionStrategy } from './management-action.strategy';
import { LearnContentManagementType } from '../../../models/learn-content-list-filter';
import { LearnContentListItem } from '../../../models/learn-content-list-item';
import { of } from 'rxjs';
import { ContentManagementListActions } from 'app/main/content-management/store/actions';
import { TransferDialogActions } from 'app/main/transfer-dialog/store/actions';
import { MissionTransferType } from 'app/main/mission-transfer/models';
import { TransferContentType } from 'app/main/transfer-dialog/models';
import { MissionTransferActions } from 'app/main/mission-transfer/store';

@Injectable()
export class TransferContentStrategy implements ManagementActionStrategy {
  execute(contentType: LearnContentManagementType, item: LearnContentListItem) {
    switch (contentType) {
      case 'courses':
        return this.transferCourse(item);
      case 'trails':
        return this.transferTrail(item);
      case 'channels':
        return this.transferChannel(item);
    }

    console.warn(`It is not possible to transfer ${contentType}.`);
    return of(ContentManagementListActions.executeActionNoopResult());
  }

  private transferCourse(item: LearnContentListItem) {
    return of(
      MissionTransferActions.openDialog({
        data: { mission: item, transferType: MissionTransferType.TRANSFER },
      }),
    );
  }

  private transferTrail(item: LearnContentListItem) {
    return of(
      TransferDialogActions.openDialog({
        dialogData: {
          contentType: TransferContentType.LEARNING_TRAIL,
          transferContent: { id: item.id, name: item.name },
        },
      }),
    );
  }

  private transferChannel(item: LearnContentListItem) {
    return of(
      TransferDialogActions.openDialog({
        dialogData: {
          contentType: TransferContentType.CHANNEL,
          transferContent: { id: item.id, name: item.name },
        },
      }),
    );
  }
}
