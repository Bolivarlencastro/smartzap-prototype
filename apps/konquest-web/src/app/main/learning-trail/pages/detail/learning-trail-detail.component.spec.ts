import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { provideRouter, Router } from '@angular/router';
import { Mission } from '@app/main/mission/mission.model';
import { PulseService } from '@core/api';
import { AuthService, UserProfileService } from '@keeps-platform-frontend-workspace/kp-keeps';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { BatchEnrollmentsActions } from 'app/shared/components/batch-enrollment-dialog';
import { of } from 'rxjs';
import { LearningTrailsListComponent } from '../list/container/learning-trails-list.component';
import { LearningTrailDetailComponent } from './learning-trail-detail.component';
import * as fromActions from './store/learning-trail-detail.actions';
import * as fromStore from './store/learning-trail-detail.reducer';
import { VinculateToGroupActions } from '@app/shared/store';
import { getTranslocoTestingModule } from '@core/utils/transloco-testing.module';
import { MatIconTestingModule } from '@angular/material/icon/testing';
import { KpLearningTrailDetailStepsComponent } from '@keeps-platform-frontend-workspace/ui/kp-learning-trail-detail-steps';

const mockTrail = {
  id: '0aca3bff-9a42-4dc2-9af1-93d3be395178',
  name: 'Trilha fechada',
  learning_trail_type: { name: 'Closed For Workspace' },
  description: 'fgukyfuyk',
  enrolled: true,
  enrollment: {
    give_up: false,
    id: 'c70f18f6-08f9-46ce-b965-da75fa16699a',
    learning_trail: {
      name: 'Trilha fechada',
    },
    status: 'STARTED',
  },
  steps: [
    {
      id: 'c088b229-9077-41bc-9de8-5015607b83c3',
      learning_trail: {
        id: '0aca3bff-9a42-4dc2-9af1-93d3be395178',
      },
      mission: {
        id: '0a00c64a-79a4-4c4b-8203-7b7a497089d5',
        name: 'Fechada 2',
        description: '123',
        external_course_url: 'https://www.alura.com.br/curso-online-customer-success-foco-no-cliente',
        mission_model: 'EXTERNAL_PROVIDER',
      },
    },
    {
      id: '579631f5-0cc8-464c-98ee-9521b1d157e5',
      learning_trail: {
        id: '0aca3bff-9a42-4dc2-9af1-93d3be395178',
      },
      mission: {
        id: '8416c60e-d31c-46ff-8eb9-cbb2c9bdb08b',
        name: 'Curso público',
        description: 'Curso para testar a visibilidade dos cursos abertos para a empresa',
        mission_model: 'INTERNAL',
      },
    },
    {
      id: '92b29383-7a7f-47b3-927d-34dab1480f49',
      learning_trail: {
        id: '0aca3bff-9a42-4dc2-9af1-93d3be395178',
      },
      mission: {
        id: '9a8c0ee4-866a-47c6-8d6a-6fb6bae9bd2f',
        name: 'curso fechado',
        description: 'Curso fechado',
        external_course_url: 'https://www.alura.com.br/curso-online-comunicacao',
        mission_model: 'EXTERNAL_PROVIDER',
      },
    },
    {
      id: 'c3a59e53-9385-4713-a31e-65db13b1f05f',
      learning_trail: {
        id: '0aca3bff-9a42-4dc2-9af1-93d3be395178',
      },
      mission: {
        id: 'f761507b-93ba-49d9-99ea-18700376ea08',
        name: 'Curso fechado com conteudos de upload',
        description: 'teste',
        mission_model: 'INTERNAL',
      },
    },
  ],
};

