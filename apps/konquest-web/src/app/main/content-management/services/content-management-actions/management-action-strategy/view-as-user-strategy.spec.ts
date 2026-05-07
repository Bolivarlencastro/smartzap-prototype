import { ViewAsUserStrategy } from './view-as-user-strategy';
import { Chance } from 'chance';
import { Router } from '@angular/router';
import { LearnContentListItem } from '../../../models/learn-content-list-item';
import { ContentManagementListActions } from 'app/main/content-management/store/actions';

describe('ViewAsUserStrategy', () => {
  let strategy: ViewAsUserStrategy;
  const chance = new Chance();
  let routerMock: jest.Mocked<Router>;

  beforeEach(() => {
    routerMock = { navigate: jest.fn().mockResolvedValue(true) } as unknown as jest.Mocked<Router>;
    strategy = new ViewAsUserStrategy(routerMock);
  });

  it('should navigate to classroom to view the course as a user', (done) => {
    const item = { id: chance.guid() } as LearnContentListItem;
    const action = strategy.execute('courses', item);

    action.subscribe((result) => {
      expect(result).toEqual(ContentManagementListActions.executeActionNoopResult());
      expect(routerMock.navigate).toHaveBeenCalledWith(['/view-as-user', item.id]);
      done();
    });
  });

  it('should not navigate when the content can not be viewed as a user', (done) => {
    const item = { id: chance.guid() } as LearnContentListItem;
    const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();
    const action = strategy.execute('events', item);

    action.subscribe((result) => {
      expect(result).toEqual(ContentManagementListActions.executeActionNoopResult());
      expect(consoleWarnSpy).toHaveBeenCalledWith('It is not possible to view events as a user.');
      expect(routerMock.navigate).not.toHaveBeenCalled();
      done();
    });
  });
});
