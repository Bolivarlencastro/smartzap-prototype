import { Router } from '@angular/router';
import { DefaultNavigationStrategy } from './default-navigation.strategy';
import { ClassroomStep } from '../../../models';
import { Course, STEP_CONTENT_TYPE } from '@keeps-platform-frontend-workspace/kp-keeps';

describe('DefaultNavigationStrategy', () => {
  let strategy: DefaultNavigationStrategy;
  let routerMock: jest.Mocked<Router>;

  beforeEach(() => {
    routerMock = {
      navigate: jest.fn(),
    } as unknown as jest.Mocked<Router>;
    strategy = new DefaultNavigationStrategy(routerMock);
  });

  describe('navigate', () => {
    const mockCourse = { id: 'course-123' } as Course;
    const mockStepId = 'content-789';

    const testCases: { stepType: STEP_CONTENT_TYPE; expectedUrl: string }[] = [
      { stepType: 'HTML', expectedUrl: 'html' },
      { stepType: 'HTML FILE', expectedUrl: 'html' },
      { stepType: 'IMAGE', expectedUrl: 'image' },
      { stepType: 'PDF', expectedUrl: 'pdf' },
      { stepType: 'PODCAST', expectedUrl: 'podcast' },
      { stepType: 'PRESENTATION', expectedUrl: 'doc' },
      { stepType: 'SPREADSHEET', expectedUrl: 'doc' },
      { stepType: 'TEXT', expectedUrl: 'doc' },
      { stepType: 'QUESTION', expectedUrl: 'quiz' },
      { stepType: 'SCORM', expectedUrl: 'scorm' },
      { stepType: 'VIDEO', expectedUrl: 'video' },
      { stepType: 'SUBJECT', expectedUrl: 'unknown' },
    ];

    testCases.forEach(({ stepType, expectedUrl }) => {
      it(`should navigate to correct URL for step type ${stepType}`, () => {
        const step = {
          stepType,
          id: mockStepId,
        } as ClassroomStep;

        strategy.navigate(step, mockCourse, false);

        expect(routerMock.navigate).toHaveBeenCalledWith(['course', mockCourse.id, expectedUrl, mockStepId]);
      });
    });

    it('should use "unknown" if stepType is not in map', () => {
      const step = {
        stepType: 'NON_EXISTENT' as STEP_CONTENT_TYPE,
        id: mockStepId,
      } as ClassroomStep;

      strategy.navigate(step, mockCourse, false);

      expect(routerMock.navigate).toHaveBeenCalledWith(['course', mockCourse.id, 'unknown', mockStepId]);
    });

    it('should use "view-as-user" base route when viewingAsUser is true', () => {
      const step = {
        stepType: 'HTML',
        id: mockStepId,
      } as ClassroomStep;

      strategy.navigate(step, mockCourse, true);

      expect(routerMock.navigate).toHaveBeenCalledWith(['view-as-user', mockCourse.id, 'html', mockStepId]);
    });

    it('should use "course" base route when viewingAsUser is false', () => {
      const step = {
        stepType: 'HTML',
        id: mockStepId,
      } as ClassroomStep;

      strategy.navigate(step, mockCourse, false);

      expect(routerMock.navigate).toHaveBeenCalledWith(['course', mockCourse.id, 'html', mockStepId]);
    });
  });
});
