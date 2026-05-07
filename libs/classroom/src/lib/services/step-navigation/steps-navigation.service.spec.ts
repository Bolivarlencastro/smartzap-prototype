import { StepsNavigationService } from './steps-navigation.service';
import { Injector } from '@angular/core';
import { ClassroomStep } from '../../models';
import { Course, EnrollmentStatuses } from '@keeps-platform-frontend-workspace/kp-keeps';
import { Chance } from 'chance';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { KpConfirmDialogComponent } from '@keeps-platform-frontend-workspace/ui/kp-confirm-dialog';
import { DefaultNavigationStrategy } from './strategies/default-navigation.strategy';

const chance = new Chance();

describe('StepsNavigationService', () => {
  let service: StepsNavigationService;
  let injectorMock: jest.Mocked<Injector>;
  let dialogMock: jest.Mocked<MatDialog>;
  let matDialogRefStub: jest.Mocked<MatDialogRef<any>>;
  let defaultNavigationStrategy: jest.Mocked<DefaultNavigationStrategy>;

  beforeEach(() => {
    injectorMock = { get: jest.fn() } as unknown as jest.Mocked<Injector>;
    defaultNavigationStrategy = { navigate: jest.fn() } as unknown as jest.Mocked<DefaultNavigationStrategy>;
    matDialogRefStub = {
      componentInstance: {},
    } as unknown as jest.Mocked<MatDialogRef<KpConfirmDialogComponent>>;
    dialogMock = { open: jest.fn().mockReturnValue(matDialogRefStub) } as unknown as jest.Mocked<MatDialog>;
    service = new StepsNavigationService(injectorMock, dialogMock, defaultNavigationStrategy);
  });

  it('should retrieve and navigate to the step using the strategy found in the injector', () => {
    injectorMock.get.mockReturnValueOnce(defaultNavigationStrategy);
    service.goToStep({ stepType: 'SUBJECT' } as ClassroomStep, { id: 'mock_course_id' } as Course, false);

    expect(injectorMock.get).toHaveBeenCalledWith('SUBJECT', defaultNavigationStrategy);
    expect(defaultNavigationStrategy.navigate).toHaveBeenCalled();
  });

  it('should retrieve the last completed step id from a list of steps', () => {
    const steps = [
      {
        id: chance.guid(),
        completed: false,
      },
      {
        id: chance.guid(),
        completed: true,
      },
      {
        id: chance.guid(),
        completed: false,
      },
    ] as ClassroomStep[];

    expect(service.getLastCompletedStepId(steps)).toBe(steps.at(1).id);
  });

  describe('canAccessStep', () => {
    it('should allow access if viewing as user', () => {
      const course = {} as Course;
      const targetStep = { id: chance.guid() } as ClassroomStep;

      expect(service.canAccessStep(null, targetStep, course, false, true)).toBe(true);
    });

    it('should allow access if the target step is completed or skipped by the user', () => {
      const course = { is_owner: false, is_contributor: false } as Course;
      const completedStep = { id: chance.guid(), completed: true } as ClassroomStep;
      const skippedStep = { id: chance.guid(), completed: false, skippedByUser: true } as ClassroomStep;

      expect(service.canAccessStep(null, completedStep, course, false, false)).toBe(true);
      expect(service.canAccessStep(null, skippedStep, course, false, false)).toBe(true);
    });

    it('should allow access if the target step is the next step and the content consumption countdown if finished', () => {
      const course = { is_owner: false, is_contributor: false } as Course;
      const nextStep = { id: chance.guid() } as ClassroomStep;
      const steps = [{ id: chance.guid(), nextStepId: nextStep.id } as ClassroomStep];

      expect(service.canAccessStep(steps, nextStep, course, true, false)).toBe(true);
    });

    it('should not allow access if the target step is the next step and the content consumption countdown is not finished', () => {
      const course = { is_owner: false, is_contributor: false } as Course;
      const nextStep = { id: chance.guid() } as ClassroomStep;
      const steps = [{ id: chance.guid(), nextStepId: nextStep.id } as ClassroomStep];

      expect(service.canAccessStep(steps, nextStep, course, false, false)).toBe(false);
    });

    it('should allow access to a previous step that was not completed', () => {
      const course = { is_owner: false, is_contributor: false } as Course;
      const targetStep = { id: chance.guid() } as ClassroomStep;
      const completedStep = { id: chance.guid(), completed: true } as ClassroomStep;
      const steps = [targetStep, completedStep] as ClassroomStep[];

      expect(service.canAccessStep(steps, targetStep, course, false, false)).toBe(true);
    });

    it('should allow access if the course enrollment is completed', () => {
      const course = { enrollment: { status: EnrollmentStatuses.COMPLETED } } as Course;

      expect(service.canAccessStep(null, null, course, false, false)).toBe(true);
    });
  });

  describe('getInitialStepId', () => {
    it('should return the first step id when viewing as user', () => {
      const steps = [{ id: chance.guid() }, { id: chance.guid() }] as ClassroomStep[];

      expect(service.getInitialStepId(steps, null, true)).toBe(steps[0].id);
    });

    it('should return the first step id when enrollment is completed', () => {
      const steps = [{ id: chance.guid() }, { id: chance.guid() }] as ClassroomStep[];
      const enrollment = { status: EnrollmentStatuses.COMPLETED } as any;

      expect(service.getInitialStepId(steps, enrollment, false)).toBe(steps[0].id);
    });

    it('should return the last completed step id', () => {
      const steps = [
        { id: chance.guid(), completed: true },
        { id: chance.guid(), completed: true },
        { id: chance.guid(), completed: false },
      ] as ClassroomStep[];

      expect(service.getInitialStepId(steps, null, false)).toBe(steps[1].id);
    });

    it('should fall back to the first step id when no steps are completed', () => {
      const steps = [
        { id: chance.guid(), completed: false },
        { id: chance.guid(), completed: false },
      ] as ClassroomStep[];

      expect(service.getInitialStepId(steps, null, false)).toBe(steps[0].id);
    });
  });

  describe('displayBlockedContentDialog', () => {
    it('should blocked content dialog', () => {
      service.displayBlockedContentDialog();

      expect(dialogMock.open).toHaveBeenCalledWith(KpConfirmDialogComponent, { autoFocus: 'dialog', width: '280px' });
    });
  });
});
