import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KpLearningTrailDetailStepsComponent } from './kp-learning-trail-detail-steps.component';
import { getTranslocoTestingModule } from '../../transloco-testing.module';
import { DevelopmentStatus, EnrollmentStatuses } from '@keeps-platform-frontend-workspace/kp-keeps';
import { TrailStepItem } from './model';
import { Mission } from '../kp-mission-model/model';

const stepMissionMock = [
  {
    mission: {
      id: '123',
      name: 'Mission Name',
      enrollment: {
        status: EnrollmentStatuses.ENROLLED,
        progress: 0.74,
      },
      provider: {
        description: 'ALURA',
      },
      development_status: DevelopmentStatus.DONE,
      language: 'pt-BR',
      duration_time: 100,
      mission_model: 'EXTERNAL_PROVIDER',
      user_creator: { id: '777' },
    },
  },
];

const stepMissionMockBuilded = [
  {
    type: 'mission',
    listIndex: '01',
    id: '123',
    name: 'Mission Name',
    status: EnrollmentStatuses.ENROLLED,
    progress: 0.74,
    externalCourse: 'ALURA',
    development_status: DevelopmentStatus.DONE,
    language: 'pt-BR',
    duration: 100,
    missionModel: 'EXTERNAL_PROVIDER',
    isOwner: true,
    step: stepMissionMock[0],
  },
];

const stepPulseMock = [
  {
    pulse: {
      id: '321',
      name: 'Pulse Name',
      language: 'pt-BR',
      duration_time: 100,
      consume_time_in: 15,
    },
  },
];

const stepPulseMockBuilt = [
  {
    type: 'pulse',
    listIndex: '01',
    id: '321',
    name: 'Pulse Name',
    language: 'pt-BR',
    duration: 100,
    progress: 0.15,
    step: stepPulseMock[0],
  },
];

