import { Router } from '@angular/router';
import { EditContentStrategy } from './edit-content-strategy';
import { Chance } from 'chance';
import { LearnContentListItem } from '../../../models/learn-content-list-item';
import { ContentManagementListActions } from 'app/main/content-management/store/actions';
import { LearnContentManagementType } from 'app/main/content-management/models/learn-content-list-filter';

describe('EditContentStrategy', () => {
  let routerMock: jest.Mocked<Router>;
  let strategy: EditContentStrategy;
  const chance = new Chance();

  beforeEach(() => {
    routerMock = { navigate: jest.fn().mockResolvedValue(true) } as unknown as jest.Mocked<Router>;
    strategy = new EditContentStrategy(routerMock);
  });

  it('should navigate to courses edition', (done) => {
    const item = { id: chance.guid() } as LearnContentListItem;
    const action = strategy.execute('courses', item);

    action.subscribe((result) => {
      expect(result).toEqual(ContentManagementListActions.executeActionNoopResult());
      expect(routerMock.navigate).toHaveBeenCalledWith(['/missions/create', item.id]);
      done();
    });
  });

  it('should navigate to events edition', (done) => {
    const item = { id: chance.guid() } as LearnContentListItem;
    const action = strategy.execute('events', item);

    action.subscribe((result) => {
      expect(result).toEqual(ContentManagementListActions.executeActionNoopResult());
      expect(routerMock.navigate).toHaveBeenCalledWith(['/events/create', item.id]);
      done();
    });
  });

  it('should navigate to trails edition', (done) => {
    const item = { id: chance.guid() } as LearnContentListItem;
    const action = strategy.execute('trails', item);

    action.subscribe((result) => {
      expect(result).toEqual(ContentManagementListActions.executeActionNoopResult());
      expect(routerMock.navigate).toHaveBeenCalledWith(['/learning-trails/create', item.id]);
      done();
    });
  });

  it('should navigate to channels edition', (done) => {
    const item = { id: chance.guid() } as LearnContentListItem;
    const action = strategy.execute('channels', item);

    action.subscribe((result) => {
      expect(result).toEqual(ContentManagementListActions.executeActionNoopResult());
      expect(routerMock.navigate).toHaveBeenCalledWith(['/', 'channels', 'edit', item.id]);
      done();
    });
  });

  it('should not navigate when the content type is invalid', (done) => {
    const item = { id: chance.guid() } as LearnContentListItem;
    const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();
    const action = strategy.execute('invalid-content' as LearnContentManagementType, item);

    action.subscribe((result) => {
      expect(result).toEqual(ContentManagementListActions.executeActionNoopResult());
      expect(consoleWarnSpy).toHaveBeenCalledWith('It is not possible to edit invalid-content.');
      expect(routerMock.navigate).not.toHaveBeenCalled();
      done();
    });
  });
});
