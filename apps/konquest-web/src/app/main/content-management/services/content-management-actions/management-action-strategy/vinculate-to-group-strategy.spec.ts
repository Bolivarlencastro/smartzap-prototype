import { VinculateToGroupStrategy } from './vinculate-to-group-strategy';
import { Chance } from 'chance';
import { LearnContentListItem } from '../../../models/learn-content-list-item';
import { VinculateToGroupActions } from 'app/shared/store';
import { ContentManagementListActions } from 'app/main/content-management/store/actions';
import { LearnContentManagementType } from '../../../models/learn-content-list-filter';
import { Observable } from 'rxjs';
import { Action } from '@ngrx/store';

describe('VinculateToGroupStrategy', () => {
  let strategy: VinculateToGroupStrategy;
  const chance = new Chance();

  beforeEach(() => {
    strategy = new VinculateToGroupStrategy();
  });

  it('should return the VinculateToGroupActions.openDialog action for courses', (done) => {
    const item = { id: chance.guid() } as LearnContentListItem;
    const action = strategy.execute('courses', item) as Observable<Action>;

    action.subscribe((result) => {
      expect(result).toEqual(VinculateToGroupActions.openDialog({ vinculateType: 'course', contentId: item.id }));
      done();
    });
  });

  it('should return the VinculateToGroupActions.openDialog action for events', (done) => {
    const item = { id: chance.guid() } as LearnContentListItem;
    const action = strategy.execute('events', item) as Observable<Action>;

    action.subscribe((result) => {
      expect(result).toEqual(VinculateToGroupActions.openDialog({ vinculateType: 'course', contentId: item.id }));
      done();
    });
  });

  it('should return the VinculateToGroupActions.openDialog action for trails', (done) => {
    const item = { id: chance.guid() } as LearnContentListItem;
    const action = strategy.execute('trails', item) as Observable<Action>;

    action.subscribe((result) => {
      expect(result).toEqual(
        VinculateToGroupActions.openDialog({
          vinculateType: 'learning-trail',
          contentId: item.id,
        }),
      );
      done();
    });
  });

  it('should return the VinculateToGroupActions.openDialog action for channels', (done) => {
    const item = { id: chance.guid() } as LearnContentListItem;
    const action = strategy.execute('channels', item) as Observable<Action>;

    action.subscribe((result) => {
      expect(result).toEqual(VinculateToGroupActions.openDialog({ vinculateType: 'channel', contentId: item.id }));
      done();
    });
  });

  it('should return the ContentManagementListActions.executeActionNoopResult action for content types that cannot be vinculated', (done) => {
    const item = { id: chance.guid() } as LearnContentListItem;
    const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();
    const action = strategy.execute('invalid-content' as LearnContentManagementType, item) as Observable<Action>;

    action.subscribe((result) => {
      expect(result).toEqual(ContentManagementListActions.executeActionNoopResult());
      expect(consoleWarnSpy).toHaveBeenCalledWith('It is not possible to vinculate invalid-content to groups.');
      done();
    });
  });
});