const dataMock = [
  {
    type: 'mission',
    step: {
      id: 'c088b229-9077-41bc-9de8-5015607b83c3',
      learning_trail: {
        id: '0aca3bff-9a42-4dc2-9af1-93d3be395178',
      },
      mission: {
        id: '0a00c64a-79a4-4c4b-8203-7b7a497089d5',
        name: 'Fechada 2',
        description: '123',
        external_course_url: 'https://www.alura.com.br/curso-online-customer-success-foco-no-cliente',
        mission_model: 'EXTERNAL_PROVIDER',
      },
    },
  },
  {
    type: 'mission',
    step: {
      id: '579631f5-0cc8-464c-98ee-9521b1d157e5',
      learning_trail: {
        id: '0aca3bff-9a42-4dc2-9af1-93d3be395178',
      },
      mission: {
        id: '8416c60e-d31c-46ff-8eb9-cbb2c9bdb08b',
        name: 'Curso público',
        description: 'Curso para testar a visibilidade dos cursos abertos para a empresa',
        mission_model: 'INTERNAL',
      },
    },
  },
  {
    type: 'pulse',
    step: {
      learning_trail: {
        id: '0aca3bff-9a42-4dc2-9af1-93d3be395178',
      },
      pulse: {
        id: 'da2be5cf-f623-4694-8671-7c87c5ff11be',
        user_creator: {},
        name: 'Como dar feedback',
        duration_time: 11.0,
        points: 11,
        status: 'DONE',
        pulse_type: {},
      },
    },
  },
  {
    type: 'pulse',
    step: {
      learning_trail: {
        id: '0aca3bff-9a42-4dc2-9af1-93d3be395178',
      },
      pulse: {
        id: 'da2be5cf-f623-4694-8671-7c87c5ff11be',
        user_creator: {},
        name: 'Como dar feedback',
        duration_time: 11.0,
        points: 11,
        status: 'DONE',
        pulse_type: '7a41a8e0-ee37-4d0b-ad4f-35bada67134d',
      },
    },
  },
];

