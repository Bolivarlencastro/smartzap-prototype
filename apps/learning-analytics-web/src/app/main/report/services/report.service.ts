import { Injectable, OnDestroy } from '@angular/core';
import { marker } from '@jsverse/transloco-keys-manager/marker';
import {
  AuthService,
  LearnAnalyticsClient,
  UserProfileService,
  WorkspaceService,
} from '@keeps-platform-frontend-workspace/kp-keeps';
import { ReportType } from 'app/main/report/enums/report';
import { Observable, Subject, Subscription } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { SimpleFilterSubject } from '.';
import { LatestReportFilter, LatestReportsFilterSort, LatestReportsResponse } from '../interfaces';
import { Report } from '@core/api/model';
import { KpMessageService } from '@keeps-platform-frontend-workspace/ui/kp-message-service';
import { ReportGenerateResponse } from 'app/main/report/interfaces/report-generate.response';

@Injectable()
export class ReportService implements OnDestroy {
  readonly urlReports: Record<ReportType, string> = {
    [ReportType.ALL_USERS]: `/v1/reports/konquest-all-users-export`,
    [ReportType.GROUP_CHANNEL_USER]: `/v1/reports/konquest-groups-channels-users-export`,
    [ReportType.GROUP_MISSION_USER]: `/v1/reports/konquest-groups-missions-users-export`,
    [ReportType.WORKSPACE_MISSION]: `/v1/reports/konquest-missions-export`,
    [ReportType.MISSION_ENROLLMENTS]: `/v1/reports/konquest-mission-enrollments-export`,
    [ReportType.MISSION_QUIZ]: `/v1/reports/konquest-missions-quizzes-answers-export`,
    [ReportType.MISSION_EVALUATIONS]: `/v1/reports/konquest-missions-evaluations-export`,
    [ReportType.PULSE_CHANNELS]: `/v1/reports/konquest-pulses-channels-export`,
    [ReportType.PULSES_QUIZ]: `/v1/reports/konquest-pulses-quizzes-answers-export`,
    [ReportType.PULSES_ACTIVITIES]: `/v1/reports/konquest-user-pulse-activities-export`,
    [ReportType.USERS_ACCESS]: `/v1/reports/konquest-users-access-by-date-export`,
    [ReportType.WORKSPACE_OVERVIEW]: `/v1/reports/konquest-workspace-presentation`,
    [ReportType.COURSE_OVERVIEW]: `/v1/reports/konquest-course-presentation`,
    [ReportType.USER_OVERVIEW]: `/v1/reports/konquest-user-presentation`,
    [ReportType.USERS_GENERAL_CONSUMPTION]: '/v1/reports/konquest-user-consumptions-export',
    [ReportType.USER_GENERAL_STATISTICS]: '/v1/reports/konquest-user-general-statistics-export',
    [ReportType.MISSION_EVALUATION_ANALYSIS]: '/v1/reports/konquest-mission-evaluations-statistics-export',
    [ReportType.SMARTZAP_COURSE_OVERVIEW]: '/v1/reports/smartzap-course-presentation',
    [ReportType.MISSION_ENROLLMENTS_QUIZZES]: '/v1/reports/konquest-mission-enrollment-quizzes',
    [ReportType.TRAIL_LIST]: '/v1/reports/konquest-trails-export',
    [ReportType.TRAIL_ENROLLMENTS]: '/v1/reports/konquest-trails-enrollments-export',
    [ReportType.TRAIL_CONCLUSION_RATE]: '/v1/reports/konquest-trails-completion-rate-export',
    [ReportType.USER_PERMISSIONS]: '/v1/reports/myaccount-user-permissions-exports',
  };

  private readonly simpleFilterSubject = new Subject<SimpleFilterSubject>();
  private readonly simpleFilter$ = this.simpleFilterSubject.asObservable();
  private subscriptions = new Subscription();

  constructor(
    private _http: LearnAnalyticsClient,
    private _messageService: KpMessageService,
    private _workspaceService: WorkspaceService,
    private _authService: AuthService,
    private _userProfileService: UserProfileService,
  ) {}

