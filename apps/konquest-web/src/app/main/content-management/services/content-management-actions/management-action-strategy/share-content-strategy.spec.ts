import { ShareContentStrategy } from './share-content-strategy';
import { LearnContentListItem } from 'app/main/content-management/models/learn-content-list-item';
import { Observable } from 'rxjs';
import { Action } from '@ngrx/store';
import { MissionTransferActions } from 'app/main/mission-transfer/store';
import { MissionTransferType } from 'app/main/mission-transfer/models';
import { ContentManagementListActions } from 'app/main/content-management/store/actions';
import { Chance } from 'chance';

describe('ShareContentStrategy', () => {
  let strategy: ShareContentStrategy;
  const chance = new Chance();

  beforeEach(() => {
    strategy = new ShareContentStrategy();
  });

  it('should return MissionTransferActions.openDialog for courses with the SHARE transfer type', (done) => {
    const item = { id: chance.guid() } as LearnContentListItem;
    const action = strategy.execute('courses', item) as Observable<Action>;

    action.subscribe((result) => {
      expect(result).toEqual(
        MissionTransferActions.openDialog({
          data: {
            mission: { id: item.id },
            transferType: MissionTransferType.SHARE,
          },
        }),
      );
      done();
    });
  });

  it('should return ContentManagementListActions.executeActionNoopResult for content types that are not courses', (done) => {
    const item = { id: chance.guid() } as LearnContentListItem;
    const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();
    const action = strategy.execute('events', item) as Observable<Action>;

    action.subscribe((result) => {
      expect(consoleWarnSpy).toHaveBeenCalledWith('It is not possible to share events.');
      expect(result).toEqual(ContentManagementListActions.executeActionNoopResult());
      done();
    });
  });
});
