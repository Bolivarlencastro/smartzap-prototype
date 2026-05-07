import { TestBed } from '@angular/core/testing';
import { CanDeactivateFn } from '@angular/router';

import { classroomExitGuard } from './classroom-exit.guard';
import { ClassroomFacade } from '../../facades';

describe('classroomExitGuard', () => {
  let classroomFacadeMock: jest.Mocked<ClassroomFacade>;
  const executeGuard: CanDeactivateFn<unknown> = (...guardParameters) =>
    TestBed.runInInjectionContext(() => classroomExitGuard(...guardParameters));

  beforeEach(() => {
    classroomFacadeMock = {
      clearCourse: jest.fn(),
      restoreWorkspaceTheme: jest.fn(),
    } as unknown as jest.Mocked<ClassroomFacade>;
    TestBed.configureTestingModule({ providers: [{ provide: ClassroomFacade, useValue: classroomFacadeMock }] });
  });

  it('should clear the course and restore the workspace theme upon leaving the classroom', () => {
    const guardResult = executeGuard({}, {} as any, {} as any, {} as any);
    expect(guardResult).toBe(true);
    expect(classroomFacadeMock.clearCourse).toHaveBeenCalled();
    expect(classroomFacadeMock.restoreWorkspaceTheme).toHaveBeenCalled();
  });
});
