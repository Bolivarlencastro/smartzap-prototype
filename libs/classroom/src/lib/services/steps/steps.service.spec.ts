import { StepsService } from './steps.service';
import {
  AuthService,
  Course,
  CoursesApi,
  CourseStage,
  EnrollmentStatuses,
  STEP_CONTENT_TYPE,
} from '@keeps-platform-frontend-workspace/kp-keeps';
import { EMPTY, of } from 'rxjs';
import { Chance } from 'chance';
import { ClassroomStep } from '../../models';

const chance = new Chance();

const mockStage: CourseStage = {
  id: chance.guid(),
  name: chance.name(),
  description: chance.string(),
  user_completed: false,
  order: 1,
  mission: chance.guid(),
  contents: [
    {
      id: chance.guid(),
      name: chance.name(),
      order: 1,
      learn_content_id: chance.guid(),
      learn_content_type: {
        id: chance.guid(),
        name: 'Video',
      },
      user_completed: false,
    },
    {
      id: chance.guid(),
      name: chance.name(),
      order: 2,
      description: chance.string(),
      learn_content_id: chance.guid(),
      learn_content_type: {
        id: chance.guid(),
        name: 'Pdf',
      },
      user_completed: true,
    },
  ],
};

function buildExpectedSteps(addEvaluationStep: boolean, addFinishStep: boolean) {
  const defaultSteps: ClassroomStep[] = [
    {
      description: mockStage.description,
      order: 1,
      id: mockStage.id,
      name: mockStage.name,
      stepType: 'SUBJECT' as STEP_CONTENT_TYPE,
      completed: false,
      skippedByUser: true,
    },
    {
      id: mockStage.contents[0].id,
      name: mockStage.contents[0].name,
      description: undefined,
      completed: false,
      order: '1.1',
      stepType: 'VIDEO' as STEP_CONTENT_TYPE,
      parentStageId: mockStage.id,
      skippedByUser: true,
      nextStepId: mockStage.contents[1].id,
    },
    {
      id: mockStage.contents[1].id,
      learn_content_id: mockStage.contents[1].learn_content_id,
      name: mockStage.contents[1].name,
      description: mockStage.contents[1].description,
      stepType: 'PDF' as STEP_CONTENT_TYPE,
      completed: true,
      order: '1.2',
      parentStageId: mockStage.id,
      skippedByUser: false,
      prevStepId: mockStage.contents[0].id,
      nextStepId: addEvaluationStep ? 'EVALUATION' : addFinishStep ? 'FINISH' : undefined,
    },
  ];

  const evaluationStep: ClassroomStep = {
    id: 'EVALUATION',
    order: 2,
    name: 'CLASSROOM.COURSE_EVALUATION',
    stepType: 'SUBJECT',
    completed: false,
    description: '',
    skippedByUser: false,
    prevStepId: mockStage.contents[1].id,
    nextStepId: addFinishStep ? 'FINISH' : undefined,
  };

  const finishStep: ClassroomStep = {
    description: '',
    order: addEvaluationStep ? 3 : 2,
    id: 'FINISH',
    name: 'CLASSROOM.FINISH.TITLE',
    stepType: 'SUBJECT' as STEP_CONTENT_TYPE,
    completed: false,
    skippedByUser: false,
    prevStepId: addEvaluationStep ? 'EVALUATION' : mockStage.contents[1].id,
  };

  const steps = [...defaultSteps];

  if (addEvaluationStep) {
    steps.push(evaluationStep);
  }

  if (addFinishStep) {
    steps.push(finishStep);
  }

  return steps;
}

