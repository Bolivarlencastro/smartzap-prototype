import { ViewStatisticsStrategy } from './view-statistics-strategy';
import { Chance } from 'chance';
import { MatDialog } from '@angular/material/dialog';
import { ContentManagementListActions } from 'app/main/content-management/store/actions';
import { CourseDetailsDialogComponent } from '@keeps-platform-frontend-workspace/analytics';
import { LearnContentListItem } from 'app/main/content-management/models/learn-content-list-item';

describe('ViewStatisticsStrategy', () => {
  let strategy: ViewStatisticsStrategy;
  const chance = new Chance();
  let dialogMock: jest.Mocked<MatDialog>;

  beforeEach(() => {
    dialogMock = { open: jest.fn() } as unknown as jest.Mocked<MatDialog>;
    strategy = new ViewStatisticsStrategy(dialogMock);
  });

  it('should open the evaluations dialog for courses', (done) => {
    const item = { id: chance.guid() } as LearnContentListItem;
    const action = strategy.execute('courses', item);

    action.subscribe((result) => {
      expect(result).toEqual(ContentManagementListActions.executeActionNoopResult());
      expect(dialogMock.open).toHaveBeenCalledWith(CourseDetailsDialogComponent, {
        autoFocus: 'dialog',
        panelClass: 'analytics-dialog-container',
        data: { id: item.id },
      });
      done();
    });
  });

  it('should open the evaluations dialog for events', (done) => {
    const item = { id: chance.guid() } as LearnContentListItem;
    const action = strategy.execute('events', item);

    action.subscribe((result) => {
      expect(result).toEqual(ContentManagementListActions.executeActionNoopResult());
      expect(dialogMock.open).toHaveBeenCalledWith(CourseDetailsDialogComponent, {
        autoFocus: 'dialog',
        panelClass: 'analytics-dialog-container',
        data: { id: item.id },
      });
      done();
    });
  });

  it('should not open the evaluations dialog for other content types', (done) => {
    const item = { id: chance.guid() } as LearnContentListItem;
    const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();
    const action = strategy.execute('trails', item);

    action.subscribe((result) => {
      expect(result).toEqual(ContentManagementListActions.executeActionNoopResult());
      expect(consoleWarnSpy).toHaveBeenCalledWith('It is not possible to view the statistics for trails.');
      done();
    });
  });
});
