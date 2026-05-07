import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { UserProfileService } from '@keeps-platform-frontend-workspace/kp-keeps';
import { marker } from '@jsverse/transloco-keys-manager/marker';
import { Store } from '@ngrx/store';
import {
  pdfReports,
  xlsxMissionReports,
  xlsxPulsesReports,
  xlsxTrailReports,
  xlsxUserReports,
} from 'app/shared/model/konquest-reports';

import { ReportType } from '../../enums/report';
import { FilterDialogData, ReportListType, ReportTopics } from '../../interfaces';
import { ReportActions, ReportFiltersActions } from '../../store/actions';
import { ReportModalComponent } from '../report-modal/report-modal.component';
import { ReportsDashboardComponent } from '../../components/reports-dashboard/reports-dashboard.component';

@Component({
  selector: 'app-konquest-reports-tab',
  template: `
    <app-reports-dashboard [reports]="reports" (reportSelected)="onSelectReport($event)"></app-reports-dashboard>
  `,
  imports: [ReportsDashboardComponent],
})
export class KonquestReportsTabComponent implements OnInit {
  reports!: ReportTopics;

  private userIsOnlyLeader!: boolean;

  constructor(
    private store: Store,
    private _dialog: MatDialog,
    private _userProfileService: UserProfileService,
  ) {}

  /**
   * Builds the reports topics object based on the user's roles.
   * @param onlyLeaderReports Whether should return only the reports a team leader has access.
   * @private
   */
  static buildReportsTopics(onlyLeaderReports: boolean): ReportTopics {
    const leaderReports: ReportType[] = [
      ReportType.USER_OVERVIEW,
      ReportType.MISSION_ENROLLMENTS,
      ReportType.USER_GENERAL_STATISTICS,
      ReportType.USERS_GENERAL_CONSUMPTION,
    ];

    if (onlyLeaderReports) {
      return {
        pdf: pdfReports.filter((report) => leaderReports.includes(report.reportType)),
        missions: xlsxMissionReports.filter((report) => leaderReports.includes(report.reportType)),
        pulses: null,
        users: xlsxUserReports.filter((report) => leaderReports.includes(report.reportType)),
      };
    }

    return {
      users: xlsxUserReports,
      missions: xlsxMissionReports,
      trails: xlsxTrailReports,
      pulses: xlsxPulsesReports,
      pdf: pdfReports,
    };
  }

  ngOnInit(): void {
    this.userIsOnlyLeader = this._userProfileService.isAnalyticsLeader();
    this.reports = KonquestReportsTabComponent.buildReportsTopics(this.userIsOnlyLeader);
  }

  onSelectReport({ reportType }: ReportListType) {
    switch (reportType) {
      case ReportType.WORKSPACE_MISSION:
      case ReportType.MISSION_ENROLLMENTS:
      case ReportType.MISSION_ENROLLMENTS_QUIZZES:
      case ReportType.TRAIL_ENROLLMENTS:
      case ReportType.TRAIL_LIST:
      case ReportType.TRAIL_CONCLUSION_RATE:
      case ReportType.ALL_USERS:
      case ReportType.USERS_ACCESS:
        this.openReportFilterDialogV2(reportType);
        break;
      case ReportType.USER_OVERVIEW:
      case ReportType.COURSE_OVERVIEW:
      case ReportType.MISSION_QUIZ:
      case ReportType.PULSES_QUIZ:
      case ReportType.MISSION_EVALUATIONS:
        this.openFilterDialog(reportType);
        break;
      default:
        this.getReport(reportType);
    }
  }

  private openFilterDialog(reportType: ReportType): void {
    const subtitleMap: Partial<Record<ReportType, string>> = {
      PULSES_QUIZ: marker('REPORTS.KONQUEST_TAB.PULSES_QUIZ_SUBTITLE'),
      MISSION_QUIZ: marker('REPORTS.KONQUEST_TAB.MISSION_QUIZ_SUBTITLE'),
      MISSION_EVALUATIONS: marker('REPORTS.KONQUEST_TAB.MISSION_EVALUATIONS_SUBTITLE'),
      USER_OVERVIEW: marker('REPORTS.KONQUEST_TAB.FILTER_USERS_SUBTITLE'),
      COURSE_OVERVIEW: marker('REPORTS.KONQUEST_TAB.FILTER_MISSIONS_SUBTITLE'),
    };

    const columnTitleMap: Partial<Record<ReportType, string>> = {
      PULSES_QUIZ: marker('GENERAL.CHANNEL'),
      MISSION_QUIZ: marker('GENERAL.MISSION'),
      MISSION_EVALUATIONS: marker('GENERAL.MISSION'),
      USER_OVERVIEW: marker('GENERAL.USER'),
      COURSE_OVERVIEW: marker('GENERAL.MISSION'),
    };

    const selectionLabelMap: Partial<Record<ReportType, string>> = {
      PULSES_QUIZ: 'REPORT_MODAL.SELECTION_LABEL.CHANNEL',
      MISSION_QUIZ: 'REPORT_MODAL.SELECTION_LABEL.MISSION',
      MISSION_EVALUATIONS: 'REPORT_MODAL.SELECTION_LABEL.MISSION',
      USER_OVERVIEW: 'REPORT_MODAL.SELECTION_LABEL.USER',
      COURSE_OVERVIEW: 'REPORT_MODAL.SELECTION_LABEL.MISSION',
    };

    const subtitleTranslation = subtitleMap[reportType];
    const columnTitleTranslation = columnTitleMap[reportType];
    const selectionLabelTranslation = selectionLabelMap[reportType];

    if (subtitleTranslation && columnTitleTranslation) {
      const dialogData: FilterDialogData = {
        reportType,
        title: 'REPORT.' + reportType,
        subtitle: subtitleTranslation,
        columnTitle: columnTitleTranslation,
        selectionLabel: selectionLabelTranslation,
      };

      this._dialog.open(ReportModalComponent, {
        width: '500px',
        autoFocus: false,
        data: dialogData,
        disableClose: true,
      });
    }
  }

  private openReportFilterDialogV2(reportType: ReportType) {
    this.store.dispatch(ReportFiltersActions.openDialog({ reportType }));
  }

  private getReport(reportType: ReportType) {
    this.store.dispatch(ReportActions.getReport({ filter: { reportType } }));
  }
}
