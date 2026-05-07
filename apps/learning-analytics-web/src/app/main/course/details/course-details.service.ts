import { Injectable } from '@angular/core';
import {
  AnalyticsApiPageFilter,
  AnalyticsApiPeriod,
  CourseDataResponse,
  CourseDataStats,
  CourseSource,
  EnrollmentListResponse,
  Intervals,
  LabelValue,
  LazyResponse,
  LearnAnalyticsApi,
} from '@keeps-platform-frontend-workspace/kp-keeps';
import { DonutSlice } from '@keeps-platform-frontend-workspace/ui/kp-analytics-donut-chart';
import { NpsRow } from '@keeps-platform-frontend-workspace/ui/kp-course-nps';
import { TranslocoService } from '@jsverse/transloco';
import { marker } from '@jsverse/transloco-keys-manager/marker';
import { endOfMonth, endOfYear, format, startOfMonth, startOfYear } from 'date-fns';
import { BehaviorSubject, forkJoin, Observable, of } from 'rxjs';
import { filter, map, mergeAll, switchMap, tap, toArray } from 'rxjs/operators';

const ERROR_NOT_FOUND = marker('COURSE.DETAILS.ERROR.NOT_FOUND');
const ERROR_UNKNOWN = marker('COURSE.DETAILS.ERROR.UNKNOWN');

const ENROLLMENTS = marker('COURSE.DETAILS.CHARTS.LABELS.ENROLLMENTS_TOTAL');
const STARTED = marker('COURSE.DETAILS.CHARTS.LABELS.ENROLLMENTS_STARTED');
const COMPLETED = marker('COURSE.DETAILS.CHARTS.LABELS.ENROLLMENTS_COMPLETED');

const NPS_PRO = marker('COURSE.DETAILS.WIDGETS.NPS.PRO');
const NPS_NEUTRAL = marker('COURSE.DETAILS.WIDGETS.NPS.NEUTRAL');
const NPS_CON = marker('COURSE.DETAILS.WIDGETS.NPS.CON');

const CATEGORIES = 'CATEGORY';
const TYPES = 'GENERAL.CONTENT';

const NPS = {
  pro: {
    label: NPS_PRO,
    color: '#00CAAB', // green
    field: 'pros',
  },
  neutral: {
    label: NPS_NEUTRAL,
    color: '#FFB00B', // yellow
    field: 'neutrals',
  },
  con: {
    label: NPS_CON,
    color: '#EF5350', // red
    field: 'cons',
  },
};

@Injectable()
export class CourseDetailsService {
  private _response = new BehaviorSubject<LazyResponse<CourseDataResponse>>({ response: {}, isLoading: false });
  private _courseData = new BehaviorSubject<CourseSource | null>(null);
  private _courseStats = new BehaviorSubject<CourseDataStats | null>(null);
  private _courseNps = new BehaviorSubject<NpsRow[] | null>(null);
  private _firstContentType = new BehaviorSubject<string | null>(null);
  private _rankContentTypes = new BehaviorSubject<DonutSlice[] | null>(null);
  private _enrollmentDistribution = new BehaviorSubject<LabelValue[] | null>(null);
  private _enrollmentList = new BehaviorSubject<LazyResponse<EnrollmentListResponse>>({
    response: { data: [], total: 0 },
    isLoading: false,
  });

  readonly response$ = this._response.asObservable();
  readonly courseData$ = this._courseData.asObservable();
  readonly courseStats$ = this._courseStats.asObservable();
  readonly courseNps$ = this._courseNps.asObservable();
  readonly firstContentType$ = this._firstContentType.asObservable();
  readonly rankContentTypes$ = this._rankContentTypes.asObservable();
  readonly enrollmentDistribution$ = this._enrollmentDistribution.asObservable();
  readonly enrollmentList$ = this._enrollmentList.asObservable();

  constructor(
    private translateService: TranslocoService,
    private _learnAnalyticsService: LearnAnalyticsApi,
  ) {}

  fetchCourseData(courseId: string): void {
    this._response.next({ ...this._response.getValue(), isLoading: true });

    this._learnAnalyticsService
      .fetchCourseData(courseId)
      .pipe(
        map((response) => of(response)),
        switchMap((response) =>
          forkJoin([
            response,
            this.handleCourseSource(response),
            this.handleCourseStats(response),
            this.handleCourseNps(response),
            this.handleContentTypes(response),
            this.handleEnrollmentDistribution(response),
          ]),
        ),
      )
      .subscribe({
        next: (responses) => this._response.next({ response: responses[0], isLoading: false }),
        error: (error) => {
          if (error.status === 404) {
            this._response.next({ response: {}, isLoading: false, error: ERROR_NOT_FOUND });
          } else {
            console.error(error);
            this._response.next({ response: {}, isLoading: false, error: ERROR_UNKNOWN });
          }
        },
      });
  }

