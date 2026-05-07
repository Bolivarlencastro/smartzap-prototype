import { TestBed } from '@angular/core/testing';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { KonquestAPI } from '@core/api';
import { EvaluationAPI } from '@core/api/evaluation.api';
import { MissionEnrollmentsAPI } from '@core/api/mission-enrollments.api';
import { Enrollment } from '@core/model/enrollment.model';
import { AluraIntegrationsApi, AuthService, EnrollmentStatuses } from '@keeps-platform-frontend-workspace/kp-keeps';
import { FuseLoadingService } from '@keeps-platform-frontend-workspace/layout';
import { KpMessageService } from '@keeps-platform-frontend-workspace/ui/kp-message-service';
import { KpSnackLoadingComponent } from '@keeps-platform-frontend-workspace/ui/kp-snack-loading';
import { MissionEvaluationComponent } from 'app/main/evaluation/evaluation.component';
import { ReportService } from 'app/shared/services/report.service';
import { Chance } from 'chance';
import { addDays, format } from 'date-fns';
import { EMPTY, of } from 'rxjs';
import { Mission, MissionInformationDate, MissionModel } from '../mission.model';
import { MissionServiceV2 } from './mission.service';
import { getTranslocoTestingModule } from '@core/utils/transloco-testing.module';

const ENROLLMENT = {
  id: '125',
  status: EnrollmentStatuses.ENROLLED,
  evaluated: true,
} as Enrollment;

const MISSION = {
  id: '123',
  name: 'Mission Detail Dialog',
  description: 'Mission Description',
  mission_category: {
    name: 'Marketing',
  },
  user_creator: {
    avatar: '',
  },
  mission_model: MissionModel.PRESENTIAL,
  presential: {
    address: 'Pokemon Center',
    dates: [
      {
        start_at: '2022-01-01 20:00:00',
        end_at: '2022-01-01 21:00:00',
        is_today: true,
      },
    ],
    seats: 5,
  },
} as Mission;

