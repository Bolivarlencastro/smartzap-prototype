import { Chance } from 'chance';
import { Router } from '@angular/router';
import { LearnContentListItem } from '../../../models/learn-content-list-item';
import { ContentManagementListActions } from 'app/main/content-management/store/actions';
import { ViewEvaluationsStrategy } from './view-evaluations-strategy';

describe('ViewEvaluationsStrategy', () => {
  let strategy: ViewEvaluationsStrategy;
  const chance = new Chance();
  let routerMock: jest.Mocked<Router>;

  beforeEach(() => {
    routerMock = { navigate: jest.fn().mockResolvedValue(true) } as unknown as jest.Mocked<Router>;
    strategy = new ViewEvaluationsStrategy(routerMock);
  });

  it('should navigate to the courses evaluations page', (done) => {
    const item = { id: chance.guid() } as LearnContentListItem;
    const action = strategy.execute('courses', item);

    action.subscribe((result) => {
      expect(result).toEqual(ContentManagementListActions.executeActionNoopResult());
      expect(routerMock.navigate).toHaveBeenCalledWith(['/missions', item.id, 'details', 'evaluations']);
      done();
    });
  });

  it('should not navigate when the content does not have evaluations', (done) => {
    const item = { id: chance.guid() } as LearnContentListItem;
    const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();
    const action = strategy.execute('events', item);

    action.subscribe((result) => {
      expect(result).toEqual(ContentManagementListActions.executeActionNoopResult());
      expect(consoleWarnSpy).toHaveBeenCalledWith('It is not possible to see the evaluations for events.');
      expect(routerMock.navigate).not.toHaveBeenCalled();
      done();
    });
  });
});
