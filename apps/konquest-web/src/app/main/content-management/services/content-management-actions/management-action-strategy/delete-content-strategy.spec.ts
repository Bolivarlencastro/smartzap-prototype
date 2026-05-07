import { DeleteContentStrategy } from './delete-content-strategy';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MissionServiceV2 } from 'app/main/mission/services/mission.service';
import { LearningTrailAPI } from '@core/api/learning-trail.api';
import { of, throwError } from 'rxjs';
import { Chance } from 'chance';
import { LearnContentListItem } from 'app/main/content-management/models/learn-content-list-item';
import { ContentManagementListActions } from 'app/main/content-management/store/actions';

describe('DeleteContentStrategy', () => {
  let strategy: DeleteContentStrategy;
  let dialogMock: jest.Mocked<MatDialog>;
  let missionServiceMock: jest.Mocked<MissionServiceV2>;
  let learningTrialApiMock: jest.Mocked<LearningTrailAPI>;
  let dialogRefMock: jest.Mocked<MatDialogRef<any>>;
  const chance = new Chance();

  beforeEach(() => {
    dialogRefMock = {
      afterClosed: jest.fn().mockReturnValue(of(true)),
      componentInstance: {},
    } as unknown as jest.Mocked<MatDialogRef<any>>;
    dialogMock = { open: jest.fn().mockReturnValue(dialogRefMock) } as unknown as jest.Mocked<MatDialog>;
    missionServiceMock = {
      removeMission: jest.fn().mockReturnValue(of(true)),
    } as unknown as jest.Mocked<MissionServiceV2>;
    learningTrialApiMock = {
      deleteLearningTrail: jest.fn().mockReturnValue(of(true)),
    } as unknown as jest.Mocked<LearningTrailAPI>;

    strategy = new DeleteContentStrategy(dialogMock, missionServiceMock, learningTrialApiMock);
  });

  describe('courses deletion', () => {
    it('should call the removeMission method in the MissionService and return the ContentManagementListActions.removeItemActionResult action', (done) => {
      const item = { id: chance.guid(), meta: { isIntegration: false } } as unknown as LearnContentListItem;
      const action = strategy.execute('courses', item);

      action.subscribe((result) => {
        expect(dialogMock.open).toHaveBeenCalled();
        expect(missionServiceMock.removeMission).toHaveBeenCalledWith(item.id, false);
        expect(result).toEqual(ContentManagementListActions.removeItemActionResult({ id: item.id }));
        done();
      });
    });

    it('should call the removeMission specifying that the course if from an integration', (done) => {
      const item = { id: chance.guid(), meta: { isIntegration: true } } as unknown as LearnContentListItem;
      const action = strategy.execute('courses', item);

      action.subscribe(() => {
        expect(dialogMock.open).toHaveBeenCalled();
        expect(missionServiceMock.removeMission).toHaveBeenCalledWith(item.id, true);
        done();
      });
    });

    it('should return ContentManagementListActions.executeActionErrorResult when the course removal fails', (done) => {
      const item = { id: chance.guid(), meta: { isIntegration: false } } as unknown as LearnContentListItem;
      const errorMessage = 'Mock error message';
      missionServiceMock.removeMission.mockReturnValueOnce(throwError(() => errorMessage));
      const action = strategy.execute('courses', item);

      action.subscribe((result) => {
        expect(dialogMock.open).toHaveBeenCalled();
        expect(missionServiceMock.removeMission).toHaveBeenCalledWith(item.id, false);
        expect(result).toEqual(ContentManagementListActions.executeActionErrorResult({ error: errorMessage }));
        done();
      });
    });
  });

  describe('events deletion', () => {
    it('should call the removeMission method in the MissionService and return the ContentManagementListActions.removeItemActionResult action', (done) => {
      const item = { id: chance.guid() } as unknown as LearnContentListItem;
      const action = strategy.execute('events', item);

      action.subscribe((result) => {
        expect(dialogMock.open).toHaveBeenCalled();
        expect(missionServiceMock.removeMission).toHaveBeenCalledWith(item.id);
        expect(result).toEqual(ContentManagementListActions.removeItemActionResult({ id: item.id }));
        done();
      });
    });

    it('should return ContentManagementListActions.executeActionErrorResult when the event removal fails', (done) => {
      const item = { id: chance.guid(), meta: { isIntegration: false } } as unknown as LearnContentListItem;
      const errorMessage = 'Mock error message';
      missionServiceMock.removeMission.mockReturnValueOnce(throwError(() => errorMessage));
      const action = strategy.execute('events', item);

      action.subscribe((result) => {
        expect(dialogMock.open).toHaveBeenCalled();
        expect(missionServiceMock.removeMission).toHaveBeenCalledWith(item.id);
        expect(result).toEqual(ContentManagementListActions.executeActionErrorResult({ error: errorMessage }));
        done();
      });
    });
  });

  describe('trails deletion', () => {
    it('should call the deleteLearningTrail method in the LearningTrailApi and return the ContentManagementListActions.removeItemActionResult action', (done) => {
      const item = { id: chance.guid() } as unknown as LearnContentListItem;
      const action = strategy.execute('trails', item);

      action.subscribe((result) => {
        expect(dialogMock.open).toHaveBeenCalled();
        expect(learningTrialApiMock.deleteLearningTrail).toHaveBeenCalledWith(item.id);
        expect(result).toEqual(ContentManagementListActions.removeItemActionResult({ id: item.id }));
        done();
      });
    });

    it('should return ContentManagementListActions.executeActionErrorResult when the trail removal fails', (done) => {
      const item = { id: chance.guid(), meta: { isIntegration: false } } as unknown as LearnContentListItem;
      const errorMessage = 'Mock error message';
      learningTrialApiMock.deleteLearningTrail.mockReturnValueOnce(throwError(() => errorMessage));
      const action = strategy.execute('trails', item);

      action.subscribe((result) => {
        expect(dialogMock.open).toHaveBeenCalled();
        expect(learningTrialApiMock.deleteLearningTrail).toHaveBeenCalledWith(item.id);
        expect(result).toEqual(ContentManagementListActions.executeActionErrorResult({ error: errorMessage }));
        done();
      });
    });
  });
});
