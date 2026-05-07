import { FinishEventStrategy } from './finish-event-strategy';
import { Chance } from 'chance';
import { MissionServiceV2 } from 'app/main/mission/services/mission.service';
import { EMPTY, Observable, of, throwError } from 'rxjs';
import { LearnContentListItem } from '../../../models/learn-content-list-item';
import { Action } from '@ngrx/store';
import { MissionModel } from 'app/main/mission/mission.model';
import { ContentManagementListActions } from 'app/main/content-management/store/actions';

describe('FinishEventStrategy', () => {
  let missionServiceMock: jest.Mocked<MissionServiceV2>;
  let strategy: FinishEventStrategy;
  const chance = new Chance();

  beforeEach(() => {
    missionServiceMock = {
      finishMission: jest.fn().mockReturnValue(of(EMPTY)),
    } as unknown as jest.Mocked<MissionServiceV2>;

    strategy = new FinishEventStrategy(missionServiceMock);
  });

  it('should return the ContentManagementListActions.updateItemActionResult action after finishing an event', (done) => {
    const item = { id: chance.guid(), meta: { eventType: MissionModel.LIVE } } as unknown as LearnContentListItem;
    const action = strategy.execute('events', item) as Observable<Action>;

    action.subscribe((result) => {
      expect(missionServiceMock.finishMission).toHaveBeenCalledWith(item.id, MissionModel.LIVE);
      expect(result).toEqual(
        ContentManagementListActions.updateItemActionResult({
          update: {
            id: item.id,
            changes: { meta: { ...item.meta, status: 'FINISHED' } },
          },
        }),
      );
      done();
    });
  });

  it('should return the ContentManagementListActions.executeActionErrorResult when the finish fails', (done) => {
    const item = { id: chance.guid(), meta: { eventType: MissionModel.LIVE } } as unknown as LearnContentListItem;
    missionServiceMock.finishMission.mockReturnValueOnce(throwError(() => 'Mock error message'));
    const action = strategy.execute('events', item) as Observable<Action>;

    action.subscribe((result) => {
      expect(result).toEqual(
        ContentManagementListActions.executeActionErrorResult({
          error: 'Mock error message',
        }),
      );
      done();
    });
  });

  it('should return the ContentManagementListActions.executeActionNoopResult action when the content type is not an event', (done) => {
    const item = { id: chance.guid() } as LearnContentListItem;
    const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();
    const action = strategy.execute('courses', item) as Observable<Action>;

    action.subscribe((result) => {
      expect(consoleWarnSpy).toHaveBeenCalledWith('It is not possible to finish courses.');
      expect(result).toEqual(ContentManagementListActions.executeActionNoopResult());
      done();
    });
  });
});