describe('MissionService', () => {
  let service: MissionServiceV2;
  let konquestApiMock: jest.Mocked<KonquestAPI>;
  let matDialog: jest.Mocked<MatDialog>;
  let reportService: jest.Mocked<ReportService>;
  let matSnackBar: MatSnackBar;
  let aluraIntegrationApiMock: jest.Mocked<AluraIntegrationsApi>;
  const chance = new Chance();

  beforeEach(() => {
    konquestApiMock = {
      get: jest.fn().mockReturnValue(of(EMPTY)),
      delete: jest.fn().mockReturnValue(of(EMPTY)),
    } as unknown as jest.Mocked<KonquestAPI>;
    aluraIntegrationApiMock = {
      deleteCourseByMissionId: jest.fn().mockReturnValue(of(EMPTY)),
    } as unknown as jest.Mocked<AluraIntegrationsApi>;

    TestBed.configureTestingModule({
      imports: [getTranslocoTestingModule()],
      providers: [
        MissionServiceV2,
        { provide: KonquestAPI, useValue: konquestApiMock },
        { provide: KpMessageService, useValue: { error: jest.fn(), success: jest.fn() } },
        { provide: AuthService, useValue: { userId: 'mock_user_id' } },
        {
          provide: ReportService,
          useValue: { generateCourseCertificate: jest.fn(), openCertificate: jest.fn() },
        },
        { provide: MatDialog, useValue: { open: jest.fn() } },
        { provide: FuseLoadingService, useValue: { show: jest.fn() } },
        { provide: AluraIntegrationsApi, useValue: aluraIntegrationApiMock },
        { provide: MatSnackBar, useValue: { openFromComponent: jest.fn(), dismiss: jest.fn() } },
        EvaluationAPI,
        MissionEnrollmentsAPI,
      ],
    });
    service = TestBed.inject(MissionServiceV2);
    matSnackBar = TestBed.inject(MatSnackBar);
    reportService = TestBed.inject(ReportService) as jest.Mocked<ReportService>;

    matDialog = TestBed.inject(MatDialog) as jest.Mocked<MatDialog>;
    matDialog.open.mockReturnValue({ afterClosed: () => of({}) } as MatDialogRef<MissionEvaluationComponent>);
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });

  it('should add is_finished as true if date is before now', () => {
    MISSION.presential.dates[MISSION.presential.dates.length - 1] = {
      id: '',
      allow_self_attendance: false,
      start_at: '2022-01-01 20:00:00',
      end_at: '2022-01-01 21:00:00',
      is_today: false,
    };

    const expectedMission = service.buildExtraMissionAttributes(MISSION);

    expect(expectedMission.presential?.is_finished).toBe(true);
  });

  it('should add is_finished as false if date is after now', () => {
    const tomorrow = addDays(new Date(), 1);
    MISSION.presential.dates[MISSION.presential.dates.length - 1] = {
      id: '',
      allow_self_attendance: false,
      start_at: format(tomorrow, 'yyyy-MM-dd HH:mm:ss'),
      end_at: format(tomorrow, 'yyyy-MM-dd HH:mm:ss'),
      is_today: false,
    };

    const expectedMission = service.buildExtraMissionAttributes(MISSION);

    if (expectedMission) {
      expect(expectedMission.presential?.is_finished).toBe(false);
    }
  });

  it('should generate certificate', (done) => {
    jest.spyOn(matSnackBar, 'openFromComponent');
    jest.spyOn(matSnackBar, 'dismiss');
    reportService.generateCourseCertificate.mockReturnValue(of({ certificate_url: 'www.bulbasaur.com' }));

    const expectedOpenSnack = {
      data: { message: 'GENERAL.LOADING_CERTIFICATE' },
      horizontalPosition: 'center',
      panelClass: ['mat-toolbar', 'bg-white', 'text-black', 'text-base'],
    } as MatSnackBarConfig;

    service.generateCertificate(ENROLLMENT.id).subscribe(() => {
      expect(matSnackBar.openFromComponent).toHaveBeenCalledWith(KpSnackLoadingComponent, expectedOpenSnack);
      expect(matSnackBar.dismiss).toHaveBeenCalled();
      expect(reportService.openCertificate).toHaveBeenCalled();
      done();
    });
  });

  it('should fetch enrollment mission by id', (done) => {
    service.fetchEnrollmentByMissionId('123').subscribe(() => {
      expect(konquestApiMock.get).toHaveBeenCalledWith(`/mission-enrollments/123`);
      done();
    });
  });

  describe('removeMission', () => {
    it('should delete a mission', (done) => {
      const missionId = chance.guid();

      service.removeMission(missionId, false).subscribe(() => {
        expect(konquestApiMock.delete).toHaveBeenCalledWith(`/missions/${missionId}`);
        done();
      });
    });

    it('should delete an integration course by mission id', (done) => {
      const missionId = chance.guid();

      service.removeMission(missionId, true).subscribe(() => {
        expect(aluraIntegrationApiMock.deleteCourseByMissionId).toHaveBeenCalledWith(missionId);
        done();
      });
    });
  });

  describe('markAsPresentToLiveMission', () => {
    const dateId = chance.guid();

    const pastDate: MissionInformationDate = {
      id: chance.guid(),
      start_at: '2020-01-01 10:00:00',
      end_at: '2020-01-01 11:00:00',
    };

    const futureDate: MissionInformationDate = {
      id: chance.guid(),
      start_at: '2030-01-01 10:00:00',
      end_at: '2030-01-01 11:00:00',
    };

    beforeEach(() => {
      konquestApiMock.post = jest.fn().mockReturnValue(of({}));
    });

    it('should call http.post with the date_id of the current event', () => {
      jest.useFakeTimers().setSystemTime(new Date('2026-06-01T10:30:00'));
      const currentDate: MissionInformationDate = {
        id: dateId,
        start_at: '2026-06-01 10:00:00',
        end_at: '2026-06-01 11:00:00',
      };

      service.markAsPresentToLiveMission([currentDate]);

      expect(konquestApiMock.post).toHaveBeenCalledWith('/mission-enrollments/attendances/auto-check', {
        date_id: dateId,
      });
      jest.useRealTimers();
    });

    it('should call http.post with date_id null when now is before all dates', () => {
      service.markAsPresentToLiveMission([futureDate]);

      expect(konquestApiMock.post).toHaveBeenCalledWith('/mission-enrollments/attendances/auto-check', {
        date_id: null,
      });
    });

    it('should call http.post with date_id null when now is after all dates', () => {
      service.markAsPresentToLiveMission([pastDate]);

      expect(konquestApiMock.post).toHaveBeenCalledWith('/mission-enrollments/attendances/auto-check', {
        date_id: null,
      });
    });

    it('should call http.post with date_id null when dates list is empty', () => {
      service.markAsPresentToLiveMission([]);

      expect(konquestApiMock.post).toHaveBeenCalledWith('/mission-enrollments/attendances/auto-check', {
        date_id: null,
      });
    });

    it('should call http.post with date_id null when dates is null', () => {
      service.markAsPresentToLiveMission(null);

      expect(konquestApiMock.post).toHaveBeenCalledWith('/mission-enrollments/attendances/auto-check', {
        date_id: null,
      });
    });
  });

  describe('formatEvaluations', () => {
    const payloadWithResults = { page: 1, size: 2, total: 2 };
    const payloadWithNoResults = { page: 1, size: 0, total: 0 };
    const cases: any[] = [
      [
        {
          ...payloadWithResults,
          results: [
            { id: 1, questions_rating_avg: 4.567 },
            { id: 2, questions_rating_avg: 3.2 },
          ],
        },
        {
          ...payloadWithResults,
          results: [
            { id: 1, questions_rating_avg: '4.6' },
            { id: 2, questions_rating_avg: '3.2' },
          ],
        },
      ],
      [
        {
          ...payloadWithResults,
          results: [
            { id: 1, questions_rating_avg: undefined },
            { id: 2, questions_rating_avg: null },
          ],
        },
        {
          ...payloadWithResults,
          results: [
            { id: 1, questions_rating_avg: 0 },
            { id: 2, questions_rating_avg: 0 },
          ],
        },
      ],
      [
        {
          ...payloadWithNoResults,
          results: [],
        },
        {
          ...payloadWithNoResults,
          results: [],
        },
      ],
      [
        {
          ...payloadWithNoResults,
          results: undefined,
        },
        {
          ...payloadWithNoResults,
          results: undefined,
        },
      ],
    ];

    test.each(cases)('should format the evaluations correctly', (payload, expected) => {
      const result = service.formatEvaluations(payload);
      expect(result).toEqual(expected);
    });
  });
});
