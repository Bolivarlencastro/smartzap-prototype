import { DuplicateContentStrategy } from './duplicate-content-strategy';
import { Chance } from 'chance';
import { LearnContentListItem } from 'app/main/content-management/models/learn-content-list-item';
import { Observable } from 'rxjs';
import { Action } from '@ngrx/store';
import { MissionTransferActions } from 'app/main/mission-transfer/store';
import { MissionTransferType } from 'app/main/mission-transfer/models';
import { ContentManagementListActions } from 'app/main/content-management/store/actions';

describe('DuplicateContentStrategy', () => {
  let strategy: DuplicateContentStrategy;
  const chance = new Chance();

  beforeEach(() => {
    strategy = new DuplicateContentStrategy();
  });

  it('should return MissionTransferActions.openDialog for courses', (done) => {
    const item = { id: chance.guid() } as LearnContentListItem;
    const action = strategy.execute('courses', item) as Observable<Action>;

    action.subscribe((result) => {
      expect(result).toEqual(
        MissionTransferActions.openDialog({
          data: { mission: item, transferType: MissionTransferType.DUPLICATE },
        }),
      );
      done();
    });
  });

  it('should warn and return executeActionNoopResult for non-"courses" content types', (done) => {
    const item = { id: chance.guid() } as LearnContentListItem;
    const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();
    const action = strategy.execute('trails', item) as Observable<Action>;

    action.subscribe((result) => {
      expect(consoleWarnSpy).toHaveBeenCalledWith('It is not possible to duplicate trails.');
      expect(result).toEqual(ContentManagementListActions.executeActionNoopResult());
      consoleWarnSpy.mockRestore();
      done();
    });
  });

  it('should warn and return executeActionNoopResult for "events"', (done) => {
    const item = { id: chance.guid() } as LearnContentListItem;
    const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();
    const action = strategy.execute('events', item) as Observable<Action>;

    action.subscribe((result) => {
      expect(consoleWarnSpy).toHaveBeenCalledWith('It is not possible to duplicate events.');
      expect(result).toEqual(ContentManagementListActions.executeActionNoopResult());
      consoleWarnSpy.mockRestore();
      done();
    });
  });
});
