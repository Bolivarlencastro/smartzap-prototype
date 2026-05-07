import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { Report } from '@core/api/model';
import { ChatbotDialogData, UserProfileService } from '@keeps-platform-frontend-workspace/kp-keeps';
import { Store } from '@ngrx/store';
import { Observable, Subscription, timer } from 'rxjs';
import { tap } from 'rxjs/operators';
import { LatestReportFilter } from '../../interfaces';
import { LatestReportActions } from '../../store/actions';
import { LatestReportListSelectors } from '../../store/selectors';
import { LatestReportService } from '../../services/latest-report.service';
import { LatestReportsFilterComponent } from '../../components/latest-reports-filter/latest-reports-filter.component';
import { LatestReportCollectionComponent } from '../../components/latest-report-collection/latest-report-collection.component';
import { AsyncPipe } from '@angular/common';
import { MatIcon } from '@angular/material/icon';
import { TranslocoPipe } from '@jsverse/transloco';
import { KpTableLayoutComponent } from '@keeps-platform-frontend-workspace/ui/kp-table-layout';

const THREE_MINUTES = 180000;

@Component({
  selector: 'app-latest-report-tab',
  template: `
    <kp-table-layout [hidePaginator]="true" (searchChange)="applySearch($event)">
      <div kpTableFilterAfter>
        <latest-reports-filter [showCreatorInput]="false" (filterChange)="filterChange($event)"></latest-reports-filter>
      </div>
      <div kpTable>
        <div class="flex items-center mx-4 my-3">
          <mat-icon class="mr-2 s-4" style="color: #ff724f">error</mat-icon>
          <span>{{ 'REPORT.WARNING-MESSAGE' | transloco }}</span>
        </div>
        <app-latest-report-collection
          [latestReportResults]="latestReportResults$ | async"
          [isLoading]="isLoading$ | async"
          (loadMoreItems)="loadMoreItems()"
          (openChatbot)="openChatbotDialog($event)"
        ></app-latest-report-collection>
      </div>
    </kp-table-layout>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    LatestReportsFilterComponent,
    LatestReportCollectionComponent,
    KpTableLayoutComponent,
    AsyncPipe,
    MatIcon,
    TranslocoPipe,
  ],
})
export class LatestReportTabComponent implements OnInit, OnDestroy {
  latestReportResults$: Observable<Report[]>;
  isLoading$: Observable<boolean>;
  timerSub$!: Subscription;
  userIsOnlyLeader: boolean;

  private searchTerm = '';
  private lastFilter: LatestReportFilter = { page: 1 };

  constructor(
    private store: Store,
    private latestReport: LatestReportService,
    _userProfileService: UserProfileService,
  ) {
    this.latestReportResults$ = this.store.select(LatestReportListSelectors.selectLatestReports);
    this.isLoading$ = this.store.select(LatestReportListSelectors.selectIsLoading);
    this.userIsOnlyLeader = _userProfileService.isAnalyticsLeader();
  }

  ngOnInit(): void {
    this.timerSub$ = timer(1000, THREE_MINUTES)
      .pipe(tap(() => this.refreshResults()))
      .subscribe();
  }

  ngOnDestroy() {
    this.timerSub$.unsubscribe();
  }

  filterChange(filter: LatestReportFilter): void {
    this.lastFilter = filter;
    this.dispatchFilter();
  }

  applySearch(term: string): void {
    this.searchTerm = term;
    this.dispatchFilter();
  }

  loadMoreItems(): void {
    this.store.dispatch(LatestReportActions.loadMoreItemsReport());
  }

  refreshResults(): void {
    this.store.dispatch(LatestReportActions.refreshResult());
  }

  openChatbotDialog(data: ChatbotDialogData) {
    this.store.dispatch(LatestReportActions.openChatbotDialog({ data }));
  }

  private dispatchFilter(): void {
    const merged: LatestReportFilter = {
      ...this.lastFilter,
      ...(!!this.searchTerm && { user_creator_name__ilike: this.searchTerm }),
    };
    this.store.dispatch(LatestReportActions.loadLatestReports({ filter: this.latestReport.updateFilter(merged) }));
  }
}
