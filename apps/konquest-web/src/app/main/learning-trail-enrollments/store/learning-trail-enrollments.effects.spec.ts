import { fakeAsync, TestBed } from '@angular/core/testing';
import { EvaluationAPI } from '@core/api/evaluation.api';
import { LearningTrailEnrollmentsAPI } from '@core/api/learning-trail-enrollments.api';
import { MissionEnrollmentsAPI } from '@core/api/mission-enrollments.api';
import { FuseLoadingService } from '@keeps-platform-frontend-workspace/layout';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import { KpMessageService } from '@keeps-platform-frontend-workspace/ui/kp-message-service';
import { Observable, of, throwError } from 'rxjs';
import Chance from 'chance';

import { LearningTrailEnrollmentsService } from '../learning-trail-enrollments.service';
import * as fromActions from './learning-trail-enrollments.actions';
import { LearningTrailEnrollmentsEffects } from './learning-trail-enrollments.effects';
import { initialState, learningTrailDoneKey } from './learning-trail-enrollments.reducer';
import { EnrollmentsFilterService } from '@app/shared/components/enrollments-filter/services/enrollments-filter.service';
import { EnrollmentStatuses } from '@keeps-platform-frontend-workspace/kp-keeps';

describe('LearningTrailEnrollmentsEffects', () => {
  let effects: LearningTrailEnrollmentsEffects;
  let actions$: Observable<Action>;
  let learningTrailEnrollmentsAPI: jest.Mocked<LearningTrailEnrollmentsAPI>;
  let enrollmentsService: jest.Mocked<LearningTrailEnrollmentsService>;
  const chance = Chance();
  const mockError = { error: { i18n: '', detail: [''] } };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        LearningTrailEnrollmentsEffects,
        provideMockActions(() => actions$),
        provideMockStore({ initialState: { [learningTrailDoneKey]: initialState } }),
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
          provide: LearningTrailEnrollmentsService,
          useValue: {
            loadEnrollmentsSuccess: jest.fn(() => []),
            buildFilter: jest.fn((filter) => filter),
            approveEnrollment: jest.fn(() => of({})),
          },
        },
        {
          provide: LearningTrailEnrollmentsAPI,
          useValue: { getLearningTrailEnrollments: jest.fn(() => of(0, '', '', [])) },
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
    effects = TestBed.inject(LearningTrailEnrollmentsEffects);
    enrollmentsService = TestBed.inject(
      LearningTrailEnrollmentsService,
    ) as jest.Mocked<LearningTrailEnrollmentsService>;
    learningTrailEnrollmentsAPI = TestBed.inject(
      LearningTrailEnrollmentsAPI,
    ) as jest.Mocked<LearningTrailEnrollmentsAPI>;
  });

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  describe('loadEnrollments$', () => {
    it('should call getLearningTrailEnrollments', fakeAsync(() => {
      actions$ = of(fromActions.loadEnrollments());

      effects.loadEnrollments$.subscribe(() => {
        expect(learningTrailEnrollmentsAPI.getLearningTrailEnrollments).toHaveBeenCalled();
      });
    }));

    it('should dispatch loadEnrollmentsSuccess when getLearningTrailEnrollments succeeds', fakeAsync(() => {
      actions$ = of(fromActions.loadEnrollments());

      effects.loadEnrollments$.subscribe((action) => {
        expect(action.type).toEqual(fromActions.loadEnrollmentsSuccess.type);
      });
    }));

    it('should dispatch loadEnrollmentsFailure when getLearningTrailEnrollments fails', (done) => {
      actions$ = of(fromActions.loadEnrollments());
      learningTrailEnrollmentsAPI.getLearningTrailEnrollments.mockReturnValue(throwError(() => {}));

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

  describe('approveEnrollment$', () => {
    const payload = { id: chance.guid(), status: EnrollmentStatuses.STARTED, performance: 1 };

    it('should call approveEnrollment', (done) => {
      actions$ = of(fromActions.approveEnrollment(payload));

      effects.approveEnrollment$.subscribe(() => {
        expect(enrollmentsService.approveEnrollment).toHaveBeenCalledWith(payload.id, payload.performance);
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
