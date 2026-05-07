import { DefaultCourseActionsStrategy } from './default-course-actions-strategy';
import { CoursesResponse } from '@core/model/search-api';
import { DevelopmentStatus, EnrollmentStatuses } from '@keeps-platform-frontend-workspace/kp-keeps';
import { LearnContentCardActionId } from '@keeps-platform-frontend-workspace/ui/models';

describe('DefaultCourseActionsStrategy', () => {
  describe('owner / contributor', () => {
    it('should return the actions for the course owner and contributor', () => {
      const expectedActions: LearnContentCardActionId[] = ['details', 'share', 'add-bookmark'];

      const ownerCourse = {
        stats: { user_is_owner: true },
        development_status: DevelopmentStatus.DONE,
      } as CoursesResponse;
      const ownerActions = new DefaultCourseActionsStrategy(ownerCourse, false, false).getActions();

      const contributorCourse = { stats: { user_is_contributor: true } } as CoursesResponse;
      const contributorActions = new DefaultCourseActionsStrategy(contributorCourse, false, false).getActions();

      expect(ownerActions).toMatchObject(expectedActions);
      expect(contributorActions).toMatchObject(expectedActions);
    });
  });

  describe('consumers', () => {
    it('should return the actions for a published course', () => {
      const expectedActions: LearnContentCardActionId[] = ['enroll', 'details', 'share', 'add-bookmark'];
      const mockCourse = { development_status: DevelopmentStatus.DONE } as CoursesResponse;

      const actions = new DefaultCourseActionsStrategy(mockCourse, false, false).getActions();

      expect(actions).toMatchObject(expectedActions);
    });

    it('should return the actions for a non published course', () => {
      const expectedActions: LearnContentCardActionId[] = ['details', 'share', 'add-bookmark'];
      const mockCourse = { development_status: DevelopmentStatus.IN_PROGRESS } as CoursesResponse;

      const actions = new DefaultCourseActionsStrategy(mockCourse, false, false).getActions();

      expect(actions).toMatchObject(expectedActions);
    });

    it('should return the actions for a published course for admins and super admins', () => {
      const expectedActions: LearnContentCardActionId[] = ['enroll', 'details', 'share', 'add-bookmark'];
      const mockCourse = { development_status: DevelopmentStatus.DONE } as CoursesResponse;

      const superAdminActions = new DefaultCourseActionsStrategy(mockCourse, true, false).getActions();
      const adminActions = new DefaultCourseActionsStrategy(mockCourse, false, true).getActions();

      expect(superAdminActions).toMatchObject(expectedActions);
      expect(adminActions).toMatchObject(expectedActions);
    });

    it('should return the actions for a bookmarked course', () => {
      const expectedActions: LearnContentCardActionId[] = ['enroll', 'details', 'share', 'remove-bookmark'];
      const mockCourse = {
        development_status: DevelopmentStatus.DONE,
        stats: { favorite: 'mock_favorite_id' },
      } as CoursesResponse;

      const superAdminActions = new DefaultCourseActionsStrategy(mockCourse, true, false).getActions();
      const adminActions = new DefaultCourseActionsStrategy(mockCourse, false, true).getActions();

      expect(superAdminActions).toMatchObject(expectedActions);
      expect(adminActions).toMatchObject(expectedActions);
    });

    describe('enrollment by status', () => {
      const defaultActions: LearnContentCardActionId[] = ['details', 'share', 'add-bookmark'];
      const cases: { status: EnrollmentStatuses; expectedActions: LearnContentCardActionId[] }[] = [
        { status: EnrollmentStatuses.ENROLLED, expectedActions: ['start', ...defaultActions] },
        { status: EnrollmentStatuses.STARTED, expectedActions: ['continue', ...defaultActions] },
        { status: EnrollmentStatuses.EXPIRED, expectedActions: ['request-new-deadline', ...defaultActions] },
        { status: EnrollmentStatuses.COMPLETED, expectedActions: [...defaultActions] },
        { status: EnrollmentStatuses.PENDING_VALIDATION, expectedActions: [...defaultActions] },
        { status: EnrollmentStatuses.REPROVED, expectedActions: [...defaultActions] },
        { status: EnrollmentStatuses.ENROLLMENT_REPROVED, expectedActions: [...defaultActions] },
        { status: EnrollmentStatuses.REFUSED, expectedActions: [...defaultActions] },
        { status: EnrollmentStatuses.REQUEST_EXTENSION, expectedActions: [...defaultActions] },
        { status: EnrollmentStatuses.INACTIVATED, expectedActions: [...defaultActions] },
        { status: EnrollmentStatuses.GIVE_UP, expectedActions: [...defaultActions] },
      ];

      test.each(cases)(
        'should return the the correct actions for the enrollment status $status',
        ({ status, expectedActions }) => {
          const mockCourse = {
            development_status: DevelopmentStatus.DONE,
            stats: { user_enrollment: { status } },
          } as CoursesResponse;
          const actions = new DefaultCourseActionsStrategy(mockCourse, false, false).getActions();

          expect(actions).toMatchObject(expectedActions);
        },
      );
    });
  });
});
