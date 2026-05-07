import { TestBed } from '@angular/core/testing';
import { CMI, QuestionRequest } from '@keeps-platform-frontend-workspace/kp-keeps';
import { ActivityTrackerEvent } from '@keeps-platform-frontend-workspace/ui/kp-player-activity-tracker-wrapper';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import Chance from 'chance';
import {
  ActivityActions,
  ClassroomThemeActions,
  CourseActions,
  CourseExamActions,
  ScormCMIActions,
  StepNavigationActions,
} from '../store/actions';
import { classroomCourseFeature } from '../store/features';
import { ClassroomFacade } from './classroom.facade';

const chance = new Chance();

describe('ClassroomFacade', () => {
  let facade: ClassroomFacade;
  let store: MockStore;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ClassroomFacade, provideMockStore()],
    });

    store = TestBed.inject(MockStore);
    store.overrideSelector(classroomCourseFeature.selectIsViewingAsUser, false);
    store.refreshState();

    facade = TestBed.inject(ClassroomFacade);
    jest.spyOn(store, 'dispatch');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('loadCourse', () => {
    it('should dispatch loadCourse action', () => {
      const courseId = chance.guid();
      const rollbackPath = chance.string();
      const isViewingAsUser = chance.bool();

      facade.loadCourse(courseId, rollbackPath, isViewingAsUser);

      expect(store.dispatch).toHaveBeenCalledWith(
        CourseActions.loadCourse({ courseId, rollbackPath, isViewingAsUser }),
      );
    });
  });

  describe('clearCourse', () => {
    it('should dispatch reset action', () => {
      facade.clearCourse();

      expect(store.dispatch).toHaveBeenCalledWith(CourseActions.reset());
    });
  });

  describe('answerQuestion', () => {
    it('should dispatch answerQuestion action', () => {
      const answer: QuestionRequest = { id: chance.guid(), options: [chance.guid()] };

      facade.answerQuestion(answer);

      expect(store.dispatch).toHaveBeenCalledWith(CourseExamActions.answerQuestion({ answer }));
    });
  });

  describe('toggleTheme', () => {
    it('should dispatch toggleClassroomTheme action', () => {
      facade.toggleTheme();

      expect(store.dispatch).toHaveBeenCalledWith(ClassroomThemeActions.toggleClassroomTheme());
    });
  });

  describe('loadClassroomTheme', () => {
    it('should dispatch loadTheme action', () => {
      facade.loadClassroomTheme();

      expect(store.dispatch).toHaveBeenCalledWith(ClassroomThemeActions.loadTheme());
    });
  });

  describe('restoreWorkspaceTheme', () => {
    it('should dispatch resetConfig action', () => {
      facade.restoreWorkspaceTheme();

      expect(store.dispatch).toHaveBeenCalledWith(ClassroomThemeActions.resetConfig());
    });
  });

  describe('goToStep', () => {
    it('should dispatch goToStep action', () => {
      const stepId = chance.guid();
      const countdownFinished = chance.bool();

      facade.goToStep(stepId, countdownFinished);

      expect(store.dispatch).toHaveBeenCalledWith(StepNavigationActions.goToStep({ stepId, countdownFinished }));
    });
  });

  describe('nextStep', () => {
    it('should dispatch next action', () => {
      facade.nextStep();

      expect(store.dispatch).toHaveBeenCalledWith(StepNavigationActions.next());
    });
  });

  describe('previousStep', () => {
    it('should dispatch previous action', () => {
      const countdownFinished = chance.bool();

      facade.previousStep(countdownFinished);

      expect(store.dispatch).toHaveBeenCalledWith(StepNavigationActions.previous({ countdownFinished }));
    });
  });

  describe('loadScormCMI', () => {
    it('should dispatch loadScormCMI action', () => {
      facade.loadScormCMI();

      expect(store.dispatch).toHaveBeenCalledWith(ScormCMIActions.loadScormCMI());
    });
  });

  describe('leaveCourse', () => {
    it('should dispatch openLeaveConfirmationDialog action', () => {
      facade.leaveCourse();

      expect(store.dispatch).toHaveBeenCalledWith(CourseActions.openLeaveConfirmationDialog());
    });
  });

  describe('changeGoalDate', () => {
    it('should dispatch updateGoalDate action', () => {
      const date = chance.date();

      facade.changeGoalDate(date);

      expect(store.dispatch).toHaveBeenCalledWith(CourseActions.updateGoalDate({ date }));
    });
  });

  describe('toggleGoalDateMenu', () => {
    it('should dispatch toggleGoalDateMenu action', () => {
      const value = chance.bool();

      facade.toggleGoalDateMenu(value);

      expect(store.dispatch).toHaveBeenCalledWith(CourseActions.toggleGoalDateMenu({ value }));
    });
  });

  describe('finishCourse', () => {
    it('should dispatch openFinishCourseConfirmationDialog action', () => {
      facade.finishCourse();

      expect(store.dispatch).toHaveBeenCalledWith(CourseActions.openFinishCourseConfirmationDialog());
    });
  });

  describe('loadCertificate', () => {
    it('should dispatch loadCertificate action', () => {
      facade.loadCertificate();

      expect(store.dispatch).toHaveBeenCalledWith(CourseActions.loadCertificate());
    });
  });

  describe('shareCertificate', () => {
    it('should dispatch shareCertificate action', () => {
      facade.shareCertificate();

      expect(store.dispatch).toHaveBeenCalledWith(CourseActions.shareCertificate());
    });
  });

  describe('onActivityEvent', () => {
    it('should dispatch onActivityEvent action when not viewing as user', () => {
      const event = { type: 'play' } as ActivityTrackerEvent;

      facade.onActivityEvent(event);

      expect(store.dispatch).toHaveBeenCalledWith(ActivityActions.onActivityEvent({ event }));
    });

    it('should not dispatch when viewing as user', () => {
      store.overrideSelector(classroomCourseFeature.selectIsViewingAsUser, true);
      store.refreshState();
      const event = { type: 'play' } as ActivityTrackerEvent;

      facade.onActivityEvent(event);

      expect(store.dispatch).not.toHaveBeenCalled();
    });
  });

  describe('saveScormCMI', () => {
    it('should dispatch saveScormCMI action when not viewing as user', () => {
      const cmi = { core: {} } as CMI;

      facade.saveScormCMI(cmi);

      expect(store.dispatch).toHaveBeenCalledWith(ScormCMIActions.saveScormCMI({ cmi }));
    });

    it('should not dispatch when viewing as user', () => {
      store.overrideSelector(classroomCourseFeature.selectIsViewingAsUser, true);
      store.refreshState();
      const cmi = { core: {} } as CMI;

      facade.saveScormCMI(cmi);

      expect(store.dispatch).not.toHaveBeenCalled();
    });
  });

  describe('storeLastEmittedScormCMI', () => {
    it('should dispatch storeLastEmittedScormCMI action when not viewing as user', () => {
      const cmi = { core: {} } as CMI;

      facade.storeLastEmittedScormCMI(cmi);

      expect(store.dispatch).toHaveBeenCalledWith(ScormCMIActions.storeLastEmittedScormCMI({ cmi }));
    });

    it('should not dispatch when viewing as user', () => {
      store.overrideSelector(classroomCourseFeature.selectIsViewingAsUser, true);
      store.refreshState();
      const cmi = { core: {} } as CMI;

      facade.storeLastEmittedScormCMI(cmi);

      expect(store.dispatch).not.toHaveBeenCalled();
    });
  });

  describe('saveLastEmittedScormCMI', () => {
    it('should dispatch saveLastEmittedScormCMI action when not viewing as user', () => {
      facade.saveLastEmittedScormCMI();

      expect(store.dispatch).toHaveBeenCalledWith(ScormCMIActions.saveLastEmittedScormCMI());
    });

    it('should not dispatch when viewing as user', () => {
      store.overrideSelector(classroomCourseFeature.selectIsViewingAsUser, true);
      store.refreshState();

      facade.saveLastEmittedScormCMI();

      expect(store.dispatch).not.toHaveBeenCalled();
    });
  });
});
