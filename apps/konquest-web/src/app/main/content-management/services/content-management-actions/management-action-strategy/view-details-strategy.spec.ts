import { Router } from '@angular/router';
import { navigateToEvent, navigateToMission, navigateToTrail } from '@app/shared/services';
import { ContentManagementListActions } from 'app/main/content-management/store/actions';
import { LearnContentListItem } from '../../../models/learn-content-list-item';
import { ViewDetailsStrategy } from './view-details-strategy';

jest.mock('@app/shared/services', () => ({
  navigateToMission: jest.fn(() => Promise.resolve(true)),
  navigateToEvent: jest.fn(() => Promise.resolve(true)),
  navigateToTrail: jest.fn(() => Promise.resolve(true)),
}));

describe('ViewDetailsStrategy', () => {
  let routerMock: jest.Mocked<Router>;
  let strategy: ViewDetailsStrategy;

  beforeEach(() => {
    routerMock = {
      navigate: jest.fn(),
    } as unknown as jest.Mocked<Router>;

    strategy = new ViewDetailsStrategy(routerMock);

    jest.clearAllMocks();
  });

  it('should call navigateToMission for contentType "courses"', (done) => {
    const item = { id: '123' } as LearnContentListItem;
    const action = strategy.execute('courses', item) as any;

    action.subscribe((result: any) => {
      expect(navigateToMission).toHaveBeenCalledWith(routerMock, '123');
      expect(result).toEqual(ContentManagementListActions.executeActionNoopResult());
      done();
    });
  });

  it('should call navigateToEvent for contentType "events"', (done) => {
    const item = { id: '456' } as LearnContentListItem;
    const action = strategy.execute('events', item) as any;

    action.subscribe((result: any) => {
      expect(navigateToEvent).toHaveBeenCalledWith(routerMock, '456');
      expect(result).toEqual(ContentManagementListActions.executeActionNoopResult());
      done();
    });
  });

  it('should call navigateToTrail for contentType "trails"', (done) => {
    const item = { id: '789' } as LearnContentListItem;
    const action = strategy.execute('trails', item) as any;

    action.subscribe((result: any) => {
      expect(navigateToTrail).toHaveBeenCalledWith(routerMock, '789');
      expect(result).toEqual(ContentManagementListActions.executeActionNoopResult());
      done();
    });
  });

  it('should log warning and return noop for unknown contentType', (done) => {
    const item = { id: '111' } as LearnContentListItem;
    const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();

    const action = strategy.execute('unknown' as any, item) as any;

    action.subscribe((result: any) => {
      expect(consoleWarnSpy).toHaveBeenCalledWith('Unable to view details for this contentType: unknown.');
      expect(navigateToMission).not.toHaveBeenCalled();
      expect(navigateToEvent).not.toHaveBeenCalled();
      expect(navigateToTrail).not.toHaveBeenCalled();
      expect(result).toEqual(ContentManagementListActions.executeActionNoopResult());
      done();
    });
  });
});
