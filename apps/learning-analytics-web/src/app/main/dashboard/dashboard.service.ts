// tslint:disable: variable-name
import { Injectable } from '@angular/core';
import { marker } from '@jsverse/transloco-keys-manager/marker';
import { TranslocoService } from '@jsverse/transloco';
import { BehaviorSubject, combineLatest, Observable, of, Subject, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { DashboardChartType, DashboardCourseTotals, DashboardPeriodType } from './dashboard.model';
import { AnalyticsResponseBucket, LearnAnalyticsApi } from '@keeps-platform-frontend-workspace/kp-keeps';
import {
  addDays,
  addMonths,
  endOfMonth,
  endOfYear,
  format,
  setMonth,
  setYear,
  startOfMonth,
  startOfYear,
} from 'date-fns';

marker('DASHBOARD.CHART.VALUES.ACTIVE');

marker('DASHBOARD.CHART.SERIES.ACTIVE_USERS_IN_');
marker('DASHBOARD.CHART.SERIES.ACTIVE_USERS_DESCRIPTION');
marker('DASHBOARD.CHART.SERIES.NEW_USERS_IN_');
marker('DASHBOARD.CHART.VALUES.NEW_USERS');

marker('DASHBOARD.CHART.SERIES.COMPLETED_COURSES_IN_');
marker('DASHBOARD.CHART.SERIES.NEW_COURSES_IN_');
marker('DASHBOARD.CHART.VALUES.NEW_COURSES');

marker('DASHBOARD.WIDGETS.NEW_USERS.TITLE');
marker('DASHBOARD.WIDGETS.NEW_USERS.SUBTITLE');
marker('DASHBOARD.WIDGETS.ACTIVE_USERS.TITLE');
marker('DASHBOARD.WIDGETS.ACTIVE_USERS.SUBTITLE');
marker('DASHBOARD.WIDGETS.TOTAL_USERS.TITLE');
marker('DASHBOARD.WIDGETS.TOTAL_USERS.SUBTITLE');

marker('DASHBOARD.WIDGETS.NEW_COURSES.TITLE');
marker('DASHBOARD.WIDGETS.NEW_COURSES.SUBTITLE');
marker('DASHBOARD.WIDGETS.COMPLETED_COURSES.TITLE');
marker('DASHBOARD.WIDGETS.COMPLETED_COURSES.SUBTITLE');
marker('DASHBOARD.WIDGETS.TOTAL_COURSES.TITLE');
marker('DASHBOARD.WIDGETS.TOTAL_COURSES.SUBTITLE');

@Injectable()
export class DashboardService {
  public unsubscribeComponent$ = new Subject<void>();
  public unsubscribe$ = this.unsubscribeComponent$.asObservable();

  private _loading = new BehaviorSubject(false);
  readonly loading = this._loading.asObservable();

  constructor(
    private learnAnalyticsService: LearnAnalyticsApi,
    private translateService: TranslocoService,
  ) {}

  getCourseDashboardData(filters: DashboardCourseTotals) {
    this._loading.next(true);
    const { start_date, prev_start_date, end_date, prev_end_date, interval } = this.getDataFilters(filters);
    const params = {
      interval,
      start_date,
      end_date,
    };

    const params_prev = {
      interval,
      start_date: prev_start_date,
      end_date: prev_end_date,
    };

    const params_total = {
      interval,
    };

    const params_total_prev = {
      interval,
      end_date: prev_end_date,
    };

    const combined = combineLatest([
      this.learnAnalyticsService.fetchCoursesCompletedTotals(params),
      this.learnAnalyticsService.fetchCoursesCompletedTotals(params_prev),
      this.learnAnalyticsService.fetchCoursesTotals(params),
      this.learnAnalyticsService.fetchCoursesTotals(params_prev),
      this.learnAnalyticsService.fetchCoursesTotals(params_total),
      this.learnAnalyticsService.fetchCoursesTotals(params_total_prev),
      of(params),
      of(params_prev),
    ]);

    return combined.pipe(
      tap(() => this._loading.next(false)),
      catchError((error) => {
        this._loading.next(false);
        return throwError(() => error);
      }),
    );
  }

  getCourseActiveUsersData(filters: DashboardCourseTotals): Observable<any> {
    this._loading.next(true);
    const { start_date, prev_start_date, end_date, prev_end_date, interval } = this.getDataFilters(filters);

    const params = {
      interval,
      start_date,
      end_date,
    };

    const params_prev = {
      interval,
      start_date: prev_start_date,
      end_date: prev_end_date,
    };

    const params_total = {
      interval,
    };

    const params_total_prev = {
      interval,
      end_date: prev_end_date,
    };

    const combined = combineLatest([
      this.learnAnalyticsService.fetchActiveUsers(params),
      this.learnAnalyticsService.fetchActiveUsers(params_prev),
      this.learnAnalyticsService.fetchTotalUsers(params),
      this.learnAnalyticsService.fetchTotalUsers(params_prev),
      this.learnAnalyticsService.fetchTotalUsers(params_total),
      this.learnAnalyticsService.fetchTotalUsers(params_total_prev),
      of(params),
      of(params_prev),
    ]);

    return combined.pipe(
      tap(() => this._loading.next(false)),
      catchError((error) => {
        this._loading.next(false);
        return throwError(() => error);
      }),
    );
  }

  getDataFilters(filters: DashboardCourseTotals): any {
    const { selectedMonth, selectedYear } = filters;

    const dataFilter: Record<
      DashboardPeriodType,
      () => { interval: string; start_date: string; end_date: string; prev_start_date: string; prev_end_date: string }
    > = {
      [DashboardPeriodType.MONTH]: () => {
        const filterDate = setMonth(new Date(), selectedMonth - 1);
        const filterPrevDate = setMonth(new Date(), selectedMonth - 2);

        return {
          interval: 'day',
          start_date: format(startOfMonth(filterDate), 'yyyy-MM-dd'),
          end_date: format(endOfMonth(filterDate), 'yyyy-MM-dd'),
          prev_start_date: format(startOfMonth(filterPrevDate), 'yyyy-MM-dd'),
          prev_end_date: format(endOfMonth(filterPrevDate), 'yyyy-MM-dd'),
        };
      },
      [DashboardPeriodType.YEAR]: () => {
        return {
          interval: 'month',
          start_date: format(startOfYear(setYear(new Date(), selectedYear)), 'yyyy-MM-dd'),
          end_date: format(endOfYear(setYear(new Date(), selectedYear)), 'yyyy-MM-dd'),
          prev_start_date: format(startOfYear(setYear(new Date(), selectedYear - 1)), 'yyyy-MM-dd'),
          prev_end_date: format(endOfYear(setYear(new Date(), selectedYear - 1)), 'yyyy-MM-dd'),
        };
      },
      [DashboardPeriodType.PERIOD]: () => {
        return {
          interval: 'day',
          start_date: format(startOfYear(setYear(new Date(), selectedYear)), 'yyyy-MM-dd'),
          end_date: format(endOfYear(setYear(new Date(), selectedYear)), 'yyyy-MM-dd'),
          prev_start_date: format(startOfYear(setYear(new Date(), selectedYear - 1)), 'yyyy-MM-dd'),
          prev_end_date: format(endOfYear(setYear(new Date(), selectedYear - 1)), 'yyyy-MM-dd'),
        };
      },
    };

    return dataFilter[filters.type] ? dataFilter[filters.type]() : {};
  }

  getChartDataUsers(data: any[], selectedPeriod: DashboardPeriodType, periodType: any): any {
    const [activeUsers, activeUsersPrev, newUsers, newUsersPrev, allUsers, allUsersPrev, params] = data;

    const {
      aggs: {
        active_users: { value: activeUsersCount },
        activity_histogram: { buckets: bktCurr },
      },
    } = activeUsers;

    const {
      aggs: {
        active_users: { value: activeUsersCountPrev },
        activity_histogram: { buckets: bktPrev },
      },
    } = activeUsersPrev;

    const {
      total: newUsersCount,
      aggs: { buckets: bktNew },
    } = newUsers;

    const {
      total: newUsersCountPrev,
      aggs: { buckets: bktNewPrev },
    } = newUsersPrev;

    const { total: allUsersCount } = allUsers;
    const { total: allUsersCountPrev } = allUsersPrev;

    const chartData: any = [];

    const dates = this.getDateValues(params);

    dates.forEach((date) => {
      const currentValue = bktCurr?.filter(this.filterKey(date, selectedPeriod, periodType))[0];
      const prevValue = bktPrev?.filter(this.filterKey(date, selectedPeriod, periodType))[0];
      const newValue = bktNew?.filter(this.filterKey(date, selectedPeriod, periodType))[0];
      const newValuePrev = bktNewPrev?.filter(this.filterKey(date, selectedPeriod, periodType))[0];

      const currentCount = currentValue?.['users_per_interval'].value;
      const prevCount = prevValue?.['users_per_interval'].value;
      const newCount = newValue?.doc_count;
      const newCountPrev = newValuePrev?.doc_count;

      date = selectedPeriod === periodType.YEAR ? '2020-' + date : `${format(new Date(), 'MM')}-${date}`;

      chartData.push({
        date,
        series2: prevCount || 0,
        series1: currentCount || 0,
        series3: newCount || 0,
        series4: newCountPrev || 0,
      });
    });

    const newUsersDelta = ((newUsersCount - newUsersCountPrev) / newUsersCountPrev) * 100;
    const activeUsersDelta = ((activeUsersCount - activeUsersCountPrev) / activeUsersCountPrev) * 100;
    const allUsersDelta = ((allUsersCount - allUsersCountPrev) / allUsersCountPrev) * 100;

    return {
      chartData,
      widget1: {
        title: this.translateService.translate('DASHBOARD.WIDGETS.NEW_USERS.TITLE'),
        subtitle: this.translateService.translate('DASHBOARD.WIDGETS.NEW_USERS.SUBTITLE'),
        value: newUsersCount,
        target: newUsersDelta === Infinity ? 0 : newUsersDelta,
      },
      widget2: {
        title: this.translateService.translate('DASHBOARD.WIDGETS.ACTIVE_USERS.TITLE'),
        subtitle: this.translateService.translate('DASHBOARD.WIDGETS.ACTIVE_USERS.SUBTITLE'),
        value: activeUsersCount,
        target: activeUsersDelta === Infinity ? 0 : activeUsersDelta,
      },
      widget3: {
        title: this.translateService.translate('DASHBOARD.WIDGETS.TOTAL_USERS.TITLE'),
        subtitle: this.translateService.translate('DASHBOARD.WIDGETS.TOTAL_USERS.SUBTITLE'),
        value: allUsersCount,
        target: allUsersDelta === Infinity ? 0 : allUsersDelta,
      },
    };
  }

  getChartDataCourses(data: any, selectedPeriod: DashboardPeriodType, periodType: any): any {
    const [completedCourses, completedCoursePrev, newCourses, newCoursesPrev, allCourses, allCoursesPrev, params] =
      data;

    const {
      total: completedCoursesCount,
      aggs: { buckets: bktCurr },
    } = completedCourses;

    const {
      total: completedCoursesCountPrev,
      aggs: { buckets: bktPrev },
    } = completedCoursePrev;

    const {
      total: newCoursesCount,
      aggs: { buckets: bktNew },
    } = newCourses;

    const {
      total: newCoursesCountPrev,
      aggs: { buckets: bktNewPrev },
    } = newCoursesPrev;

    const { total: allCoursesCount } = allCourses;
    const { total: allCoursesCountPrev } = allCoursesPrev;

    const chartData: any = [];
    const dates = this.getDateValues(params);

    dates.forEach((date) => {
      const currentValue = bktCurr?.filter(this.filterKey(date, selectedPeriod, periodType))[0];
      const prevValue = bktPrev?.filter(this.filterKey(date, selectedPeriod, periodType))[0];
      const newValue = bktNew?.filter(this.filterKey(date, selectedPeriod, periodType))[0];
      const newValuePrev = bktNewPrev?.filter(this.filterKey(date, selectedPeriod, periodType))[0];

      const currentCount = currentValue?.doc_count;
      const prevCount = prevValue?.doc_count;
      const newCount = newValue?.doc_count;
      const newCountPrev = newValuePrev?.doc_count;

      date = selectedPeriod === periodType.YEAR ? date : `${format(new Date(`${date}T00:00:00`), 'MM')}-${date}`;

      chartData.push({
        date,
        series2: prevCount || 0,
        series1: currentCount || 0,
        series3: newCount || 0,
        series4: newCountPrev || 0,
        color: 'black',
      });
    });

    const newCoursesDelta = ((newCoursesCount - newCoursesCountPrev) / newCoursesCountPrev) * 100;
    const completedCoursesDelta =
      ((completedCoursesCount - completedCoursesCountPrev) / completedCoursesCountPrev) * 100;
    const allCoursesDelta = ((allCoursesCount - allCoursesCountPrev) / allCoursesCountPrev) * 100;

    return {
      chartData,
      widget1: {
        title: this.translateService.translate('DASHBOARD.WIDGETS.NEW_COURSES.TITLE'),
        subtitle: this.translateService.translate('DASHBOARD.WIDGETS.NEW_COURSES.SUBTITLE'),
        value: newCoursesCount,
        target: newCoursesDelta === Infinity ? 0 : newCoursesDelta,
      },
      widget2: {
        title: this.translateService.translate('DASHBOARD.WIDGETS.COMPLETED_COURSES.TITLE'),
        subtitle: this.translateService.translate('DASHBOARD.WIDGETS.COMPLETED_COURSES.SUBTITLE'),
        value: completedCoursesCount,
        target: completedCoursesDelta === Infinity ? 0 : completedCoursesDelta,
      },
      widget3: {
        title: this.translateService.translate('DASHBOARD.WIDGETS.TOTAL_COURSES.TITLE'),
        subtitle: this.translateService.translate('DASHBOARD.WIDGETS.TOTAL_COURSES.SUBTITLE'),
        value: allCoursesCount,
        target: allCoursesDelta === Infinity ? 0 : allCoursesDelta,
      },
    };
  }

  getDateValues(params: { start_date: string; end_date: string; interval: any }): any[] {
    const dateEnd = new Date(`${params.end_date}T00:00:00`);
    let interim = new Date(`${params.start_date}T00:00:00`);
    const timeValues = [];

    while (dateEnd > interim || format(interim, 'M') === format(dateEnd, 'M')) {
      const dateFormat = params.interval === 'day' ? 'dd' : 'MM-dd';
      timeValues.push(format(interim, dateFormat));
      interim = params.interval === 'day' ? addDays(interim, 1) : addMonths(interim, 1);
    }

    return timeValues;
  }

  getChartOptions(filter: any): any {
    const { chartType, type, selectedMonth, selectedYear } = filter;

    const valueAxisLabel = this.translateService.translate('DASHBOARD.CHART.VALUES.ACTIVE');

    let seriesLabelPrefix = this.translateService.translate('DASHBOARD.CHART.SERIES.ACTIVE_USERS_IN_');
    let lineLabelPrefix = this.translateService.translate('DASHBOARD.CHART.SERIES.NEW_USERS_IN_');
    let hint = this.translateService.translate('DASHBOARD.CHART.SERIES.ACTIVE_USERS_DESCRIPTION');
    let valueAxis2Label = this.translateService.translate('DASHBOARD.CHART.VALUES.NEW_USERS');

    if (chartType === DashboardChartType.COURSES) {
      seriesLabelPrefix = this.translateService.translate('DASHBOARD.CHART.SERIES.COMPLETED_COURSES_IN_');
      lineLabelPrefix = this.translateService.translate('DASHBOARD.CHART.SERIES.NEW_COURSES_IN_');
      hint = '';
      valueAxis2Label = this.translateService.translate('DASHBOARD.CHART.VALUES.NEW_COURSES');
    }

    let labelSufix: any = selectedYear;
    let labelPrevSufix: any = selectedYear - 1;

    if (type === DashboardPeriodType.MONTH) {
      labelSufix = format(setMonth(new Date(), selectedMonth - 1), 'MMM/yyyy').toUpperCase();
      labelPrevSufix = format(setMonth(new Date(), selectedMonth - 2), 'MMM/yyyy').toUpperCase();
    }

    return {
      series1: {
        label: `${seriesLabelPrefix} ${labelSufix}`,
        hint,
      },
      series2: {
        label: `${seriesLabelPrefix} ${labelPrevSufix}`,
      },
      line: {
        label: `${lineLabelPrefix} ${labelSufix}`,
      },
      valueAxis: {
        label: valueAxisLabel,
      },
      valueAxis2: {
        label: valueAxis2Label,
      },
    };
  }

  private filterKey(date: Date, interval: DashboardPeriodType, periodType: any) {
    return (k: AnalyticsResponseBucket) => {
      if (interval === periodType.MONTH) {
        return String(k.key_as_string).slice(8) === `${date}T00:00:00.000Z`;
      }

      return String(k.key_as_string).slice(5) === `${date}T00:00:00.000Z`;
    };
  }
}
