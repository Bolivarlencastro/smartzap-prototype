import { EnrollUsersStrategy } from './enroll-users-strategy';
import { Chance } from 'chance';
import { LearnContentListItem } from 'app/main/content-management/models/learn-content-list-item';
import { Observable } from 'rxjs';
import { Action } from '@ngrx/store';
import { BatchEnrollmentsActions } from 'app/shared/components/batch-enrollment-dialog';
import { LearnContentManagementType } from 'app/main/content-management/models/learn-content-list-filter';
import { ContentManagementListActions } from 'app/main/content-management/store/actions';

describe('EnrollUsersStrategy', () => {
  let strategy: EnrollUsersStrategy;
  const chance = new Chance();

  beforeEach(() => {
    strategy = new EnrollUsersStrategy();
  });

  it('should return BatchEnrollmentsActions.openDialog for courses', (done) => {
    const item = { id: chance.guid() } as LearnContentListItem;
    const action = strategy.execute('courses', item) as Observable<Action>;

    action.subscribe((result) => {
      expect(result).toEqual(
        BatchEnrollmentsActions.openDialog({
          learningContentId: item.id,
          enrollmentType: 'mission',
        }),
      );
      done();
    });
  });

  it('should return BatchEnrollmentsActions.openDialog for events', (done) => {
    const item = { id: chance.guid() } as LearnContentListItem;
    const action = strategy.execute('events', item, 3) as Observable<Action>;

    action.subscribe((result) => {
      expect(result).toEqual(
        BatchEnrollmentsActions.openDialog({
          learningContentId: item.id,
          enrollmentType: 'event',
          remainingSeats: 3,
        }),
      );
      done();
    });
  });

  it('should return BatchEnrollmentsActions.openDialog for trails', (done) => {
    const item = { id: chance.guid() } as LearnContentListItem;
    const action = strategy.execute('trails', item) as Observable<Action>;

    action.subscribe((result) => {
      expect(result).toEqual(
        BatchEnrollmentsActions.openDialog({
          learningContentId: item.id,
          enrollmentType: 'learning-trail',
        }),
      );
      done();
    });
  });

  it('should return ContentManagementListActions.executeActionNoopResult for invalid content types', (done) => {
    const item = { id: chance.guid() } as LearnContentListItem;
    const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();
    const action = strategy.execute('invalid-type' as LearnContentManagementType, item) as Observable<Action>;

    action.subscribe((result) => {
      expect(consoleWarnSpy).toHaveBeenCalledWith('It is not possible to enroll users in invalid-type.');
      expect(result).toEqual(ContentManagementListActions.executeActionNoopResult());
      done();
    });
  });
});
