import { Router } from '@angular/router';
import { SubjectNavigationStrategy } from './subject-navigation.strategy';
import { ClassroomStep } from '../../../models';
import { Course } from '@keeps-platform-frontend-workspace/kp-keeps';

describe('SubjectNavigationStrategy', () => {
  let strategy: SubjectNavigationStrategy;
  let routerMock: jest.Mocked<Router>;

  beforeEach(() => {
    routerMock = {
      navigate: jest.fn().mockResolvedValue(true),
    } as unknown as jest.Mocked<Router>;
    strategy = new SubjectNavigationStrategy(routerMock);
  });

  describe('navigate', () => {
    const mockCourse = { id: 'course-123' } as Course;

    it('should navigate to "finish" when step.id is "FINISH"', () => {
      const step = { id: 'FINISH' } as ClassroomStep;

      strategy.navigate(step, mockCourse, false);

      expect(routerMock.navigate).toHaveBeenCalledWith(['course', mockCourse.id, 'finish']);
    });

    it('should navigate to "evaluation" when step.id is "EVALUATION"', () => {
      const step = { id: 'EVALUATION' } as ClassroomStep;

      strategy.navigate(step, mockCourse, false);

      expect(routerMock.navigate).toHaveBeenCalledWith(['course', mockCourse.id, 'evaluation']);
    });

    it('should navigate to "subject/:id" for other step IDs', () => {
      const stepId = 'any-other-id';
      const step = { id: stepId } as ClassroomStep;

      strategy.navigate(step, mockCourse, false);

      expect(routerMock.navigate).toHaveBeenCalledWith(['course', mockCourse.id, 'subject', stepId]);
    });

    it('should use "view-as-user" base route when viewingAsUser is true', () => {
      const step = { id: 'any-id' } as ClassroomStep;

      strategy.navigate(step, mockCourse, true);

      expect(routerMock.navigate).toHaveBeenCalledWith(['view-as-user', mockCourse.id, 'subject', 'any-id']);
    });

    it('should use "course" base route when viewingAsUser is false', () => {
      const step = { id: 'any-id' } as ClassroomStep;

      strategy.navigate(step, mockCourse, false);

      expect(routerMock.navigate).toHaveBeenCalledWith(['course', mockCourse.id, 'subject', 'any-id']);
    });
  });
});