  private handleCourseSource(response: Observable<CourseDataResponse>): Observable<CourseSource> {
    return response.pipe(
      filter((resp) => !!resp.data),
      map((resp) => (resp.data as CourseDataResponse)[0]._source),
      tap((source) => {
        const label = this.translateService.translate(`${CATEGORIES}.${source.course_category.name}`);
        source.course_category.name_translated = label.startsWith(CATEGORIES) ? source.course_category.name : label;
      }),
      tap((source) => this._courseData.next(source)),
    );
  }

  private handleCourseStats(response: Observable<CourseDataResponse>): Observable<CourseDataStats> {
    return response.pipe(
      filter((resp) => !!resp),
      map((resp) => resp.stats),
      tap((stats) => this._courseStats.next(stats)),
    );
  }

  private handleCourseNps(response: Observable<CourseDataResponse>): Observable<NpsRow[]> {
    return response.pipe(
      map((resp) => resp.stats?.nps),
      map((nps) =>
        Object.values(NPS).map(({ label, color, field }) => ({
          color,
          label: this.translateService.translate(label),
          value: (nps as Record<string, number>)[field],
        })),
      ),
      tap((nps) => this._courseNps.next(nps)),
    );
  }

  private handleContentTypes(response: Observable<CourseDataResponse>): Observable<DonutSlice[]> {
    return response.pipe(
      map((resp) => resp.aggs),
      filter((aggs) => !!aggs),
      map((aggs) => aggs?.['course_contents']['types'].buckets?.slice(0, 5)),
      mergeAll(),
      map(({ name: nameBucket, doc_count: value }) => {
        const key = nameBucket.buckets[0].key.toUpperCase();
        const label = this.translateService.translate(`${TYPES}.${key}`);
        return { value, label };
      }),
      toArray(),
      tap((slices) => this._firstContentType.next(slices.length ? slices[0].label : null)),
      tap((slices) => this._rankContentTypes.next(slices)),
    );
  }

  private handleEnrollmentDistribution(response: Observable<CourseDataResponse>): Observable<LabelValue[]> {
    return response.pipe(
      map(
        (resp) =>
          resp.stats?.enrollments as {
            total: number;
            started: number;
            completed: number;
            give_up: number;
            completed_ratio: number;
          },
      ),
      map(({ total, started, completed }) => {
        const totalPercent = total ? 100 * 1 : 0;
        const startedPercent = total ? (100 * started) / total : 0;
        const completedPercent = total ? (100 * completed) / total : 0;
        return [
          { label: this.translateService.translate(ENROLLMENTS), value: total, data: { percent: totalPercent } },
          { label: this.translateService.translate(STARTED), value: started, data: { percent: startedPercent } },
          { label: this.translateService.translate(COMPLETED), value: completed, data: { percent: completedPercent } },
        ];
      }),
      tap((distribution) => this._enrollmentDistribution.next(distribution)),
    );
  }

  fetchCourseEnrollmentList(courseId: string, interval: Intervals, filters: AnalyticsApiPageFilter): void {
    this._enrollmentList.next({ ...this._enrollmentList.getValue(), isLoading: true });

    const filtersWithInterval = {
      ...filters,
      ...this.getPeriodFromInterval(interval),
    };

    this._learnAnalyticsService
      .fetchCourseEnrollments(courseId, filtersWithInterval)
      .subscribe((response) => this._enrollmentList.next({ response, isLoading: false }));
  }

  getPeriodFromInterval(interval: Intervals): AnalyticsApiPeriod {
    let start_date: string;
    let end_date: string;
    const filterDate = new Date();

    switch (interval) {
      case 'month':
        start_date = format(startOfMonth(filterDate), 'yyyy-MM-dd');
        end_date = format(endOfMonth(filterDate), 'yyyy-MM-dd');
        return { start_date, end_date };

      case 'year':
        start_date = format(startOfYear(filterDate), 'yyyy-MM-dd');
        end_date = format(endOfYear(filterDate), 'yyyy-MM-dd');
        return { start_date, end_date };

      default:
        return {};
    }
  }
}
