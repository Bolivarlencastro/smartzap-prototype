import { Injectable } from '@angular/core';
import { ManagementActionStrategy } from './management-action.strategy';
import { LearnContentManagementType } from '../../../models/learn-content-list-filter';
import { LearnContentListItem } from '../../../models/learn-content-list-item';
import { ContributorDialogActions } from 'app/shared/components/contributors-dialog/store';
import { ContributorsDialogContentType } from 'app/shared/components/contributors-dialog/models/contributors-dialog-content.type';
import { of } from 'rxjs';
import { ContentManagementListActions } from 'app/main/content-management/store/actions';

@Injectable()
export class EditContributorsStrategy implements ManagementActionStrategy {
  execute(contentType: LearnContentManagementType, item: LearnContentListItem) {
    switch (contentType) {
      case 'courses':
        return of(
          ContributorDialogActions.openDialog({
            relatedContentId: item.id,
            contentType: ContributorsDialogContentType.MISSION,
          }),
        );
      case 'channels':
        return of(
          ContributorDialogActions.openDialog({
            relatedContentId: item.id,
            contentType: ContributorsDialogContentType.CHANNEL,
          }),
        );
      default:
        console.warn(`It is not possible to edit the contributors for ${contentType}.`);
    }

    return of(ContentManagementListActions.executeActionNoopResult());
  }
}