describe('StepsService', () => {
  let service: StepsService;
  let coursesApiMock: jest.Mocked<CoursesApi>;
  let authServiceStub: jest.Mocked<AuthService>;

  beforeEach(() => {
    coursesApiMock = {
      getCourseStages: jest.fn().mockReturnValue(of(EMPTY)),
      userContentDone: jest.fn().mockReturnValue(of(EMPTY)),
      userStageDone: jest.fn().mockReturnValue(of(EMPTY)),
    } as unknown as jest.Mocked<CoursesApi>;
    authServiceStub = { userId: chance.guid() } as unknown as jest.Mocked<AuthService>;

    service = new StepsService(coursesApiMock, authServiceStub);
  });

  describe('loadCourseSteps', () => {
    it('should fetch and parse the course steps', (done) => {
      coursesApiMock.getCourseStages.mockReturnValueOnce(of([mockStage]));
      const course = { required_evaluation: false, id: chance.guid() } as Course;
      const expectedSteps = buildExpectedSteps(false, true);

      service.loadCourseSteps(course).subscribe((steps) => {
        expect(steps).toMatchObject(expectedSteps);
        done();
      });
    });

    it('should add the evaluation step if the course has required evaluation', (done) => {
      coursesApiMock.getCourseStages.mockReturnValueOnce(of([mockStage]));
      const expectedSteps = buildExpectedSteps(true, true);
      const course = { required_evaluation: true, id: chance.guid(), enrollment: { evaluated: false } } as Course;

      service.loadCourseSteps(course).subscribe((steps) => {
        expect(steps).toMatchObject(expectedSteps);
        done();
      });
    });

    it(`should add the evaluation/finish steps when enrollment is ENROLLED (in progress statuses)`, (done) => {
      coursesApiMock.getCourseStages.mockReturnValueOnce(of([mockStage]));
      const expectedSteps = buildExpectedSteps(true, true);
      const course = {
        required_evaluation: true,
        id: chance.guid(),
        enrollment: { evaluated: false, status: EnrollmentStatuses.ENROLLED },
      } as Course;

      service.loadCourseSteps(course).subscribe((steps) => {
        expect(steps).toMatchObject(expectedSteps);
        done();
      });
    });

    it(`should add the evaluation/finish steps when enrollment is STARTED (in progress statuses)`, (done) => {
      coursesApiMock.getCourseStages.mockReturnValueOnce(of([mockStage]));
      const expectedSteps = buildExpectedSteps(true, true);
      const course = {
        required_evaluation: true,
        id: chance.guid(),
        enrollment: { evaluated: false, status: EnrollmentStatuses.STARTED },
      } as Course;

      service.loadCourseSteps(course).subscribe((steps) => {
        expect(steps).toMatchObject(expectedSteps);
        done();
      });
    });

    it('should not add evaluation/finish steps when viewing as user', (done) => {
      coursesApiMock.getCourseStages.mockReturnValueOnce(of([mockStage]));
      const expectedSteps = buildExpectedSteps(false, false);
      const course = {
        required_evaluation: true,
        id: chance.guid(),
        enrollment: { evaluated: false, status: EnrollmentStatuses.STARTED },
      } as Course;

      service.loadCourseSteps(course, true).subscribe((steps) => {
        expect(steps).toMatchObject(expectedSteps);
        done();
      });
    });
  });

  describe('complete step', () => {
    it('should complete a couse content step', (done) => {
      const mockContentStep = { id: chance.guid(), learn_content_id: chance.guid() } as ClassroomStep;
      const course = { id: chance.guid() } as Course;
      service.completeStep(mockContentStep, course).subscribe((result) => {
        expect(result).toBe(true);
        expect(coursesApiMock.userContentDone).toHaveBeenCalledWith(mockContentStep.id, authServiceStub.userId);

        done();
      });
    });

    it('should complete a couse stage step', (done) => {
      const mockStageStep = { id: chance.guid() } as ClassroomStep;
      const course = { id: chance.guid() } as Course;
      service.completeStep(mockStageStep, course).subscribe((result) => {
        expect(result).toBe(true);
        expect(coursesApiMock.userStageDone).toHaveBeenCalledWith(mockStageStep.id, authServiceStub.userId);

        done();
      });
    });

    it('should not complete steps if the user is the course owner', (done) => {
      const mockStageStep = { id: chance.guid() } as ClassroomStep;
      const course = { id: chance.guid(), is_owner: true } as Course;
      service.completeStep(mockStageStep, course).subscribe((result) => {
        expect(result).toBe(false);
        expect(coursesApiMock.userStageDone).not.toHaveBeenCalled();

        done();
      });
    });

    it('should not complete steps if the user is one of the course contributors', (done) => {
      const mockStageStep = { id: chance.guid() } as ClassroomStep;
      const course = { id: chance.guid(), is_contributor: true } as Course;
      service.completeStep(mockStageStep, course).subscribe((result) => {
        expect(result).toBe(false);
        expect(coursesApiMock.userStageDone).not.toHaveBeenCalled();

        done();
      });
    });
  });
});