describe('KpLearningTrailDetailStepsComponent', () => {
  let component: KpLearningTrailDetailStepsComponent;
  let fixture: ComponentFixture<KpLearningTrailDetailStepsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [KpLearningTrailDetailStepsComponent, getTranslocoTestingModule()],
    });
    fixture = TestBed.createComponent(KpLearningTrailDetailStepsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('buildStepItems', () => {
    const cases: any[] = [
      [stepMissionMock, stepMissionMockBuilded],
      [stepPulseMock, stepPulseMockBuilt],
    ];

    test.each(cases)('for step %o should return this built object: %o', (step, expectValue) => {
      fixture.componentRef.setInput('userId', '777');
      fixture.componentRef.setInput('stepItems', step);
      component.buildStepItems();
      expect(component.items).toEqual(expectValue);
    });
  });

  describe('displayStepUploadIcon', () => {
    const cases: any[] = [
      [{ missionModel: 'INTERNAL' }, false],
      [{ missionModel: 'EXTERNAL_PROVIDER' }, false],
      [{ missionModel: 'EXTERNAL_PROVIDER', status: 'COMPLETED' }, false],
      [{ missionModel: 'EXTERNAL_PROVIDER', status: 'STARTED' }, true],
    ];

    test.each(cases)('for step %p should return this display value: %p', (step, expectValue) => {
      expect(component.displayStepUploadIcon(step)).toBe(expectValue);
    });
  });

  describe('disableStepUploadIcon', () => {
    const cases: any[] = [
      [{ status: 'COMPLETED' }, true],
      [{ status: 'STARTED', development_status: DevelopmentStatus.IN_REVIEW }, true],
      [{ status: 'STARTED', development_status: DevelopmentStatus.DONE }, false],
    ];

    test.each(cases)('for step %p should return this disable value: %p', (step, expectValue) => {
      expect(component.disableStepUploadIcon(step)).toBe(expectValue);
    });
  });

  describe('displayStepDownloadIcon', () => {
    const cases: any[] = [
      [{ missionModel: 'EXTERNAL_PROVIDER' }, false],
      [{ missionModel: 'EXTERNAL_PROVIDER', status: 'STARTED' }, false],
      [{ missionModel: 'EXTERNAL_PROVIDER', status: 'COMPLETED' }, true],
      [{ missionModel: 'INTERNAL' }, false],
      [{ missionModel: 'INTERNAL', status: 'STARTED' }, true],
    ];

    test.each(cases)('for step %p should return this display value: %p', (step, expectValue) => {
      expect(component.displayStepDownloadIcon(step)).toBe(expectValue);
    });
  });

  describe('disableStepDownloadIcon', () => {
    const cases: any[] = [
      [{ status: 'COMPLETED' }, false],
      [{ status: 'ENROLLED' }, true],
    ];

    test.each(cases)('for step %p should return this disable value: %p', (step, expectValue) => {
      expect(component.disableStepDownloadIcon(step)).toBe(expectValue);
    });
  });

  describe('shouldDisablePlayIcon', () => {
    const cases: any[] = [
      [{ type: 'pulse' }, false],
      [{ type: 'mission', isOwner: true }, true],
      [{ type: 'mission', isOwner: false, development_status: DevelopmentStatus.IN_REVIEW }, true],
      [{ type: 'mission', isOwner: false, development_status: DevelopmentStatus.DONE, missionModel: 'LIVE' }, false],
      [
        { type: 'mission', isOwner: false, development_status: DevelopmentStatus.DONE, missionModel: 'INTERNAL' },
        false,
      ],
      [
        {
          type: 'mission',
          isOwner: false,
          development_status: DevelopmentStatus.DONE,
          missionModel: 'INTERNAL',
          status: 'ENROLLED',
        },
        false,
      ],
      [
        {
          type: 'mission',
          isOwner: false,
          development_status: DevelopmentStatus.DONE,
          missionModel: 'INTERNAL',
          status: 'STARTED',
        },
        false,
      ],
      [
        {
          type: 'mission',
          isOwner: false,
          development_status: DevelopmentStatus.DONE,
          missionModel: 'INTERNAL',
          status: 'COMPLETED',
        },
        false,
      ],
      [
        {
          type: 'mission',
          isOwner: false,
          development_status: DevelopmentStatus.DONE,
          missionModel: 'INTERNAL',
          status: 'GIVE_UP',
        },
        true,
      ],
    ];

    test.each(cases)('for step %p should return this disable value: %p', (step, expectValue) => {
      component.isEnrolledInTrail = true;
      expect(component.shouldDisablePlayIcon(step)).toBe(expectValue);
    });

    it('should disable the play icon when isEnrolledInTrail is false', () => {
      const step = {
        type: 'mission',
        isOwner: false,
        development_status: DevelopmentStatus.DONE,
        missionModel: 'INTERNAL',
        status: 'ENROLLED',
      } as TrailStepItem;
      component.isEnrolledInTrail = false;
      expect(component.shouldDisablePlayIcon(step)).toBe(true);
    });
  });

  it('should emit stepCertificateAction event', () => {
    const [action, id] = ['action-name', '123'];
    const emitSpy = jest.spyOn(component.stepCertificateAction, 'emit');

    component.stepCertificate(action, id);
    expect(emitSpy).toHaveBeenCalledWith({ action, id });
  });

  it('should emit stepSelected event', () => {
    const [type, step] = ['mission', stepMissionMock[0]];
    const emitSpy = jest.spyOn(component.stepSelected, 'emit');

    component.stepClick({ type, step } as TrailStepItem);
    expect(emitSpy).toHaveBeenCalledWith({ type, step });
  });

  it('should emit missionDetailEvent event', () => {
    const mission = stepMissionMock[0].mission as Mission;
    const emitSpy = jest.spyOn(component.missionDetailEvent, 'emit');
    component.openMissionDetail(mission);
    expect(emitSpy).toHaveBeenCalledWith(mission);
  });
});
