import { BreakpointObserver } from '@angular/cdk/layout';

import { ChangeDetectionStrategy, Component, OnDestroy, Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { TranslocoModule } from '@jsverse/transloco';
import {
  GamificationListConfig,
  GamificationListType,
  GamificationViewModel,
  KpDateRange,
} from '@keeps-platform-frontend-workspace/kp-keeps';
import { constants } from '@keeps-platform-frontend-workspace/ui/constants';
import { KpTableLayoutComponent } from '@keeps-platform-frontend-workspace/ui/kp-table-layout';
import { KpDateRangeFilterComponent } from '@keeps-platform-frontend-workspace/ui/kp-date-range-filter';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDividerModule } from '@angular/material/divider';
import { PageEvent } from '@angular/material/paginator';
import { Store } from '@ngrx/store';
import { map } from 'rxjs';
import { GamificationListComponent } from '../../components/gamification-list/gamification-list.component';
import { GamificationListActions, gamificationListFeature } from '../../store';
import { getTranslocoScope } from '../../util';
import { GamificationHelper } from '../../util/gamification.helper';

@Component({
  selector: 'kp-gamification',
  template: `
    <div class="flex items-center gap-2.5 px-4 xxs:px-6 w-full h-20 xxs:h-32 bg-default">
      <span class="text-2xl font-semibold">{{ config?.headerTitle | transloco }}</span>
      @if (!!config?.headerIconTooltip && !isMobile()) {
        <mat-icon class="s-6 filled" [matTooltip]="config?.headerIconTooltip | transloco" matTooltipPosition="right"
          >help</mat-icon
        >
      }
    </div>
    <mat-divider></mat-divider>
    <kp-table-layout
      class="grow"
      [hidePaginator]="isMobile()"
      [totalItems]="vm().pagination.totalItems"
      [pageIndex]="vm().pagination.currentPage"
      [pageSize]="vm().pagination.perPage"
      (pageChange)="onPageChange($event)"
      (searchChange)="filterByTerm($event)"
    >
      @if (!isMobile()) {
        <div kpTableFilterAfter class="flex items-center gap-2 pr-5">
          <span class="text-xs">{{ 'GAMIFICATION.GENERAL.FILTER_BY' | transloco }}</span>
          <kp-date-range-filter
            [label]="'GAMIFICATION.GENERAL.PERIOD' | transloco"
            [currentDateRange]="vm().currentDateRange"
            icon="today"
            (dateRangeEvent)="filterByDateRange($event)"
            (cleanDateRange)="cleanDateRangeFilter()"
          ></kp-date-range-filter>
        </div>
      }
      <kp-gamification-list
        kpTable
        [vm]="vm()"
        [path]="path"
        [isMobile]="isMobile()"
        [currentDateRange]="vm().currentDateRange"
        (dateRangeEvent)="filterByDateRange($event)"
        (cleanDateRange)="cleanDateRangeFilter()"
        (cleanFilterEvent)="cleanFilter()"
      ></kp-gamification-list>
    </kp-table-layout>
  `,
  styles: [
    `
      :host {
        height: 100%;
        display: flex;
        flex-direction: column;
        overflow: hidden;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [getTranslocoScope()],
  imports: [
    TranslocoModule,
    MatIconModule,
    MatTooltipModule,
    MatDividerModule,
    KpTableLayoutComponent,
    KpDateRangeFilterComponent,
    GamificationListComponent,
  ],
})
export class GamificationComponent implements OnDestroy {
  protected readonly path: GamificationListType;
  protected readonly config: GamificationListConfig;
  protected readonly vm: Signal<GamificationViewModel>;
  protected readonly isMobile: Signal<boolean>;

  constructor(
    private readonly store: Store,
    private readonly _route: ActivatedRoute,
    private readonly _breakpointObserver: BreakpointObserver,
  ) {
    this.path = _route.snapshot.url[0].path as GamificationListType;
    this.config = GamificationHelper.buildHeaderTitle(this.path);
    this.vm = toSignal(store.select(gamificationListFeature.selectViewModel));
    this.isMobile = toSignal(
      this._breakpointObserver
        .observe([`(max-width: ${constants.defaultMobileWidth})`])
        .pipe(map((result) => result.matches)),
    );

    store.dispatch(GamificationListActions.init({ path: this.path, isMobile: this.isMobile() }));
  }

  ngOnDestroy(): void {
    this.store.dispatch(GamificationListActions.resetState());
  }

  filterByTerm(search: string): void {
    this.store.dispatch(GamificationListActions.filterByTerm({ search }));
  }

  onPageChange(event: PageEvent): void {
    this.store.dispatch(
      GamificationListActions.setPagination({
        pagination: { currentPage: event.pageIndex + 1, perPage: event.pageSize },
      }),
    );
  }

  filterByDateRange(dateRange: KpDateRange): void {
    this.store.dispatch(GamificationListActions.filterByDateRange({ dateRange }));
  }

  cleanFilter(): void {
    this.store.dispatch(GamificationListActions.cleanFilter());
  }

  cleanDateRangeFilter(): void {
    this.store.dispatch(GamificationListActions.cleanDateRangeFilter());
  }
}
