import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { marker } from '@jsverse/transloco-keys-manager/marker';
import { Store } from '@ngrx/store';
import { pdfReports } from 'app/shared/model/smartzap-reports';
import { ReportType } from '../../enums/report';
import { FilterDialogData, ReportListType, ReportTopics } from '../../interfaces';
import { ReportActions } from '../../store/actions';
import { ReportModalComponent } from '../report-modal/report-modal.component';
import { ReportsDashboardComponent } from '../../components/reports-dashboard/reports-dashboard.component';

@Component({
  selector: 'app-smart-zap-reports-tab',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-reports-dashboard [reports]="reports" (reportSelected)="onSelectReport($event)"></app-reports-dashboard>
  `,
  imports: [ReportsDashboardComponent],
})
export class SmartZapReportsTabComponent implements OnInit {
  reports!: ReportTopics;

  constructor(
    private store: Store,
    private _dialog: MatDialog,
  ) {}

  /**
   * Builds the reports topics object based on the user's roles.
   * @private
   */
  static buildReportsTopics(): ReportTopics {
    return {
      pdf: pdfReports,
    };
  }

  ngOnInit(): void {
    this.reports = SmartZapReportsTabComponent.buildReportsTopics();
  }

  onSelectReport({ reportType }: ReportListType) {
    const dialogData: FilterDialogData = {
      reportType,
      title: 'REPORT.' + reportType,
      subtitle: marker('REPORTS.SMARTZAP_TAB.FILTER_COURSES_SUBTITLE'),
      columnTitle: marker('GENERAL.COURSE'),
      selectionLabel: 'REPORT_MODAL.SELECTION_LABEL.COURSE',
    };

    if (reportType === ReportType.SMARTZAP_COURSE_OVERVIEW) {
      this._dialog.open(ReportModalComponent, {
        width: '500px',
        autoFocus: false,
        data: dialogData,
        disableClose: true,
      });
      return;
    }

    this.store.dispatch(ReportActions.getReport({ filter: { reportType } }));
  }
}
