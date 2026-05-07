import { TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { LearningTrailAPI } from '@core/api/learning-trail.api';
import { MissionEnrollmentsAPI } from '@core/api/mission-enrollments.api';
import { Content, Enrollment, EnrollmentFilter, EnrollmentTracking } from '@core/model/enrollment.model';
import { getTranslocoTestingModule } from '@core/utils/transloco-testing.module';
import {
  AuthService,
  EnrollmentStatuses,
  Pagination,
  UserProfileService,
} from '@keeps-platform-frontend-workspace/kp-keeps';
import { FuseLoadingService } from '@keeps-platform-frontend-workspace/layout';
import { Step } from 'app/main/learning-trail/model/learning-trail';
import { Mission, MissionModel } from 'app/main/mission/mission.model';
import { Pulse } from '@core/model/pulse.model';
import { EnrollmentTrackingDialogComponent } from 'app/shared/components/enrollment-tracking-dialog/enrollment-tracking-dialog.component';
import { ReportService } from 'app/shared/services/report.service';
import { of } from 'rxjs';
import { LinkedLearningTrailsComponent } from '../components/linked-learning-trails-dialog/linked-learning-trails-dialog.component';
import { MissionsEnrollmentsDialogComponent } from '../components/missions-enrollments-dialog/missions-enrollments-dialog.component';
import { CalculateConsumptionStatus, MissionDoneActionType } from '../consts';
import { MissionEnrollmentsService } from './mission-enrollments.service';

describe('MissionEnrollmentsService', () => {
  let service: MissionEnrollmentsService;
  let learningTrailAPI: jest.Mocked<LearningTrailAPI>;
  let enrollmentsAPI: jest.Mocked<MissionEnrollmentsAPI>;
  let matDialog: jest.Mocked<MatDialog>;
  let fuseLoadingService: jest.Mocked<FuseLoadingService>;
  let reportService: jest.Mocked<ReportService>;
  let snackBar: jest.Mocked<MatSnackBar>;
  let router: jest.Mocked<Router>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [getTranslocoTestingModule()],
      providers: [
        MissionEnrollmentsService,
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
          useValue: { navigate: jest.fn() },
        },
        {
          provide: FuseLoadingService,
          useValue: { show: jest.fn(), hide: jest.fn() },
        },
        {
          provide: MissionEnrollmentsAPI,
          useValue: { fetchTracking: jest.fn(), approveEnrollment: jest.fn(), changePerformance: jest.fn() },
        },
        {
          provide: MatSnackBar,
          useValue: { openFromComponent: jest.fn(), dismiss: jest.fn() },
        },
        {
          provide: ReportService,
          useValue: { openCertificate: jest.fn(), generateCourseCertificate: jest.fn() },
        },
        {
          provide: MatDialog,
          useValue: { open: jest.fn() },
        },
        {
          provide: UserProfileService,
          useValue: { hasRoles: jest.fn() },
        },
      ],
    }).compileComponents();

    service = TestBed.inject(MissionEnrollmentsService);
    learningTrailAPI = TestBed.inject(LearningTrailAPI) as jest.Mocked<LearningTrailAPI>;
    enrollmentsAPI = TestBed.inject(MissionEnrollmentsAPI) as jest.Mocked<MissionEnrollmentsAPI>;
    matDialog = TestBed.inject(MatDialog) as jest.Mocked<MatDialog>;
    matDialog.open.mockReturnValue({ afterClosed: () => of(1) } as any);
    fuseLoadingService = TestBed.inject(FuseLoadingService) as jest.Mocked<FuseLoadingService>;
    router = TestBed.inject(Router) as jest.Mocked<Router>;
    reportService = TestBed.inject(ReportService) as jest.Mocked<ReportService>;
    snackBar = TestBed.inject(MatSnackBar) as jest.Mocked<MatSnackBar>;
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
        mission: undefined,
        provider: undefined,
        startDate: undefined,
        endDate: undefined,
        enrolledCount: undefined,
        performance: undefined,
        progress: undefined,
        points: undefined,
        user: undefined,
        overdueDays: 0,
        actions: [
          MissionDoneActionType.VIEW_ACTIVITIES,
          MissionDoneActionType.RE_ENROLL,
          MissionDoneActionType.LINK_CYCLE,
          MissionDoneActionType.RESTART,
          MissionDoneActionType.DELETE,
        ],
      },
    ] as Enrollment[];

    const response = service.loadEnrollmentsSuccess(enrollments, true, true, false);

    expect(response).toEqual(expectedEnrollments);
  });

  it('should build enrollments with attach certificate', () => {
    const enrollments = [
      {
        status: EnrollmentStatuses.STARTED,
        mission: { mission_model: MissionModel.EXTERNAL_PROVIDER, external_course_url: 'bulbasaur.png' },
      },
    ] as Enrollment[];
    const expectedEnrollments = [
      {
        status: EnrollmentStatuses.STARTED,
        id: undefined,
        goalDate: '',
        mission: { mission_model: MissionModel.EXTERNAL_PROVIDER, external_course_url: 'bulbasaur.png' },
        provider: undefined,
        startDate: undefined,
        endDate: undefined,
        enrolledCount: undefined,
        performance: undefined,
        progress: undefined,
        points: undefined,
        user: undefined,
        overdueDays: 0,
        actions: [
          MissionDoneActionType.VIEW_ACTIVITIES,
          MissionDoneActionType.CONTINUE,
          MissionDoneActionType.GIVE_UP,
          MissionDoneActionType.ATTACH_CERTIFICATE,
        ],
      },
    ] as Enrollment[];

    const response = service.loadEnrollmentsSuccess(enrollments, false, true, false);

    expect(response).toEqual(expectedEnrollments);
  });

  it('should open dialog of LinkedLearningTrailsComponent', (done) => {
    const steps = [
      {
        id: '1',
        learning_trail: '2',
        learning_trail_name: 'Bulbasaur',
        mission: {} as Mission,
        order: 0,
        pulse: {} as Pulse,
      },
    ];
    learningTrailAPI.getLearningTrailSteps.mockReturnValue(of({ results: steps } as Pagination<Step>));

    service.getLearningTrailSteps('1').subscribe(() => {
      expect(matDialog.open).toHaveBeenCalledWith(LinkedLearningTrailsComponent, {
        minWidth: '70%',
        data: steps,
      });
      expect(fuseLoadingService.hide).toHaveBeenCalled();
      done();
    });
  });

  it('should navigate to learning trail', (done) => {
    const step = {
      id: '1',
      learning_trail: '2',
      learning_trail_name: 'Bulbasaur',
      mission: {} as Mission,
      order: 0,
      pulse: {} as Pulse,
    };
    const steps = [step];
    const afterClosedResult = of({
      row: { ...step, learning_trail: { id: '2' } },
      results: steps,
    } as any);
    matDialog.open.mockReturnValue({ afterClosed: jest.fn().mockReturnValue(afterClosedResult) } as any);
    learningTrailAPI.getLearningTrailSteps.mockReturnValue(of(steps) as any);

    service.getLearningTrailSteps('1').subscribe(() => {
      expect(router.navigate).toHaveBeenCalledWith(['/learning-trails', step.learning_trail, 'details']);
      done();
    });
  });

  it('should open dialog with MissionsEnrollmentsDialogComponent', () => {
    const enrollments = [{} as Enrollment];

    service.openEnrollmentsByUser(enrollments);

    expect(matDialog.open).toHaveBeenCalledWith(MissionsEnrollmentsDialogComponent, {
      data: enrollments,
      minWidth: '60%',
    });
  });

  it('should open dialog of EnrollmentTrackingDialogComponent and dispatch viewMission', (done) => {
    const enrollment = { id: '1' } as Enrollment;
    const tracking = [
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
    const dialogConfig = {
      maxHeight: '95vh',
      data: {
        trackingTitle: 'ENROLLMENTS.TITLE.' + MissionDoneActionType.VIEW_ACTIVITIES,
        tracking: [
          {
            ...tracking[0],
            consumption_status: CalculateConsumptionStatus(tracking[0]),
          },
        ],
        viewText: 'ENROLLMENT.TRACKING.VIEW_MISSION',
        enrollment,
      },
    };

    enrollmentsAPI.fetchTracking.mockReturnValue(of(tracking));
    matDialog.open.mockReturnValue({ afterClosed: () => of(enrollment) } as any);

    service.fetchTracking(enrollment).subscribe(() => {
      expect(enrollmentsAPI.fetchTracking).toHaveBeenCalledTimes(1);
      expect(enrollmentsAPI.fetchTracking).toHaveBeenCalledWith(enrollment.id);
      expect(fuseLoadingService.show).toHaveBeenCalledTimes(1);
      expect(matDialog.open).toHaveBeenCalledWith(EnrollmentTrackingDialogComponent, dialogConfig);
      expect(fuseLoadingService.hide).toHaveBeenCalledTimes(1);
      done();
    });
  });

  it('should generate and open certificate', (done) => {
    const certificate_url = 'bulbasaur_pokemon.pdf';

    reportService.generateCourseCertificate.mockReturnValue(of({ certificate_url }));

    service.generateCertificate('1').subscribe(() => {
      expect(snackBar.openFromComponent).toHaveBeenCalled();
      expect(snackBar.dismiss).toHaveBeenCalled();
      expect(reportService.generateCourseCertificate).toHaveBeenCalledWith('1');
      expect(reportService.openCertificate).toHaveBeenCalledWith(certificate_url);
      done();
    });
  });

  describe('Mission actions', () => {
    describe('Internal, external and scorm mission', () => {
      describe('Admin actions', () => {
        it(`should return correct actions when enrollment required is false and status is: ${EnrollmentStatuses.COMPLETED}`, () => {
          const enrollments = [{ status: EnrollmentStatuses.COMPLETED }] as Enrollment[];
          const response = service.loadEnrollmentsSuccess(enrollments, true, true, false);
          expect(response[0].actions).toEqual([
            MissionDoneActionType.VIEW_ACTIVITIES,
            MissionDoneActionType.RE_ENROLL,
            MissionDoneActionType.LINK_CYCLE,
            MissionDoneActionType.RESTART,
            MissionDoneActionType.DELETE,
          ]);
        });

        it(`should return correct actions when enrollment required is true and status is: ${EnrollmentStatuses.COMPLETED}`, () => {
          const enrollments = [{ status: EnrollmentStatuses.COMPLETED, required: true }] as Enrollment[];
          const response = service.loadEnrollmentsSuccess(enrollments, true, true, false);
          expect(response[0].actions).toEqual([
            MissionDoneActionType.VIEW_ACTIVITIES,
            MissionDoneActionType.LINK_CYCLE,
            MissionDoneActionType.RESTART,
            MissionDoneActionType.RE_ENROLL,
            MissionDoneActionType.DELETE,
          ]);
        });

        it(`should return correct actions when enrollment required is false and status is: ${EnrollmentStatuses.REPROVED}`, () => {
          const enrollments = [
            { status: EnrollmentStatuses.REPROVED, mission: { external_course_url: '' } },
          ] as Enrollment[];
          const response = service.loadEnrollmentsSuccess(enrollments, true, true, false);
          expect(response[0].actions).toEqual([
            MissionDoneActionType.VIEW_ACTIVITIES,
            MissionDoneActionType.LINK_CYCLE,
            MissionDoneActionType.APPROVE_ENROLLMENT,
            MissionDoneActionType.RE_ENROLL,
            MissionDoneActionType.RESTART,
            MissionDoneActionType.DELETE,
          ]);
        });

        it(`should return correct actions when enrollment required is true and status is: ${EnrollmentStatuses.REPROVED}`, () => {
          const enrollments = [
            { status: EnrollmentStatuses.REPROVED, required: true, mission: { external_course_url: '' } },
          ] as Enrollment[];
          const response = service.loadEnrollmentsSuccess(enrollments, true, true, false);
          expect(response[0].actions).toEqual([
            MissionDoneActionType.VIEW_ACTIVITIES,
            MissionDoneActionType.LINK_CYCLE,
            MissionDoneActionType.APPROVE_ENROLLMENT,
            MissionDoneActionType.RE_ENROLL,
            MissionDoneActionType.RESTART,
            MissionDoneActionType.DELETE,
          ]);
        });

        it(`should return correct actions when enrollment required is false and status is: ${EnrollmentStatuses.ENROLLED}`, () => {
          const enrollments = [
            { status: EnrollmentStatuses.ENROLLED, mission: { external_course_url: '' } },
          ] as Enrollment[];
          const response = service.loadEnrollmentsSuccess(enrollments, true, true, false);
          expect(response[0].actions).toEqual([
            MissionDoneActionType.LINK_CYCLE,
            MissionDoneActionType.APPROVE_ENROLLMENT,
            MissionDoneActionType.DELETE,
          ]);
        });

        it(`should return correct actions when enrollment required is true and status is: ${EnrollmentStatuses.ENROLLED}`, () => {
          const enrollments = [
            { status: EnrollmentStatuses.ENROLLED, required: true, mission: { external_course_url: '' } },
          ] as Enrollment[];
          const response = service.loadEnrollmentsSuccess(enrollments, true, true, false);
          expect(response[0].actions).toEqual([
            MissionDoneActionType.LINK_CYCLE,
            MissionDoneActionType.APPROVE_ENROLLMENT,
            MissionDoneActionType.DELETE,
          ]);
        });

        it(`should return correct actions when enrollment required is false and status is: ${EnrollmentStatuses.STARTED}`, () => {
          const enrollments = [{ status: EnrollmentStatuses.STARTED }] as Enrollment[];
          const response = service.loadEnrollmentsSuccess(enrollments, true, true, false);
          expect(response[0].actions).toEqual([
            MissionDoneActionType.VIEW_ACTIVITIES,
            MissionDoneActionType.LINK_CYCLE,
            MissionDoneActionType.APPROVE_ENROLLMENT,
            MissionDoneActionType.DELETE,
          ]);
        });

        it(`should return correct actions when enrollment required is true and status is: ${EnrollmentStatuses.STARTED}`, () => {
          const enrollments = [{ status: EnrollmentStatuses.STARTED, required: true }] as Enrollment[];
          const response = service.loadEnrollmentsSuccess(enrollments, true, true, false);
          expect(response[0].actions).toEqual([
            MissionDoneActionType.VIEW_ACTIVITIES,
            MissionDoneActionType.LINK_CYCLE,
            MissionDoneActionType.APPROVE_ENROLLMENT,
            MissionDoneActionType.DELETE,
          ]);
        });

        it(`should return correct actions when enrollment required is false and status is: ${EnrollmentStatuses.EXPIRED}`, () => {
          const enrollments = [
            { status: EnrollmentStatuses.EXPIRED, mission: { external_course_url: '' } },
          ] as Enrollment[];
          const response = service.loadEnrollmentsSuccess(enrollments, true, true, false);
          expect(response[0].actions).toEqual([
            MissionDoneActionType.VIEW_ACTIVITIES,
            MissionDoneActionType.LINK_CYCLE,
            MissionDoneActionType.DELETE,
          ]);
        });

        it(`should return correct actions when enrollment required is true and status is: ${EnrollmentStatuses.EXPIRED}`, () => {
          const enrollments = [
            { status: EnrollmentStatuses.EXPIRED, required: true, mission: { external_course_url: '' } },
          ] as Enrollment[];
          const response = service.loadEnrollmentsSuccess(enrollments, true, true, false);
          expect(response[0].actions).toEqual([
            MissionDoneActionType.VIEW_ACTIVITIES,
            MissionDoneActionType.LINK_CYCLE,
            MissionDoneActionType.EXTEND_DEADLINE_ADMIN,
            MissionDoneActionType.DELETE,
          ]);
        });

        it(`should return correct actions when enrollment required is false and status is: ${EnrollmentStatuses.REQUEST_EXTENSION}`, () => {
          const enrollments = [
            { status: EnrollmentStatuses.REQUEST_EXTENSION, mission: { external_course_url: '' } },
          ] as Enrollment[];
          const response = service.loadEnrollmentsSuccess(enrollments, true, true, false);
          expect(response[0].actions).toEqual([
            MissionDoneActionType.VIEW_ACTIVITIES,
            MissionDoneActionType.LINK_CYCLE,
          ]);
        });

        it(`should return correct actions when enrollment required is true and status is: ${EnrollmentStatuses.REQUEST_EXTENSION}`, () => {
          const enrollments = [
            {
              status: EnrollmentStatuses.REQUEST_EXTENSION,
              required: true,
              mission: { external_course_url: '' },
            },
          ] as Enrollment[];
          const response = service.loadEnrollmentsSuccess(enrollments, true, true, false);
          expect(response[0].actions).toEqual([
            MissionDoneActionType.VIEW_ACTIVITIES,
            MissionDoneActionType.LINK_CYCLE,
            MissionDoneActionType.EXTEND_DEADLINE_ADMIN,
          ]);
        });

        it(`should return correct actions when enrollment required is false and status is: ${EnrollmentStatuses.PENDING_VALIDATION}`, () => {
          const enrollments = [{ status: EnrollmentStatuses.PENDING_VALIDATION }] as Enrollment[];
          const response = service.loadEnrollmentsSuccess(enrollments, true, true, false);
          expect(response[0].actions).toEqual([
            MissionDoneActionType.LINK_CYCLE,
            MissionDoneActionType.APPROVE_CERTIFICATE,
            MissionDoneActionType.REJECT_CERTIFICATE,
            MissionDoneActionType.HISTORY,
            MissionDoneActionType.DELETE,
          ]);
        });

        it(`should return correct actions when enrollment required is true and status is: ${EnrollmentStatuses.PENDING_VALIDATION}`, () => {
          const enrollments = [{ status: EnrollmentStatuses.PENDING_VALIDATION, required: true }] as Enrollment[];
          const response = service.loadEnrollmentsSuccess(enrollments, true, true, false);
          expect(response[0].actions).toEqual([
            MissionDoneActionType.LINK_CYCLE,
            MissionDoneActionType.APPROVE_CERTIFICATE,
            MissionDoneActionType.REJECT_CERTIFICATE,
            MissionDoneActionType.HISTORY,
            MissionDoneActionType.DELETE,
          ]);
        });

        it(`should return correct actions when enrollment required is false and status is: ${EnrollmentStatuses.REFUSED}`, () => {
          const enrollments = [
            { status: EnrollmentStatuses.REFUSED, mission: { external_course_url: '' } },
          ] as Enrollment[];
          const response = service.loadEnrollmentsSuccess(enrollments, true, true, false);
          expect(response[0].actions).toEqual([
            MissionDoneActionType.LINK_CYCLE,
            MissionDoneActionType.APPROVE_CERTIFICATE,
            MissionDoneActionType.DELETE,
          ]);
        });

        it(`should return correct actions when enrollment required is true and status is: ${EnrollmentStatuses.REFUSED}`, () => {
          const enrollments = [
            { status: EnrollmentStatuses.REFUSED, required: true, mission: { external_course_url: '' } },
          ] as Enrollment[];
          const response = service.loadEnrollmentsSuccess(enrollments, true, true, false);
          expect(response[0].actions).toEqual([
            MissionDoneActionType.LINK_CYCLE,
            MissionDoneActionType.APPROVE_CERTIFICATE,
            MissionDoneActionType.DELETE,
          ]);
        });

        it(`should return correct actions when enrollment required is false and status is: ${EnrollmentStatuses.INACTIVATED}`, () => {
          const enrollments = [
            { status: EnrollmentStatuses.INACTIVATED, mission: { external_course_url: '' } },
          ] as Enrollment[];
          const response = service.loadEnrollmentsSuccess(enrollments, true, true, false);
          expect(response[0].actions).toEqual([MissionDoneActionType.APPROVE_ENROLLMENT, MissionDoneActionType.DELETE]);
        });

        it(`should return correct actions when enrollment required is true and status is: ${EnrollmentStatuses.INACTIVATED}`, () => {
          const enrollments = [
            { status: EnrollmentStatuses.INACTIVATED, required: true, mission: { external_course_url: '' } },
          ] as Enrollment[];
          const response = service.loadEnrollmentsSuccess(enrollments, true, true, false);
          expect(response[0].actions).toEqual([MissionDoneActionType.APPROVE_ENROLLMENT, MissionDoneActionType.DELETE]);
        });

        it(`should return correct actions when enrollment required is true and status is: ${EnrollmentStatuses.GIVE_UP}`, () => {
          const enrollments = [
            { status: EnrollmentStatuses.GIVE_UP, required: true, mission: { external_course_url: '' } },
          ] as Enrollment[];
          const response = service.loadEnrollmentsSuccess(enrollments, true, true, false);
          expect(response[0].actions).toEqual([MissionDoneActionType.LINK_CYCLE, MissionDoneActionType.RETAKE]);
        });
      });

      describe('User actions', () => {
        it(`should return correct actions when enrollment required is false and status is: ${EnrollmentStatuses.COMPLETED}`, () => {
          const enrollments = [{ status: EnrollmentStatuses.COMPLETED }] as Enrollment[];
          const response = service.loadEnrollmentsSuccess(enrollments, false, true, false);
          expect(response[0].actions).toEqual([
            MissionDoneActionType.VIEW_ACTIVITIES,
            MissionDoneActionType.RE_ENROLL,
            MissionDoneActionType.VIEW_MISSION,
          ]);
        });

        it(`should return correct actions when enrollment required is true and status is: ${EnrollmentStatuses.COMPLETED}`, () => {
          const enrollments = [{ status: EnrollmentStatuses.COMPLETED, required: true }] as Enrollment[];
          const response = service.loadEnrollmentsSuccess(enrollments, false, true, false);
          expect(response[0].actions).toEqual([
            MissionDoneActionType.VIEW_ACTIVITIES,
            MissionDoneActionType.VIEW_MISSION,
          ]);
        });

        it(`should return correct actions when enrollment required is false and status is: ${EnrollmentStatuses.REPROVED}`, () => {
          const enrollments = [
            { status: EnrollmentStatuses.REPROVED, mission: { external_course_url: '' } },
          ] as Enrollment[];
          const response = service.loadEnrollmentsSuccess(enrollments, false, true, false);
          expect(response[0].actions).toEqual([
            MissionDoneActionType.VIEW_ACTIVITIES,
            MissionDoneActionType.VIEW_MISSION,
            MissionDoneActionType.RE_ENROLL,
          ]);
        });

        it(`should return correct actions when enrollment required is true and status is: ${EnrollmentStatuses.REPROVED}`, () => {
          const enrollments = [
            { status: EnrollmentStatuses.REPROVED, required: true, mission: { external_course_url: '' } },
          ] as Enrollment[];
          const response = service.loadEnrollmentsSuccess(enrollments, false, true, false);
          expect(response[0].actions).toEqual([
            MissionDoneActionType.VIEW_ACTIVITIES,
            MissionDoneActionType.VIEW_MISSION,
          ]);
        });

        it(`should return correct actions when enrollment required is false and status is: ${EnrollmentStatuses.ENROLLED}`, () => {
          const enrollments = [
            { status: EnrollmentStatuses.ENROLLED, mission: { external_course_url: '' } },
          ] as Enrollment[];
          const response = service.loadEnrollmentsSuccess(enrollments, false, true, false);
          expect(response[0].actions).toEqual([MissionDoneActionType.VIEW_MISSION, MissionDoneActionType.GIVE_UP]);
        });

        it(`should return correct actions when enrollment required is true and status is: ${EnrollmentStatuses.ENROLLED}`, () => {
          const enrollments = [
            { status: EnrollmentStatuses.ENROLLED, required: true, mission: { external_course_url: '' } },
          ] as Enrollment[];
          const response = service.loadEnrollmentsSuccess(enrollments, false, true, false);
          expect(response[0].actions).toEqual([MissionDoneActionType.VIEW_MISSION]);
        });

        it(`should return correct actions when enrollment required is false and status is: ${EnrollmentStatuses.STARTED}`, () => {
          const enrollments = [
            { status: EnrollmentStatuses.STARTED, mission: { external_course_url: '' } },
          ] as Enrollment[];
          const response = service.loadEnrollmentsSuccess(enrollments, false, true, false);
          expect(response[0].actions).toEqual([
            MissionDoneActionType.VIEW_ACTIVITIES,
            MissionDoneActionType.CONTINUE,
            MissionDoneActionType.GIVE_UP,
          ]);
        });

        it(`should return correct actions when enrollment required is true and status is: ${EnrollmentStatuses.STARTED}`, () => {
          const enrollments = [
            { status: EnrollmentStatuses.STARTED, required: true, mission: { external_course_url: '' } },
          ] as Enrollment[];
          const response = service.loadEnrollmentsSuccess(enrollments, false, true, false);
          expect(response[0].actions).toEqual([MissionDoneActionType.VIEW_ACTIVITIES, MissionDoneActionType.CONTINUE]);
        });

        it(`should return correct actions when enrollment required is false and status is: ${EnrollmentStatuses.EXPIRED}`, () => {
          const enrollments = [
            { status: EnrollmentStatuses.EXPIRED, mission: { external_course_url: '' } },
          ] as Enrollment[];
          const response = service.loadEnrollmentsSuccess(enrollments, false, true, false);
          expect(response[0].actions).toEqual([
            MissionDoneActionType.VIEW_ACTIVITIES,
            MissionDoneActionType.EXTEND_DEADLINE,
          ]);
        });

        it(`should return correct actions when enrollment required is true and status is: ${EnrollmentStatuses.EXPIRED}`, () => {
          const enrollments = [
            { status: EnrollmentStatuses.EXPIRED, required: true, mission: { external_course_url: '' } },
          ] as Enrollment[];
          const response = service.loadEnrollmentsSuccess(enrollments, false, true, false);
          expect(response[0].actions).toEqual([
            MissionDoneActionType.VIEW_ACTIVITIES,
            MissionDoneActionType.EXTEND_DEADLINE,
          ]);
        });

        it(`should return correct actions when enrollment required is false and status is: ${EnrollmentStatuses.REQUEST_EXTENSION}`, () => {
          const enrollments = [
            { status: EnrollmentStatuses.REQUEST_EXTENSION, mission: { external_course_url: '' } },
          ] as Enrollment[];
          const response = service.loadEnrollmentsSuccess(enrollments, false, true, false);
          expect(response[0].actions).toEqual([MissionDoneActionType.VIEW_ACTIVITIES]);
        });

        it(`should return correct actions when enrollment required is true and status is: ${EnrollmentStatuses.REQUEST_EXTENSION}`, () => {
          const enrollments = [
            {
              status: EnrollmentStatuses.REQUEST_EXTENSION,
              required: true,
              mission: { external_course_url: '' },
            },
          ] as Enrollment[];
          const response = service.loadEnrollmentsSuccess(enrollments, false, true, false);
          expect(response[0].actions).toEqual([MissionDoneActionType.VIEW_ACTIVITIES]);
        });

        it(`should return correct actions when enrollment required is false and status is: ${EnrollmentStatuses.PENDING_VALIDATION}`, () => {
          const enrollments = [{ status: EnrollmentStatuses.PENDING_VALIDATION }] as Enrollment[];
          const response = service.loadEnrollmentsSuccess(enrollments, false, true, false);
          expect(response[0].actions).toEqual([MissionDoneActionType.VIEW_MISSION]);
        });

        it(`should return correct actions when enrollment required is true and status is: ${EnrollmentStatuses.PENDING_VALIDATION}`, () => {
          const enrollments = [{ status: EnrollmentStatuses.PENDING_VALIDATION, required: true }] as Enrollment[];
          const response = service.loadEnrollmentsSuccess(enrollments, false, true, false);
          expect(response[0].actions).toEqual([MissionDoneActionType.VIEW_MISSION]);
        });

        it(`should return correct actions when enrollment required is false and status is: ${EnrollmentStatuses.REFUSED}`, () => {
          const enrollments = [
            { status: EnrollmentStatuses.REFUSED, mission: { external_course_url: '' } },
          ] as Enrollment[];
          const response = service.loadEnrollmentsSuccess(enrollments, false, true, false);
          expect(response[0].actions).toEqual([MissionDoneActionType.VIEW_MISSION]);
        });

        it(`should return correct actions when enrollment required is true and status is: ${EnrollmentStatuses.REFUSED}`, () => {
          const enrollments = [
            { status: EnrollmentStatuses.REFUSED, required: true, mission: { external_course_url: '' } },
          ] as Enrollment[];
          const response = service.loadEnrollmentsSuccess(enrollments, false, true, false);
          expect(response[0].actions).toEqual([MissionDoneActionType.VIEW_MISSION]);
        });

        it(`should return correct actions when enrollment required is false and status is: ${EnrollmentStatuses.INACTIVATED}`, () => {
          const enrollments = [
            { status: EnrollmentStatuses.INACTIVATED, mission: { external_course_url: '' } },
          ] as Enrollment[];
          const response = service.loadEnrollmentsSuccess(enrollments, false, true, false);
          expect(response[0].actions).toEqual([]);
        });

        it(`should return correct actions when enrollment required is true and status is: ${EnrollmentStatuses.INACTIVATED}`, () => {
          const enrollments = [
            { status: EnrollmentStatuses.INACTIVATED, required: true, mission: { external_course_url: '' } },
          ] as Enrollment[];
          const response = service.loadEnrollmentsSuccess(enrollments, false, true, false);
          expect(response[0].actions).toEqual([]);
        });

        it(`should return correct actions when enrollment required is true and status is: ${EnrollmentStatuses.GIVE_UP}`, () => {
          const enrollments = [
            { status: EnrollmentStatuses.GIVE_UP, required: true, mission: { external_course_url: '' } },
          ] as Enrollment[];
          const response = service.loadEnrollmentsSuccess(enrollments, false, true, false);
          expect(response[0].actions).toEqual([]);
        });

        it(`should return correct actions when enrollment required is false and status is: ${EnrollmentStatuses.GIVE_UP}`, () => {
          const enrollments = [
            { status: EnrollmentStatuses.GIVE_UP, required: false, mission: { external_course_url: '' } },
          ] as Enrollment[];
          const response = service.loadEnrollmentsSuccess(enrollments, false, true, false);
          expect(response[0].actions).toEqual([MissionDoneActionType.RETAKE]);
        });
      });

      it(`should return correct actions when enrolled_count is greater than 1`, () => {
        const enrollments = [
          {
            status: EnrollmentStatuses.INACTIVATED,
            required: true,
            enrolled_count: 3,
            mission: { external_course_url: '' },
          },
        ] as Enrollment[];
        const response = service.loadEnrollmentsSuccess(enrollments, false, true, false);
        expect(response[0].actions).toEqual([MissionDoneActionType.PREVIOUS_ENROLLMENTS]);
      });
    });

    describe('Live and presential mission', () => {
      describe('Admin actions', () => {
        it(`should return correct actions when status is: ${EnrollmentStatuses.ENROLLED}`, () => {
          const enrollments = [
            { status: EnrollmentStatuses.ENROLLED, mission: { mission_model: MissionModel.PRESENTIAL } },
          ] as Enrollment[];

          const response = service.loadEnrollmentsSuccess(enrollments, true, true, false);

          expect(response[0].actions).toEqual([
            MissionDoneActionType.VIEW_MISSION,
            MissionDoneActionType.FINISH_ENROLLMENT,
            MissionDoneActionType.DELETE,
          ]);
        });

        it(`should return correct actions when status is: ${EnrollmentStatuses.EXPIRED}`, () => {
          const enrollments = [
            { status: EnrollmentStatuses.EXPIRED, mission: { mission_model: MissionModel.PRESENTIAL } },
          ] as Enrollment[];

          const response = service.loadEnrollmentsSuccess(enrollments, true, true, false);

          expect(response[0].actions).toEqual([
            MissionDoneActionType.VIEW_MISSION,
            MissionDoneActionType.APPROVE_PRESENTIAL_LIVE_ENROLLMENT,
          ]);
        });

        it(`should return correct actions when status is: ${EnrollmentStatuses.COMPLETED}`, () => {
          const enrollments = [
            { status: EnrollmentStatuses.COMPLETED, mission: { mission_model: MissionModel.PRESENTIAL } },
          ] as Enrollment[];

          const response = service.loadEnrollmentsSuccess(enrollments, true, true, false);

          expect(response[0].actions).toEqual([MissionDoneActionType.VIEW_MISSION]);
        });

        it(`should return correct actions when status is: ${EnrollmentStatuses.STARTED}`, () => {
          const enrollments = [
            { status: EnrollmentStatuses.STARTED, mission: { mission_model: MissionModel.PRESENTIAL } },
          ] as Enrollment[];

          const response = service.loadEnrollmentsSuccess(enrollments, true, true, false);

          expect(response[0].actions).toEqual([MissionDoneActionType.FINISH_ENROLLMENT, MissionDoneActionType.DELETE]);
        });

        it(`should return correct actions when status is: ${EnrollmentStatuses.REFUSED}`, () => {
          const enrollments = [
            { status: EnrollmentStatuses.REFUSED, mission: { mission_model: MissionModel.PRESENTIAL } },
          ] as Enrollment[];

          const response = service.loadEnrollmentsSuccess(enrollments, true, true, false);

          expect(response[0].actions).toEqual([MissionDoneActionType.DELETE]);
        });

        it(`should return correct actions when status is: ${EnrollmentStatuses.GIVE_UP}`, () => {
          const enrollments = [
            { status: EnrollmentStatuses.GIVE_UP, mission: { mission_model: MissionModel.PRESENTIAL } },
          ] as Enrollment[];

          const response = service.loadEnrollmentsSuccess(enrollments, true, true, false);

          expect(response[0].actions).toEqual([MissionDoneActionType.DELETE]);
        });

        describe('User actions', () => {
          it(`should return correct actions when status is: ${EnrollmentStatuses.ENROLLED}`, () => {
            const enrollments = [
              { status: EnrollmentStatuses.ENROLLED, mission: { mission_model: MissionModel.PRESENTIAL } },
            ] as Enrollment[];

            const response = service.loadEnrollmentsSuccess(enrollments, false, true, false);

            expect(response[0].actions).toEqual([MissionDoneActionType.VIEW_MISSION]);
          });

          it(`should return correct actions when status is: ${EnrollmentStatuses.STARTED}`, () => {
            const enrollments = [
              { status: EnrollmentStatuses.STARTED, mission: { mission_model: MissionModel.PRESENTIAL } },
            ] as Enrollment[];

            const response = service.loadEnrollmentsSuccess(enrollments, false, true, false);

            expect(response[0].actions).toEqual([MissionDoneActionType.VIEW_MISSION]);
          });
        });
      });
    });
  });

  describe('MissionEnrollmentsService - approveEnrollment', () => {
    it('should call approveEnrollment when status is not REPROVED', (done) => {
      const id = 'test-enrollment-id';
      const newPerformance = 0.85;
      const actualStatus = EnrollmentStatuses.ENROLLED;
      const apiResponse = { id: id, performance: newPerformance };

      enrollmentsAPI.approveEnrollment.mockReturnValue(of(apiResponse as Enrollment));

      service.approveEnrollment(id, actualStatus, newPerformance).subscribe((result) => {
        expect(result).toEqual(apiResponse);
        expect(enrollmentsAPI.approveEnrollment).toHaveBeenCalledWith(id, newPerformance);
        expect(enrollmentsAPI.changePerformance).not.toHaveBeenCalled();
        done();
      });
    });

    it('should call changePerformance when status is REPROVED', (done) => {
      const id = 'test-enrollment-id';
      const newPerformance = 0.75;
      const actualStatus = EnrollmentStatuses.REPROVED;
      const apiResponse = { id: id, performance: newPerformance };

      enrollmentsAPI.changePerformance.mockReturnValue(of(apiResponse as Enrollment));

      service.approveEnrollment(id, actualStatus, newPerformance).subscribe((result) => {
        expect(result).toEqual(apiResponse);
        expect(enrollmentsAPI.changePerformance).toHaveBeenCalledWith(id, newPerformance);
        expect(enrollmentsAPI.approveEnrollment).not.toHaveBeenCalled();
        done();
      });
    });
  });

  describe('buildFilter', () => {
    it('should update the provided filter with the required params for content creator', () => {
      const expectedFilter = {
        search: 'test',
        ordering: '-required,goal_date,-created_date',
        mission_model: 'INTERNAL,EXTERNAL_PROVIDER,SCORM',
        mission__user_creator: 'mock_user_id',
      };

      expect(service.buildFilter({ search: 'test' }, true, true, true)).toEqual(expectedFilter);
    });

    it('should update the provided filter with the required params for non-content creator', () => {
      const expectedFilter = {
        search: 'test',
        ordering: '-required,goal_date,-created_date',
        mission_model: 'INTERNAL,EXTERNAL_PROVIDER,SCORM',
      };

      expect(service.buildFilter({ search: 'test' }, true, true, false)).toEqual(expectedFilter);
    });

    it('should update the provided filter with the required params and userId when filteringAllUsers equals false', () => {
      const expectedFilter = {
        search: 'test',
        user: 'mock_user_id',
        ordering: '-required,goal_date,-created_date',
        mission_model: 'LIVE,PRESENTIAL',
      };

      expect(service.buildFilter({ search: 'test' }, false, false, false)).toEqual(expectedFilter);
    });

    it('should update the provided filter with ordering matching sort asc for content creator', () => {
      const expectedFilter = {
        search: 'test',
        ordering: 'mission__name',
        mission_model: 'INTERNAL,EXTERNAL_PROVIDER,SCORM',
        mission__user_creator: 'mock_user_id',
      };

      expect(
        service.buildFilter({ search: 'test' }, true, true, true, {
          field: 'mission__name',
          direction: 'asc',
        }),
      ).toEqual(expectedFilter);
    });

    it('should update the provided filter with ordering matching sort desc for non-content creator', () => {
      const expectedFilter: EnrollmentFilter = {
        search: 'test',
        ordering: '-mission__name',
        mission_model: 'LIVE,PRESENTIAL',
      };

      expect(
        service.buildFilter({ search: 'test' }, true, false, false, {
          field: 'mission__name',
          direction: 'desc',
        }),
      ).toEqual(expectedFilter);
    });
  });

  it(`should open external page when mission is external`, () => {
    const windowOpenSpy = (window.open = jest.fn());
    const enrollment = {
      mission: {
        mission_model: 'EXTERNAL_PROVIDER',
        external: { course_url: 'http://example.com' },
      },
    };

    service.openMission(enrollment as Enrollment);
    expect(windowOpenSpy).toHaveBeenCalledWith('http://example.com', '_blank');
  });

  it(`should open the classroom when mission is not external`, () => {
    const navigateSpy = jest.spyOn(router, 'navigate');
    const enrollment = {
      mission: {
        mission_model: 'INTERNAL',
        id: '123',
      },
    };

    service.openMission(enrollment as Enrollment);
    expect(navigateSpy).toHaveBeenCalledWith(['/course', enrollment.mission?.id], {
      queryParams: {
        rollbackPath: ['/enrollments', 'missions'],
      },
    });
  });
});
