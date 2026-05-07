import { EventsActionsStrategy } from './event-actions-strategy';
import { CoursesResponse } from '@core/model/search-api';
import { DevelopmentStatus, EnrollmentStatuses } from '@keeps-platform-frontend-workspace/kp-keeps';
import { LearnContentCardActionId } from '@keeps-platform-frontend-workspace/ui/models';

describe('EventActionsStrategy', () => {
  describe('owner / instructor', () => {
    it('should return the actions for the course owner and instructor', () => {
      const expectedActions: LearnContentCardActionId[] = ['details', 'share', 'add-bookmark'];

      const ownerCourse = {
        stats: { user_is_owner: true },
        development_status: DevelopmentStatus.DONE,
      } as CoursesResponse;
      const ownerActions = new EventsActionsStrategy(ownerCourse, false, false).getActions();

      expect(ownerActions).toMatchObject(expectedActions);
    });

    it('should return the actions for the course owner and instructor in a finished event', () => {
      const expectedActions: LearnContentCardActionId[] = ['details', 'share', 'add-bookmark'];

      const ownerCourse = {
        stats: { user_is_owner: true },
        development_status: DevelopmentStatus.CLOSED,
      } as CoursesResponse;
      const ownerActions = new EventsActionsStrategy(ownerCourse, false, false).getActions();

      expect(ownerActions).toMatchObject(expectedActions);
    });
  });

  describe('consumers', () => {
    it('should return the actions for a published event', () => {
      const expectedActions: LearnContentCardActionId[] = ['details', 'share', 'add-bookmark'];
      const mockCourse = { development_status: DevelopmentStatus.DONE } as CoursesResponse;

      const actions = new EventsActionsStrategy(mockCourse, false, false).getActions();

      expect(actions).toMatchObject(expectedActions);
    });

    it('should return the actions for a non published event', () => {
      const expectedActions: LearnContentCardActionId[] = ['details', 'share', 'add-bookmark'];
      const mockCourse = { development_status: DevelopmentStatus.IN_PROGRESS } as CoursesResponse;

      const actions = new EventsActionsStrategy(mockCourse, false, false).getActions();

      expect(actions).toMatchObject(expectedActions);
    });

    it('should return the actions for a published event for admins and super admins', () => {
      const expectedActions: LearnContentCardActionId[] = ['details', 'share', 'add-bookmark'];
      const mockCourse = { development_status: DevelopmentStatus.DONE } as CoursesResponse;

      const superAdminActions = new EventsActionsStrategy(mockCourse, true, false).getActions();
      const adminActions = new EventsActionsStrategy(mockCourse, false, true).getActions();

      expect(superAdminActions).toMatchObject(expectedActions);
      expect(adminActions).toMatchObject(expectedActions);
    });

    it('should return the actions for a enrolled user', () => {
      const expectedActions: LearnContentCardActionId[] = ['details', 'share', 'add-bookmark'];
      const mockCourse = {
        development_status: DevelopmentStatus.IN_PROGRESS,
        stats: { user_enrollment: { status: EnrollmentStatuses.ENROLLED } },
      } as CoursesResponse;

      const actions = new EventsActionsStrategy(mockCourse, false, false).getActions();

      expect(actions).toMatchObject(expectedActions);
    });
  });
});
