import { TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { LearningTrailEnrollmentsAPI } from '@core/api/learning-trail-enrollments.api';
import { LearningTrailAPI } from '@core/api/learning-trail.api';
import { MissionEnrollmentsAPI } from '@core/api/mission-enrollments.api';
import { Content, Enrollment, EnrollmentTracking, TrackStep } from '@core/model/enrollment.model';
import { AuthService, EnrollmentStatuses, UserProfileService } from '@keeps-platform-frontend-workspace/kp-keeps';
import { FuseLoadingService } from '@keeps-platform-frontend-workspace/layout';
import { Store } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import { EnrollmentTrackingDialogComponent } from 'app/shared/components/enrollment-tracking-dialog/enrollment-tracking-dialog.component';
import { TRAILS_DETAIL_PREFIX } from 'app/shared/services';
import { ReportService } from 'app/shared/services/report.service';
import { of } from 'rxjs';
import { LearningTrail } from '../learning-trail/model/learning-trail';
import { CalculateConsumptionStatus, CHECK, GREEN, LearningTrailDoneActionType } from './consts';
import { LearningTrailEnrollmentsService } from './learning-trail-enrollments.service';
import * as EnrollmentsActions from './store/learning-trail-enrollments.actions';
import { initialState } from './store/learning-trail-enrollments.reducer';
import { getTranslocoTestingModule } from '@core/utils/transloco-testing.module';

describe('LearningTrailEnrollmentsService', () => {
  let service: LearningTrailEnrollmentsService;
  let enrollmentsAPI: jest.Mocked<LearningTrailEnrollmentsAPI>;
  let missionEnrollmentsAPI: jest.Mocked<MissionEnrollmentsAPI>;
  let learningTrailAPI: jest.Mocked<LearningTrailAPI>;
  let matDialog: jest.Mocked<MatDialog>;
  let reportService: jest.Mocked<ReportService>;
  let snackBar: jest.Mocked<MatSnackBar>;
  let router: jest.Mocked<Router>;
  let store: Store;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [getTranslocoTestingModule()],
      providers: [
        LearningTrailEnrollmentsService,
        provideMockStore({
          initialState,
        }),
        {
          provide: AuthService,
          useValue: { userId: 'mock_user_id' },
        },
        {
          provide: LearningTrailAPI,
          useValue: { getLearningTrailSteps: jest.fn() },
        },
        {
          provide: Router,
          useValue: { navigate: jest.fn(), navigateByUrl: jest.fn() },
        },
        {
          provide: FuseLoadingService,
          useValue: { show: jest.fn(), hide: jest.fn() },
        },
        {
          provide: LearningTrailEnrollmentsAPI,
          useValue: { fetchTracking: jest.fn(), fetchTrackingFromPulse: jest.fn() },
        },
        {
          provide: MissionEnrollmentsAPI,
          useValue: { fetchTracking: jest.fn() },
        },
        {
          provide: MatSnackBar,
          useValue: { openFromComponent: jest.fn(), dismiss: jest.fn() },
        },
        {
          provide: ReportService,
          useValue: { openCertificate: jest.fn(), generateLearningTrailCertificate: jest.fn() },
        },
        {
          provide: MatDialog,
          useValue: { open: jest.fn() },
        },
        {
          provide: LearningTrailAPI,
          useValue: { getById: jest.fn() },
        },
        {
          provide: UserProfileService,
          useValue: { hasRoles: jest.fn() },
        },
      ],
    }).compileComponents();

    service = TestBed.inject(LearningTrailEnrollmentsService);
    enrollmentsAPI = TestBed.inject(LearningTrailEnrollmentsAPI) as jest.Mocked<LearningTrailEnrollmentsAPI>;
    missionEnrollmentsAPI = TestBed.inject(MissionEnrollmentsAPI) as jest.Mocked<MissionEnrollmentsAPI>;
    learningTrailAPI = TestBed.inject(LearningTrailAPI) as jest.Mocked<LearningTrailAPI>;
    matDialog = TestBed.inject(MatDialog) as jest.Mocked<MatDialog>;
    matDialog.open.mockReturnValue({ afterClosed: () => of(1) } as any);
    router = TestBed.inject(Router) as jest.Mocked<Router>;
    reportService = TestBed.inject(ReportService) as jest.Mocked<ReportService>;
    snackBar = TestBed.inject(MatSnackBar) as jest.Mocked<MatSnackBar>;
    store = TestBed.inject(Store);
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });

  it('should build enrollments', () => {
    const enrollments = [{ status: EnrollmentStatuses.COMPLETED }] as Enrollment[];
    const expectedEnrollments = [
      {
        status: EnrollmentStatuses.COMPLETED,
        id: undefined,
        goalDate: '',
        learning_trail: undefined,
        startDate: undefined,
        endDate: undefined,
        enrolledCount: undefined,
        performance: undefined,
        progress: undefined,
        points: undefined,
        user: undefined,
        overdueDays: 0,
        actions: [
          LearningTrailDoneActionType.LINK_CYCLE,
          LearningTrailDoneActionType.VIEW_ACTIVITIES,
          LearningTrailDoneActionType.DELETE,
        ],
      },
    ] as Enrollment[];

    const response = service.loadEnrollmentsSuccess(enrollments, true, true, true);

    expect(response).toEqual(expectedEnrollments);
  });

  it('should open dialog of EnrollmentTrackingDialogComponent and dispatch.viewLearningTrail', (done) => {
    const enrollment = { id: '1', learning_trail: { id: '1' } } as Enrollment;
    const contentTracking = [
      {
        consumption: 1,
        consume_duration: 1,
        content: {} as Content,
        content_duration: 1,
        first_access: '',
        last_access: '',
        name: 'Bulbasaur',
        total_correct_answers: null,
        total_questions: null,
      },
    ] as EnrollmentTracking[];

    const tracking = [
      {
        id: '123',
        name: 'Test',
        mission_enrollment_id: '124',
        consumption_status: {
          color: GREEN,
          icon: CHECK,
        },
        step_type: 'MISSION',
        external_course: true,
      },
    ] as TrackStep[];

    const trail = {
      steps: [
        {
          mission: {
            id: '123',
            external_course_url: 'https://test.com',
          },
        },
      ],
    } as unknown as LearningTrail;

    const dialogConfig = {
      data: {
        trackingTitle: 'ENROLLMENTS.TITLE.' + LearningTrailDoneActionType.VIEW_ACTIVITIES,
        tracking: tracking.map((track) => {
          return {
            track,
            contents: contentTracking.map((content) => ({
              ...content,
              consumption_status: CalculateConsumptionStatus(content),
            })),
          };
        }),
        viewText: 'ENROLLMENT.TRACKING.VIEW_TRAIL',
        enrollment,
      },
    };

    const dispatchSpy = jest.spyOn(store, 'dispatch');
    learningTrailAPI.getById.mockReturnValue(of(trail));
    enrollmentsAPI.fetchTracking.mockReturnValue(of(tracking));
    missionEnrollmentsAPI.fetchTracking.mockReturnValue(of(contentTracking));
    matDialog.open.mockReturnValue({ afterClosed: () => of(enrollment) } as any);

    service.fetchTracking(enrollment).subscribe(() => {
      expect(enrollmentsAPI.fetchTracking).toHaveBeenCalledTimes(1);
      expect(enrollmentsAPI.fetchTracking).toHaveBeenCalledWith(enrollment.id);
      expect(matDialog.open).toHaveBeenCalledWith(EnrollmentTrackingDialogComponent, dialogConfig);
      expect(dispatchSpy).toHaveBeenCalledWith(EnrollmentsActions.viewLearningTrail({ enrollment }));
      done();
    });
  });

  it('should generate and open certificate', (done) => {
    const certificate_url = 'bulbasaur_pokemon.pdf';
    const enrollmentId = 'mock_enrollment_id';

    reportService.generateLearningTrailCertificate.mockReturnValue(of({ certificate_url }));

    service.generateCertificate(enrollmentId).subscribe(() => {
      expect(snackBar.openFromComponent).toHaveBeenCalled();
      expect(snackBar.dismiss).toHaveBeenCalled();
      expect(reportService.generateLearningTrailCertificate).toHaveBeenCalledWith(enrollmentId);
      expect(reportService.openCertificate).toHaveBeenCalledWith(certificate_url);
      done();
    });
  });

  it('should navigate to course with id', () => {
    const enrollment = { learning_trail: { id: '1' } } as Enrollment;

    service.viewLearningTrail(enrollment);

    expect(router.navigateByUrl).toHaveBeenCalledWith(`${TRAILS_DETAIL_PREFIX}/1`);
  });

  describe('buildFilter', () => {
    it('should update the provided filter with the required params for content creator', () => {
      const expectedFilter = {
        search: 'test',
        ordering: '',
        learning_trail__user_creator: 'mock_user_id',
      };

      expect(service.buildFilter({ search: 'test' }, true, true)).toEqual(expectedFilter);
    });

    it('should update the provided filter with the required params for non-content creator', () => {
      const expectedFilter = {
        search: 'test',
        ordering: '',
      };

      expect(service.buildFilter({ search: 'test' }, true, false)).toEqual(expectedFilter);
    });

    it('should update the provided filter with the required params and userId when filteringAllUsers equals false', () => {
      const expectedFilter = {
        search: 'test',
        user: 'mock_user_id',
        ordering: '',
      };

      expect(service.buildFilter({ search: 'test' }, false, false)).toEqual(expectedFilter);
    });

    it('should update the provided filter with ordering matching sort asc for content creator', () => {
      const expectedFilter = {
        search: 'test',
        ordering: 'mission__name',
        learning_trail__user_creator: 'mock_user_id',
      };

      expect(
        service.buildFilter({ search: 'test' }, true, true, {
          field: 'mission__name',
          direction: 'asc',
        }),
      ).toEqual(expectedFilter);
    });

    it('should update the provided filter with ordering matching sort desc for non-content creator', () => {
      const expectedFilter = {
        search: 'test',
        ordering: '-mission__name',
      };

      expect(
        service.buildFilter({ search: 'test' }, true, false, {
          field: 'mission__name',
          direction: 'desc',
        }),
      ).toEqual(expectedFilter);
    });
  });

  describe('fetchTracking', () => {
    let enrollment: Enrollment;
    let contentTracking: EnrollmentTracking[];
    let dialogData: any;

    beforeEach(() => {
      enrollment = { id: '1', learning_trail: { id: '1' } } as Enrollment;
      contentTracking = [
        {
          consumption: 1,
          consume_duration: 1,
          content: {} as Content,
          content_duration: 1,
          first_access: '',
          last_access: '',
          name: 'Bulbasaur',
          total_correct_answers: null,
          total_questions: null,
        },
      ] as EnrollmentTracking[];
      dialogData = {
        data: {
          enrollment,
          tracking: [],
          trackingTitle: 'ENROLLMENTS.TITLE.viewActivities',
          viewText: 'ENROLLMENT.TRACKING.VIEW_TRAIL',
        },
      };
    });

    it('should trigger dialog open when there is no enrollment in mission like admin or live mission expired', (done) => {
      const tracking = [
        {
          id: '2d2d94f1-5e59-44e8-ad10-60cf69bd1152',
          name: 'Inativa - 28/06/2023',
          step_type: 'MISSION',
          mission_enrollment_id: null,
          external_course: true,
        },
      ] as TrackStep[];

      const trail = {
        steps: [
          {
            mission: {
              id: '2d2d94f1-5e59-44e8-ad10-60cf69bd1152',
              external_course_url: 'https://test.com',
            },
          },
        ],
      } as unknown as LearningTrail;

      const data = {
        ...dialogData,
        data: {
          ...dialogData.data,
          tracking: [
            {
              contents: [],
              track: tracking[0],
            },
          ],
        },
      };

      enrollmentsAPI.fetchTracking.mockReturnValue(of(tracking));
      learningTrailAPI.getById.mockReturnValue(of(trail));
      missionEnrollmentsAPI.fetchTracking.mockReturnValue(of(contentTracking));

      service.fetchTracking(enrollment).subscribe(() => {
        expect(enrollmentsAPI.fetchTracking).toHaveBeenCalledTimes(1);
        expect(enrollmentsAPI.fetchTracking).toHaveBeenCalledWith('1');
        expect(matDialog.open).toHaveBeenCalledWith(EnrollmentTrackingDialogComponent, data);
        done();
      });
    });

    it('should trigger dialog open if tracking is a MISSION tracking', (done) => {
      const tracking = [
        {
          id: 'dc2f9974-a856-46d0-9973-ed44abccba51',
          name: 'Teste missão interna',
          step_type: 'MISSION',
          mission_enrollment_id: 'ed585b85-bfb9-4349-bc5c-954887c4551a',
          external_course: false,
        },
      ] as TrackStep[];

      const trail = {
        steps: [
          {
            mission: {
              id: 'dc2f9974-a856-46d0-9973-ed44abccba51',
              external_course_url: null,
            },
          },
        ],
      } as unknown as LearningTrail;

      const data = {
        ...dialogData,
        data: {
          ...dialogData.data,
          tracking: [
            {
              contents: [
                {
                  consume_duration: 1,
                  consumption: 1,
                  consumption_status: {
                    color: 'green',
                    icon: 'check',
                  },
                  content: {},
                  content_duration: 1,
                  first_access: '',
                  last_access: '',
                  name: 'Bulbasaur',
                  total_correct_answers: null,
                  total_questions: null,
                },
              ],
              track: tracking[0],
            },
          ],
        },
      };

      enrollmentsAPI.fetchTracking.mockReturnValue(of(tracking));
      learningTrailAPI.getById.mockReturnValue(of(trail));
      missionEnrollmentsAPI.fetchTracking.mockReturnValue(of(contentTracking));

      service.fetchTracking(enrollment).subscribe(() => {
        expect(enrollmentsAPI.fetchTracking).toHaveBeenCalledTimes(1);
        expect(enrollmentsAPI.fetchTracking).toHaveBeenCalledWith(enrollment.id);
        expect(missionEnrollmentsAPI.fetchTracking).toHaveBeenCalledWith(tracking[0].mission_enrollment_id);
        expect(missionEnrollmentsAPI.fetchTracking).toHaveBeenCalledTimes(1);
        expect(matDialog.open).toHaveBeenCalledWith(EnrollmentTrackingDialogComponent, data);
        done();
      });
    });

    it('should trigger dialog open if tracking is a PULSE tracking', (done) => {
      const tracking = [
        {
          id: '0a6b357d-3ffe-49a1-a1bc-60e8c029696f',
          name: 'Ligação pré-vendas para empresa Granol.',
          step_type: 'PULSE',
          mission_enrollment_id: null,
        },
      ] as TrackStep[];

      const pulseTracking: EnrollmentTracking = {
        consume_duration: 1733,
        content_duration: 3069,
        first_access: '2023-06-30T09:29:54.229000-03:00',
        last_access: '2023-07-06T17:36:22.419000-03:00',
      } as EnrollmentTracking;

      const trail = {
        steps: [],
      } as unknown as LearningTrail;

      const data = {
        ...dialogData,
        data: {
          ...dialogData.data,
          tracking: [
            {
              contents: [
                {
                  consume_duration: 1733,
                  consumption_status: {
                    color: 'orange',
                    icon: 'more_horiz',
                  },
                  content_duration: 3069,
                  first_access: '2023-06-30T09:29:54.229000-03:00',
                  last_access: '2023-07-06T17:36:22.419000-03:00',
                },
              ],
              track: tracking[0],
            },
          ],
        },
      };

      enrollmentsAPI.fetchTracking.mockReturnValue(of(tracking));
      learningTrailAPI.getById.mockReturnValue(of(trail));
      enrollmentsAPI.fetchTrackingFromPulse.mockReturnValue(of(pulseTracking));

      service.fetchTracking(enrollment).subscribe(() => {
        expect(enrollmentsAPI.fetchTracking).toHaveBeenCalledTimes(1);
        expect(enrollmentsAPI.fetchTracking).toHaveBeenCalledWith(enrollment.id);
        expect(enrollmentsAPI.fetchTrackingFromPulse).toHaveBeenCalledTimes(1);
        expect(enrollmentsAPI.fetchTrackingFromPulse).toHaveBeenCalledWith(enrollment.id, tracking[0].id);
        expect(matDialog.open).toHaveBeenCalledWith(EnrollmentTrackingDialogComponent, data);
        done();
      });
    });
  });
});
