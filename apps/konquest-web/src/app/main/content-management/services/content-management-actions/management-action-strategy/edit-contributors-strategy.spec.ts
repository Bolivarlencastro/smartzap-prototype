import { EditContributorsStrategy } from './edit-contributors-strategy';
import { Chance } from 'chance';
import { LearnContentListItem } from '../../../models/learn-content-list-item';
import { Observable } from 'rxjs';
import { Action } from '@ngrx/store';
import { ContributorDialogActions } from 'app/shared/components/contributors-dialog/store';
import { ContributorsDialogContentType } from 'app/shared/components/contributors-dialog/models/contributors-dialog-content.type';
import { ContentManagementListActions } from 'app/main/content-management/store/actions';

describe('EditContributorsStrategy', () => {
  let strategy: EditContributorsStrategy;
  const chance = new Chance();

  beforeEach(() => {
    strategy = new EditContributorsStrategy();
  });

  it('should return the action to edit a course contributors', (done) => {
    const item = { id: chance.guid() } as LearnContentListItem;
    const action = strategy.execute('courses', item) as Observable<Action>;

    action.subscribe((result) => {
      expect(result).toEqual(
        ContributorDialogActions.openDialog({
          relatedContentId: item.id,
          contentType: ContributorsDialogContentType.MISSION,
        }),
      );
      done();
    });
  });

  it('should return the action to edit a channel contributors', (done) => {
    const item = { id: chance.guid() } as LearnContentListItem;
    const action = strategy.execute('channels', item) as Observable<Action>;

    action.subscribe((result) => {
      expect(result).toEqual(
        ContributorDialogActions.openDialog({
          relatedContentId: item.id,
          contentType: ContributorsDialogContentType.CHANNEL,
        }),
      );
      done();
    });
  });

  it('should return the noopResult action for contents of other type', (done) => {
    const item = { id: chance.guid() } as LearnContentListItem;
    const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();
    const action = strategy.execute('trails', item) as Observable<Action>;

    action.subscribe((result) => {
      expect(consoleWarnSpy).toHaveBeenCalledWith('It is not possible to edit the contributors for trails.');
      expect(result).toEqual(ContentManagementListActions.executeActionNoopResult());
      done();
    });
  });
});
