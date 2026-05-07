import { fakeAsync, TestBed } from '@angular/core/testing';
import { EvaluationAPI } from '@core/api/evaluation.api';
import { MissionEnrollmentsAPI } from '@core/api/mission-enrollments.api';
import { FuseLoadingService } from '@keeps-platform-frontend-workspace/layout';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import { MissionServiceV2 } from 'app/main/mission/services/mission.service';
import { KpMessageService } from '@keeps-platform-frontend-workspace/ui/kp-message-service';
import { Observable, of, throwError } from 'rxjs';
import Chance from 'chance';

import { MissionEnrollmentsService } from '../services/mission-enrollments.service';
import * as fromActions from './mission-enrollments.actions';
import { MissionEnrollmentsEffects } from './mission-enrollments.effects';
import { initialState, missionsDoneKey } from './mission-enrollments.reducer';
import { EnrollmentsFilterService } from '@app/shared/components/enrollments-filter/services/enrollments-filter.service';
import { EnrollmentStatuses } from '@keeps-platform-frontend-workspace/kp-keeps';

const mockError = { error: { i18n: '', detail: [''] } };

describe('MissionEnrollmentsEffects', () => {
  let effects: MissionEnrollmentsEffects;
  let actions$: Observable<Action>;
  let missionService: jest.Mocked<MissionServiceV2>;
  let enrollmentsApi: jest.Mocked<MissionEnrollmentsAPI>;
  let enrollmentsService: jest.Mocked<MissionEnrollmentsService>;
  const chance = Chance();

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        MissionEnrollmentsEffects,
        provideMockActions(() => actions$),
        provideMockStore({ initialState: { [missionsDoneKey]: initialState } }),
        {
          provide: FuseLoadingService,
          useValue: { show: jest.fn(), hide: jest.fn() },
        },
        {
          provide: MissionEnrollmentsAPI,
          useValue: {
            setPresentialLiveApproval: jest.fn(() => of({})),
            finishPresentialLiveEnrollment: jest.fn(() => of({})),
          },
        },
        {
          provide: KpMessageService,
          useValue: { success: jest.fn(), error: jest.fn() },
        },
        {
          provide: MissionEnrollmentsService,
          useValue: {
            loadEnrollmentsSuccess: jest.fn(() => []),
            buildFilter: jest.fn((filter) => filter),
            approveEnrollment: jest.fn(() => of({})),
          },
        },
        {
          provide: MissionServiceV2,
          useValue: { fetchEnrollmentMissions: jest.fn(() => of(0, '', '', [])) },
        },
        {
          provide: EvaluationAPI,
          useValue: {},
        },
        {
          provide: EnrollmentsFilterService,
          useValue: {},
        },
      ],
    }).compileComponents();
    effects = TestBed.inject(MissionEnrollmentsEffects);
    missionService = TestBed.inject(MissionServiceV2) as jest.Mocked<MissionServiceV2>;
    enrollmentsApi = TestBed.inject(MissionEnrollmentsAPI) as jest.Mocked<MissionEnrollmentsAPI>;
    enrollmentsService = TestBed.inject(MissionEnrollmentsService) as jest.Mocked<MissionEnrollmentsService>;
  });

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  describe('loadEnrollments$', () => {
    it('should call fetchEnrollmentMissions', fakeAsync(() => {
      actions$ = of(fromActions.loadEnrollments());

      effects.loadEnrollments$.subscribe(() => {
        expect(missionService.fetchEnrollmentMissions).toHaveBeenCalled();
      });
    }));

    it('should dispatch loadEnrollmentsSuccess when fetchEnrollmentMissions succeeds', fakeAsync(() => {
      actions$ = of(fromActions.loadEnrollments());

      effects.loadEnrollments$.subscribe((action) => {
        expect(action.type).toEqual(fromActions.loadEnrollmentsSuccess.type);
      });
    }));

    it('should dispatch loadEnrollmentsFailure when fetchEnrollmentMissions fails', (done) => {
      actions$ = of(fromActions.loadEnrollments());
      missionService.fetchEnrollmentMissions.mockReturnValue(throwError({}));

      effects.loadEnrollments$.subscribe((action) => {
        expect(action.type).toEqual(fromActions.loadEnrollmentsFailure.type);
        done();
      });
    });
  });

  describe('loadOnFilter$', () => {
    it('should dispatch loadEnrollments action', (done) => {
      actions$ = of(fromActions.saveFilter({ filter: { search: '' } }));

      effects.loadOnFilter$.subscribe((action) => {
        expect(action.type).toEqual(fromActions.loadEnrollments.type);
        done();
      });
    });
  });

  describe('setPresentialLiveApproval$', () => {
    const payload = { id: '123', approved: true };

    it('should call setPresentialLiveApproval', (done) => {
      actions$ = of(fromActions.setPresentialLiveApproval(payload));

      effects.setPresentialLiveApproval$.subscribe(() => {
        expect(enrollmentsApi.setPresentialLiveApproval).toHaveBeenCalled();
        done();
      });
    });

    it('should dispatch setPresentialLiveApprovalSuccess when setPresentialLiveApproval succeeds', (done) => {
      actions$ = of(fromActions.setPresentialLiveApproval(payload));

      effects.setPresentialLiveApproval$.subscribe((action) => {
        expect(action.type).toEqual(fromActions.setPresentialLiveApprovalSuccess.type);
        done();
      });
    });

    it('should dispatch setPresentialLiveApprovalFailure when setPresentialLiveApproval fails', (done) => {
      actions$ = of(fromActions.setPresentialLiveApproval(payload));
      enrollmentsApi.setPresentialLiveApproval.mockReturnValue(throwError(mockError));

      effects.setPresentialLiveApproval$.subscribe((action) => {
        expect(action.type).toEqual(fromActions.setPresentialLiveApprovalFailure.type);
        done();
      });
    });
  });

  describe('finishPresentialLive$', () => {
    const payload = { id: '123' };

    it('should call finishPresentialLiveEnrollment', (done) => {
      actions$ = of(fromActions.finishPresentialLive(payload));

      effects.finishPresentialLive$.subscribe(() => {
        expect(enrollmentsApi.finishPresentialLiveEnrollment).toHaveBeenCalled();
        done();
      });
    });

    it('should dispatch finishPresentialLiveSuccess when finishPresentialLiveEnrollment succeeds', (done) => {
      actions$ = of(fromActions.finishPresentialLive(payload));

      effects.finishPresentialLive$.subscribe((action) => {
        expect(action.type).toEqual(fromActions.finishPresentialLiveSuccess.type);
        done();
      });
    });

    it('should dispatch finishPresentialLiveFailure when finishPresentialLiveEnrollment fails', (done) => {
      actions$ = of(fromActions.finishPresentialLive(payload));
      enrollmentsApi.finishPresentialLiveEnrollment.mockReturnValue(throwError(mockError));

      effects.finishPresentialLive$.subscribe((action) => {
        expect(action.type).toEqual(fromActions.finishPresentialLiveFailure.type);
        done();
      });
    });
  });

  describe('approveEnrollment$', () => {
    const payload = { id: chance.guid(), status: EnrollmentStatuses.STARTED, performance: 1 };

    it('should call approveEnrollment', (done) => {
      actions$ = of(fromActions.approveEnrollment(payload));

      effects.approveEnrollment$.subscribe(() => {
        expect(enrollmentsService.approveEnrollment).toHaveBeenCalled();
        done();
      });
    });

    it('should dispatch approveEnrollmentSuccess when approveEnrollment succeeds', (done) => {
      actions$ = of(fromActions.approveEnrollment(payload));

      effects.approveEnrollment$.subscribe((action) => {
        expect(action.type).toEqual(fromActions.approveEnrollmentSuccess.type);
        done();
      });
    });

    it('should dispatch approveEnrollmentFailure when approveEnrollment fails', (done) => {
      actions$ = of(fromActions.approveEnrollment(payload));
      enrollmentsService.approveEnrollment.mockReturnValue(throwError(() => mockError));

      effects.approveEnrollment$.subscribe((action) => {
        expect(action.type).toEqual(fromActions.approveEnrollmentFailure.type);
        done();
      });
    });
  });
});
