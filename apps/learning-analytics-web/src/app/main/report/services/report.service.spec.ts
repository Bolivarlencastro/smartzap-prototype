import {
  AuthService,
  LearnAnalyticsClient,
  UserProfileService,
  WorkspaceService,
} from '@keeps-platform-frontend-workspace/kp-keeps';
import { KpMessageService } from '@keeps-platform-frontend-workspace/ui/kp-message-service';
import { of, throwError } from 'rxjs';
import { ReportType } from 'app/main/report/enums/report';
import { LatestReportFilter, LatestReportsFilterSort } from '../interfaces';
import { ReportService } from './report.service';

describe('ReportService', () => {
  let service: ReportService;
  let httpMock: jest.Mocked<LearnAnalyticsClient>;
  let messageServiceMock: jest.Mocked<KpMessageService>;
  let workspaceServiceMock: jest.Mocked<WorkspaceService>;
  let authServiceMock: jest.Mocked<AuthService>;
  let userProfileServiceMock: jest.Mocked<UserProfileService>;

  beforeEach(() => {
    httpMock = { post: jest.fn(), get: jest.fn() } as unknown as jest.Mocked<LearnAnalyticsClient>;
    messageServiceMock = { info: jest.fn(), error: jest.fn() } as unknown as jest.Mocked<KpMessageService>;
    workspaceServiceMock = {
      getCurrentWorkspace: jest.fn(() => ({ id: 'mock_workspace_id' })),
    } as unknown as jest.Mocked<WorkspaceService>;
    authServiceMock = { userId: 'mock_user_id' } as unknown as jest.Mocked<AuthService>;
    userProfileServiceMock = {
      isAnalyticsLeader: jest.fn(() => false),
    } as unknown as jest.Mocked<UserProfileService>;

    service = new ReportService(
      httpMock,
      messageServiceMock,
      workspaceServiceMock,
      authServiceMock,
      userProfileServiceMock,
    );
  });

  describe('getReport', () => {
    const mockResponse = { status: 'ok', report: {} };

    beforeEach(() => {
      httpMock.post.mockReturnValue(of(mockResponse));
    });

    it('should call correct URL and body for WORKSPACE_OVERVIEW', (done) => {
      service.getReport({ reportType: ReportType.WORKSPACE_OVERVIEW }).subscribe(() => {
        expect(httpMock.post).toHaveBeenCalledWith('/v1/reports/konquest-workspace-presentation', {
          workspace_id: 'mock_workspace_id',
        });
        done();
      });
    });

    it('should call correct URL and body for USER_OVERVIEW', (done) => {
      service.getReport({ reportType: ReportType.USER_OVERVIEW, objectIds: ['user_1'] }).subscribe(() => {
        expect(httpMock.post).toHaveBeenCalledWith('/v1/reports/konquest-user-presentation', { user_id: ['user_1'] });
        done();
      });
    });

    it('should call correct URL and body for COURSE_OVERVIEW', (done) => {
      service.getReport({ reportType: ReportType.COURSE_OVERVIEW, objectIds: ['course_1'] }).subscribe(() => {
        expect(httpMock.post).toHaveBeenCalledWith('/v1/reports/konquest-course-presentation', {
          course_id: ['course_1'],
        });
        done();
      });
    });

    it('should call correct URL and body for MISSION_QUIZ', (done) => {
      service.getReport({ reportType: ReportType.MISSION_QUIZ, objectIds: ['mission_1'] }).subscribe(() => {
        expect(httpMock.post).toHaveBeenCalledWith('/v1/reports/konquest-missions-quizzes-answers-export', {
          report_format: 'XLSX',
          filters: { mission__id__in: ['mission_1'] },
        });
        done();
      });
    });

    it('should call correct URL and body for MISSION_EVALUATIONS', (done) => {
      service.getReport({ reportType: ReportType.MISSION_EVALUATIONS, objectIds: ['mission_1'] }).subscribe(() => {
        expect(httpMock.post).toHaveBeenCalledWith('/v1/reports/konquest-missions-evaluations-export', {
          report_format: 'XLSX',
          filters: { mission_id__in: ['mission_1'] },
        });
        done();
      });
    });

    it('should call correct URL and body for PULSES_QUIZ', (done) => {
      service.getReport({ reportType: ReportType.PULSES_QUIZ, objectIds: ['channel_1'] }).subscribe(() => {
        expect(httpMock.post).toHaveBeenCalledWith('/v1/reports/konquest-pulses-quizzes-answers-export', {
          report_format: 'XLSX',
          filters: { channel__id__in: ['channel_1'] },
        });
        done();
      });
    });

    it('should call correct URL and body for SMARTZAP_COURSE_OVERVIEW', (done) => {
      service.getReport({ reportType: ReportType.SMARTZAP_COURSE_OVERVIEW, objectIds: ['course_1'] }).subscribe(() => {
        expect(httpMock.post).toHaveBeenCalledWith('/v1/reports/smartzap-course-presentation', {
          course_id: ['course_1'],
        });
        done();
      });
    });

    it('should include filters in body for MISSION_ENROLLMENTS_QUIZZES when filter.data is provided', (done) => {
      service
        .getReport({ reportType: ReportType.MISSION_ENROLLMENTS_QUIZZES, data: { some_key: 'val' } })
        .subscribe(() => {
          expect(httpMock.post).toHaveBeenCalledWith('/v1/reports/konquest-mission-enrollment-quizzes', {
            filters: { some_key: 'val' },
          });
          done();
        });
    });

    it('should send empty body for MISSION_ENROLLMENTS_QUIZZES when filter.data is not provided', (done) => {
      service.getReport({ reportType: ReportType.MISSION_ENROLLMENTS_QUIZZES }).subscribe(() => {
        expect(httpMock.post).toHaveBeenCalledWith('/v1/reports/konquest-mission-enrollment-quizzes', {});
        done();
      });
    });

    it('should include filters in body for default case when filter.data is provided', (done) => {
      service.getReport({ reportType: ReportType.ALL_USERS, data: { some_key: 'val' } }).subscribe(() => {
        expect(httpMock.post).toHaveBeenCalledWith('/v1/reports/konquest-all-users-export', {
          report_format: 'XLSX',
          filters: { some_key: 'val' },
        });
        done();
      });
    });

    it('should send only report_format for default case when filter.data is not provided', (done) => {
      service.getReport({ reportType: ReportType.ALL_USERS }).subscribe(() => {
        expect(httpMock.post).toHaveBeenCalledWith('/v1/reports/konquest-all-users-export', { report_format: 'XLSX' });
        done();
      });
    });

    describe('response handling', () => {
      it('should call messageService.error when response status is in_process', (done) => {
        httpMock.post.mockReturnValue(of({ status: 'in_process', report: {} }));

        service.getReport({ reportType: ReportType.ALL_USERS }).subscribe(() => {
          expect(messageServiceMock.error).toHaveBeenCalledWith('REPORT.REPORT_ALREADY_REQUESTED');
          expect(messageServiceMock.info).not.toHaveBeenCalled();
          done();
        });
      });

      it('should call messageService.info with sent key when response status is not in_process', (done) => {
        httpMock.post.mockReturnValue(of({ status: 'ok', report: {} }));

        service.getReport({ reportType: ReportType.ALL_USERS }).subscribe(() => {
          expect(messageServiceMock.info).toHaveBeenCalledWith('REPORT.REPORT_REQUEST_SENT');
          expect(messageServiceMock.error).not.toHaveBeenCalled();
          done();
        });
      });

      it('should call messageService.info with failure key on error', (done) => {
        httpMock.post.mockReturnValue(throwError(() => new Error('server error')));

        service.getReport({ reportType: ReportType.ALL_USERS }).subscribe({
          error: () => {
            expect(messageServiceMock.info).toHaveBeenCalledWith('REPORT.REPORT_REQUEST_FAILURE');
            done();
          },
        });
      });
    });
  });

  describe('downloadReport', () => {
    let windowOpenSpy: jest.SpyInstance;

    beforeEach(() => {
      windowOpenSpy = jest.spyOn(window, 'open').mockImplementation(() => null);
    });

    afterEach(() => {
      windowOpenSpy.mockRestore();
    });

    it('should call window.open with the URL when URL is provided', () => {
      service.downloadReport('https://example.com/report.xlsx');

      expect(windowOpenSpy).toHaveBeenCalledWith('https://example.com/report.xlsx', '_blank');
    });

    it('should NOT call window.open when URL is empty', () => {
      service.downloadReport('');

      expect(windowOpenSpy).not.toHaveBeenCalled();
    });

    it('should NOT call window.open when URL is falsy', () => {
      service.downloadReport(null as any);

      expect(windowOpenSpy).not.toHaveBeenCalled();
    });
  });

  describe('getLatestReports', () => {
    const makeReport = (filters: Record<string, any>, description = 'some report') => ({
      id: 'report_1',
      created: '2024-01-01',
      days_left: 5,
      file_format: 'XLSX',
      filters,
      language: 'pt-BR',
      object_id: 'obj_1',
      processing_time: 100,
      report_type: {
        application: 'app',
        created: '',
        description,
        id: 'rt_1',
        model: 'model',
        name: 'name',
        updated: '',
      },
      status: 'COMPLETED',
      updated: '2024-01-02',
      url: 'https://example.com/file.xlsx',
      user_creator: { email: 'user@test.com', id: 'u1', name: 'User' },
      user_creator_id: 'u1',
    });

    beforeEach(() => {
      httpMock.get.mockReturnValue(of({ data: { result: [], total_pages: 1 } }));
    });

    it('should call httpMock.get with /v1/reports including per_page and sort defaults', (done) => {
      const filter: LatestReportFilter = { page: 1 };

      service.getLatestReports(filter).subscribe(() => {
        expect(httpMock.get).toHaveBeenCalledWith('/v1/reports', {
          page: 1,
          per_page: 50,
          sort: LatestReportsFilterSort.CREATION_DATE_DESC,
        });
        done();
      });
    });

    it('should return the mapped response with normalized and deduplicated filters', (done) => {
      // created__gte and created__lte both normalize to 'created'; Set deduplicates → ['created']
      const report = makeReport({ created__gte: '2024-01-01', created__lte: '2024-01-31' });
      httpMock.get.mockReturnValue(of({ data: { result: [report], total_pages: 1 } }));

      service.getLatestReports({}).subscribe((response) => {
        expect(response.result[0].filters).toEqual(['created']);
        done();
      });
    });

    describe('filter normalization', () => {
      it('should normalize keys with __ by keeping prefix before last __', (done) => {
        const report = makeReport({ some__nested__key__gte: 'val' });
        httpMock.get.mockReturnValue(of({ data: { result: [report], total_pages: 1 } }));

        service.getLatestReports({}).subscribe((response) => {
          expect(response.result[0].filters).toContain('some__nested__key');
          done();
        });
      });

      it('should normalize keys with _gte_date suffix', (done) => {
        const report = makeReport({ activity_gte_date: 'val' });
        httpMock.get.mockReturnValue(of({ data: { result: [report], total_pages: 1 } }));

        service.getLatestReports({}).subscribe((response) => {
          expect(response.result[0].filters).toContain('activity');
          done();
        });
      });

      it('should normalize keys with _lte_date suffix', (done) => {
        const report = makeReport({ activity_lte_date: 'val' });
        httpMock.get.mockReturnValue(of({ data: { result: [report], total_pages: 1 } }));

        service.getLatestReports({}).subscribe((response) => {
          expect(response.result[0].filters).toContain('activity');
          done();
        });
      });

      it('should keep keys with no separator pattern as-is', (done) => {
        const report = makeReport({ status: 'COMPLETED' });
        httpMock.get.mockReturnValue(of({ data: { result: [report], total_pages: 1 } }));

        service.getLatestReports({}).subscribe((response) => {
          expect(response.result[0].filters).toContain('status');
          done();
        });
      });

      it('should deduplicate normalized filter keys', (done) => {
        const report = makeReport({ created__gte: 'a', created__lte: 'b' });
        httpMock.get.mockReturnValue(of({ data: { result: [report], total_pages: 1 } }));

        service.getLatestReports({}).subscribe((response) => {
          const filters = response.result[0].filters as string[];
          // 'created__gte' and 'created__lte' both normalize to 'created'
          // but deduplication is via Set, so there should be only 1
          expect(filters.filter((f) => f === 'created').length).toBe(1);
          done();
        });
      });

      it('should limit to 6 filters and set excess_filters_length for reports with more than 6 unique filters', (done) => {
        const manyFilters = {
          key1__gte: 'a',
          key2__gte: 'b',
          key3__gte: 'c',
          key4__gte: 'd',
          key5__gte: 'e',
          key6__gte: 'f',
          key7__gte: 'g',
          key8__gte: 'h',
        };
        const report = makeReport(manyFilters);
        httpMock.get.mockReturnValue(of({ data: { result: [report], total_pages: 1 } }));

        service.getLatestReports({}).subscribe((response) => {
          const mapped = response.result[0];
          expect((mapped.filters as string[]).length).toBe(6);
          expect(mapped.excess_filters_length).toBe(2);
          done();
        });
      });

      it('should rename created_date to enrollment_date for konquest missions enrollments export', (done) => {
        const report = makeReport({ created_date: 'val' }, 'konquest missions enrollments export');
        httpMock.get.mockReturnValue(of({ data: { result: [report], total_pages: 1 } }));

        service.getLatestReports({}).subscribe((response) => {
          expect(response.result[0].filters).toContain('enrollment_date');
          expect(response.result[0].filters).not.toContain('created_date');
          done();
        });
      });

      it('should NOT rename created_date for other report types', (done) => {
        const report = makeReport({ created_date: 'val' }, 'some other report');
        httpMock.get.mockReturnValue(of({ data: { result: [report], total_pages: 1 } }));

        service.getLatestReports({}).subscribe((response) => {
          expect(response.result[0].filters).toContain('created_date');
          expect(response.result[0].filters).not.toContain('enrollment_date');
          done();
        });
      });
    });
  });

  describe('addLeaderId (tested via getReport)', () => {
    beforeEach(() => {
      httpMock.post.mockReturnValue(of({ status: 'ok', report: {} }));
      userProfileServiceMock.isAnalyticsLeader.mockReturnValue(true);
    });

    it('should add related_user_leader_id__in filter for USER_GENERAL_STATISTICS when user is analytics leader', (done) => {
      service.getReport({ reportType: ReportType.USER_GENERAL_STATISTICS }).subscribe(() => {
        expect(httpMock.post).toHaveBeenCalledWith(
          expect.any(String),
          expect.objectContaining({
            filters: expect.objectContaining({ related_user_leader_id__in: ['mock_user_id'] }),
          }),
        );
        done();
      });
    });

    it('should add user__related_user_leader_id__in filter for USERS_GENERAL_CONSUMPTION when user is analytics leader', (done) => {
      service.getReport({ reportType: ReportType.USERS_GENERAL_CONSUMPTION }).subscribe(() => {
        expect(httpMock.post).toHaveBeenCalledWith(
          expect.any(String),
          expect.objectContaining({
            filters: expect.objectContaining({ user__related_user_leader_id__in: ['mock_user_id'] }),
          }),
        );
        done();
      });
    });

    it('should add user__related_user_leader_id__in filter for MISSION_ENROLLMENTS when user is analytics leader', (done) => {
      service.getReport({ reportType: ReportType.MISSION_ENROLLMENTS }).subscribe(() => {
        expect(httpMock.post).toHaveBeenCalledWith(
          expect.any(String),
          expect.objectContaining({
            filters: expect.objectContaining({ user__related_user_leader_id__in: ['mock_user_id'] }),
          }),
        );
        done();
      });
    });

    it('should NOT add leader filter when user is NOT an analytics leader', (done) => {
      userProfileServiceMock.isAnalyticsLeader.mockReturnValue(false);

      service.getReport({ reportType: ReportType.USER_GENERAL_STATISTICS }).subscribe(() => {
        const callArgs = httpMock.post.mock.calls[0][1] as any;
        expect(callArgs?.filters?.related_user_leader_id__in).toBeUndefined();
        done();
      });
    });

    it('should NOT add leader filter for report types not in filterKeyMap even when user is analytics leader', (done) => {
      service.getReport({ reportType: ReportType.ALL_USERS }).subscribe(() => {
        const callArgs = httpMock.post.mock.calls[0][1] as any;
        expect(callArgs?.filters?.related_user_leader_id__in).toBeUndefined();
        expect(callArgs?.filters?.user__related_user_leader_id__in).toBeUndefined();
        done();
      });
    });
  });

  describe('ngOnDestroy', () => {
    it('should unsubscribe from subscriptions on destroy', () => {
      const unsubscribeSpy = jest.spyOn((service as any).subscriptions, 'unsubscribe');
      const subjectUnsubscribeSpy = jest.spyOn((service as any).simpleFilterSubject, 'unsubscribe');

      service.ngOnDestroy();

      expect(unsubscribeSpy).toHaveBeenCalled();
      expect(subjectUnsubscribeSpy).toHaveBeenCalled();
    });
  });
});