  getReport(filter: any): Observable<any> {
    const { reportType }: { reportType: ReportType } = filter;
    const reportPath = this.urlReports[reportType];
    const workspace = this._workspaceService.getCurrentWorkspace();

    let body: any;

    switch (reportType) {
      case ReportType.WORKSPACE_OVERVIEW:
        body = { workspace_id: workspace?.id };
        break;
      case ReportType.USER_OVERVIEW:
        body = { user_id: filter?.objectIds };
        break;
      case ReportType.COURSE_OVERVIEW:
        body = { course_id: filter?.objectIds };
        break;
      case ReportType.MISSION_QUIZ:
        body = { report_format: 'XLSX', filters: { mission__id__in: filter?.objectIds } };
        break;
      case ReportType.MISSION_EVALUATIONS:
        body = { report_format: 'XLSX', filters: { mission_id__in: filter?.objectIds } };
        break;
      case ReportType.PULSES_QUIZ:
        body = { report_format: 'XLSX', filters: { channel__id__in: filter?.objectIds } };
        break;
      case ReportType.SMARTZAP_COURSE_OVERVIEW:
        body = { course_id: filter?.objectIds };
        break;
      case ReportType.MISSION_ENROLLMENTS_QUIZZES:
        body = { ...(filter?.data && { filters: filter.data }) };
        break;
      default:
        body = { report_format: 'XLSX', ...(filter?.data && { filters: filter.data }) };
        break;
    }

    // Adds the leader ID if necessary
    body = this.addLeaderId(reportType, body);

    return this._http.post<ReportGenerateResponse>(reportPath, body).pipe(
      tap({
        next: (response) => this.handleResponse(response),
        error: () => this._messageService.info(marker('REPORT.REPORT_REQUEST_FAILURE')),
      }),
    );
  }

  private handleResponse(response: ReportGenerateResponse) {
    const status = response.status;
    if (status === 'in_process') {
      this._messageService.error('REPORT.REPORT_ALREADY_REQUESTED');
      return;
    }

    this._messageService.info(marker('REPORT.REPORT_REQUEST_SENT'));
  }

  downloadReport(url: string): void {
    if (url) {
      window.open(url, '_blank');
    }
  }

  getLatestReports(filter: LatestReportFilter): Observable<LatestReportsResponse> {
    // Sets the pagination properties on the filter
    const updatedFilter: LatestReportFilter = {
      ...filter,
      per_page: 50,
      sort: LatestReportsFilterSort.CREATION_DATE_DESC,
    };
    return this._http.get<{ data: LatestReportsResponse }>('/v1/reports', updatedFilter).pipe(
      map(({ data }) => {
        const result = data.result.map((report) => this._getUniqueFilters(report));
        return { ...data, result };
      }),
    );
  }

  private _normalizeFilter(filter: string): string {
    const patterns = ['__', '_gte_date', '_lte_date'];
    const matchedPattern = patterns.find((pattern) => filter.includes(pattern));

    return matchedPattern ? filter.split(matchedPattern).slice(0, -1).join(matchedPattern) : filter;
  }

  private _getUniqueFilters(report: Report): Report {
    const maxFilters = 6;
    const filterKeys = Object.keys(report.filters);
    const uniqueFilters = [...new Set(filterKeys.map((key) => this._normalizeFilter(key)))];

    if (
      report.report_type.description === 'konquest missions enrollments export' &&
      uniqueFilters.includes('created_date')
    ) {
      uniqueFilters[uniqueFilters.indexOf('created_date')] = 'enrollment_date';
    }

    return {
      ...report,
      filters: uniqueFilters.slice(0, maxFilters),
      excess_filters_length: uniqueFilters.length - maxFilters,
    };
  }

  ngOnDestroy() {
    this.simpleFilterSubject.unsubscribe();
    this.subscriptions.unsubscribe();
  }

  private addLeaderId(reportType: ReportType, reportBody: any): any {
    const userIsOnlyLeader = this._userProfileService.isAnalyticsLeader();

    const filterKeyMap: Record<string, string> = {
      [ReportType.USER_GENERAL_STATISTICS]: 'related_user_leader_id__in',
      [ReportType.USERS_GENERAL_CONSUMPTION]: 'user__related_user_leader_id__in',
      [ReportType.MISSION_ENROLLMENTS]: 'user__related_user_leader_id__in',
    };

    if (userIsOnlyLeader && filterKeyMap[reportType]) {
      return {
        ...reportBody,
        filters: { ...reportBody.filters, [filterKeyMap[reportType]]: [this._authService.userId] },
      };
    }

    return reportBody;
  }
}