describe('LearningTrailDetailComponent', () => {
  let component: LearningTrailDetailComponent;
  let fixture: ComponentFixture<LearningTrailDetailComponent>;
  let store: MockStore;
  let router: Router;
  let matDialog: MatDialog;
  let matDialogRef: MatDialogRef<LearningTrailDetailComponent>;
  let pulseServiceMock: jest.Mocked<PulseService>;

  beforeEach(async () => {
    TestBed.overrideComponent(LearningTrailDetailComponent, {
      remove: { imports: [KpLearningTrailDetailStepsComponent] },
      add: { schemas: [CUSTOM_ELEMENTS_SCHEMA] },
    });

    await TestBed.configureTestingModule({
      imports: [LearningTrailDetailComponent, getTranslocoTestingModule(), MatIconTestingModule],
      providers: [
        provideRouter([
          {
            path: 'learning-trails',
            component: LearningTrailsListComponent,
          },
        ]),
        provideMockStore({
          initialState: {
            [fromStore.featureKey]: {
              ...fromStore.initialState,
              learningTrail: mockTrail,
              enrollment: mockTrail.enrollment,
            },
          },
        }),
        {
          provide: MatDialogRef,
          useValue: { close: jest.fn(), updateSize: jest.fn(), afterOpened: jest.fn(() => of(true)) },
        },
        {
          provide: MAT_DIALOG_DATA,
          useValue: { learningTrail: mockTrail },
        },
        {
          provide: AuthService,
          useValue: { userId: jest.fn() },
        },
        {
          provide: UserProfileService,
          useValue: { hasRoles: jest.fn().mockReturnValue(true), isSuperAdmin: jest.fn(), isAdmin: jest.fn() },
        },
        {
          provide: PulseService,
          useValue: { isQuiz: jest.fn() },
        },
        {
          provide: MatDialog,
          useValue: {
            open: jest.fn(() => ({
              afterClosed: jest.fn(() => of(true)),
              componentInstance: { confirmTitle: '', confirmMessage: '' },
            })),
          },
        },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    store = TestBed.inject(MockStore);
    router = TestBed.inject(Router);
    matDialog = TestBed.inject(MatDialog) as jest.Mocked<MatDialog>;
    matDialogRef = TestBed.inject(MatDialogRef) as jest.Mocked<MatDialogRef<LearningTrailDetailComponent>>;
    pulseServiceMock = TestBed.inject(PulseService) as jest.Mocked<PulseService>;
    fixture = TestBed.createComponent(LearningTrailDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('onSelectStep', () => {
    it('should redirect to external mission', () => {
      const windowOpenSpy = (window.open = jest.fn());
      const { type, step } = dataMock[0] as any;
      component.onSelectStep({ type, step });
      expect(windowOpenSpy).toHaveBeenCalledWith(step.mission.external_course_url, '_blank');
    });

    it('should redirect to classroom', () => {
      const closeSpy = jest.spyOn(matDialogRef, 'close');
      const { type, step } = dataMock[1] as any;
      component.onSelectStep({ type, step });
      expect(closeSpy).toHaveBeenCalledWith({ mission: step.mission, trailId: mockTrail.id });
    });

    it('should redirect to an internal pulse', () => {
      const closeSpy = jest.spyOn(matDialogRef, 'close');
      const { type, step } = dataMock[2] as any;
      component.onSelectStep({ type, step });
      expect(closeSpy).toHaveBeenCalledWith({ pulseId: step.pulse.id, trailId: mockTrail.id });
    });

    it('should redirect to an pulse of type quiz', () => {
      const closeSpy = jest.spyOn(matDialogRef, 'close');
      pulseServiceMock.isQuiz.mockReturnValueOnce(true);
      const { type, step } = dataMock[3] as any;
      component.onSelectStep({ type, step });
      expect(closeSpy).toHaveBeenCalledWith({ pulseId: step.pulse.id, trailId: mockTrail.id });
    });
  });

  it('should dispatch open batch enrollment dialog', () => {
    jest.spyOn(store, 'dispatch');

    component.openBatchEnrollmentDialog();

    expect(store.dispatch).toHaveBeenCalledWith(
      BatchEnrollmentsActions.openDialog({
        learningContentId: mockTrail.id,
        enrollmentType: 'learning-trail',
      }),
    );
  });

  describe('giveUp', () => {
    it('should open confirmation dialog and dispatch give up action', () => {
      const dispatchSpy = jest.spyOn(store, 'dispatch');

      const expectedAction = fromActions.enrollGiveUpLearningTrail({
        enrollment_id: mockTrail.enrollment.id,
      });

      component.giveUp();

      expect(matDialog.open).toHaveBeenCalled();
      expect(dispatchSpy).toHaveBeenCalledWith(expectedAction);
    });
  });

  it('should open confirmation dialog and dispatch delete action', () => {
    const dispatchSpy = jest.spyOn(store, 'dispatch');

    component.deleteTrail();

    expect(matDialog.open).toHaveBeenCalled();
    expect(dispatchSpy).toHaveBeenCalledWith(
      fromActions.deleteLearningTrail({
        id: mockTrail.id,
      }),
    );
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('should close dialog', () => {
    component.closeDialog();
    expect(matDialogRef.close).toHaveBeenCalled();
  });

  it('should change goal date', () => {
    const spy = jest.spyOn(component, 'onGoalChange');
    const date = new Date('01 Jul 2023 08:00:00 GMT-0300');
    component.onGoalChangeMobile(date);
    expect(component.goalDate).toBe(date);
    expect(spy).toHaveBeenCalled();
  });

  describe('executeStepActions', () => {
    const cases: any[] = [
      [{ action: 'upload-certificate', id: '1' }, fromActions.openAttachStepCertificate({ id: '1' })],
      [{ action: 'generate-certificate', id: '2' }, fromActions.generateStepCertificate({ id: '2' })],
    ];
    test.each(cases)('should execute step actions', (obj, dispatch) => {
      const spy = jest.spyOn(store, 'dispatch');
      component.executeStepAction(obj);
      expect(spy).toHaveBeenCalledWith(dispatch);
    });
  });

  it('should open mission detail when close dialog', () => {
    component.openMissionDetail(dataMock[0] as Mission);
    expect(matDialogRef.close).toHaveBeenCalledWith({ mission: dataMock[0], openDetail: true });
  });

  it('should dispatch openDialog action when vinculate group', () => {
    const spy = jest.spyOn(store, 'dispatch');
    const contentId = 'content1';

    component.vinculateGroup(contentId);

    expect(spy).toHaveBeenCalledWith(
      VinculateToGroupActions.openDialog({ vinculateType: 'learning-trail', contentId }),
    );
  });
});
