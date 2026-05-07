import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { marker } from '@jsverse/transloco-keys-manager/marker';
import { AnalyticsReportContext, ReportListType, ReportTopics } from '../../interfaces';
import { NgClass, NgTemplateOutlet } from '@angular/common';
import { MatIcon } from '@angular/material/icon';
import { MatDivider } from '@angular/material/divider';
import { ReportCardComponent } from '../report-card/report-card.component';
import { TranslocoPipe } from '@jsverse/transloco';

@Component({
  selector: 'app-reports-dashboard',
  templateUrl: './reports-dashboard.component.html',
  imports: [NgTemplateOutlet, MatIcon, MatDivider, NgClass, ReportCardComponent, TranslocoPipe],
})
export class ReportsDashboardComponent implements OnInit {
  @Input() reports!: ReportTopics;
  @Output() reportSelected = new EventEmitter<ReportListType>();

  pdfContext!: AnalyticsReportContext;
  usersContext!: AnalyticsReportContext;
  missionsContext!: AnalyticsReportContext;
  pulsesContext!: AnalyticsReportContext;
  trailsContext!: AnalyticsReportContext;

  ngOnInit(): void {
    this.pdfContext = {
      items: this.reports?.pdf ?? [],
      cols: 'grid-cols-4',
      colored: true,
    };
    this.usersContext = {
      items: this.reports?.users ?? [],
      cols: 'grid-cols-5',
      title: marker('GENERAL.USERS'),
      icon: 'people_black',
    };
    this.trailsContext = {
      items: this.reports?.trails ?? [],
      cols: 'grid-cols-3',
      title: marker('GENERAL.TRAILS'),
      icon: 'learning-trail',
    };
    this.missionsContext = {
      items: this.reports?.missions ?? [],
      cols: 'grid-cols-6',
      title: marker('GENERAL.MISSIONS'),
      icon: 'mission',
    };
    this.pulsesContext = {
      items: this.reports?.pulses ?? [],
      cols: 'grid-cols-4',
      title: marker('GENERAL.PULSES'),
      icon: 'pulse',
    };
  }

  onSelectReport(report: ReportListType) {
    this.reportSelected.emit(report);
  }
}
