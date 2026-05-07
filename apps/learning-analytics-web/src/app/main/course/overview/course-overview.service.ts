import { Injectable } from '@angular/core';
import { marker } from '@jsverse/transloco-keys-manager/marker';

import {
  Intervals,
  LabelValue,
  LazyResponse,
  AnalyticsApiFilter,
  AnalyticsApiPageFilter,
  AnalyticsApiPeriod,
  AnalyticsResponseAggs,
  CourseListResponse,
  LearnAnalyticsApi,
} from '@keeps-platform-frontend-workspace/kp-keeps';

import { TranslocoService } from '@jsverse/transloco';
import { endOfMonth, endOfYear, format, startOfMonth, startOfYear } from 'date-fns';
import { BehaviorSubject, forkJoin } from 'rxjs';
import { filter, map, mergeMap, toArray } from 'rxjs/operators';

const COMPLETED = marker('COURSE.OVERVIEW.CHARTS.LABELS.COURSES_COMPLETED');
const STARTED = marker('COURSE.OVERVIEW.CHARTS.LABELS.COURSES_STARTED');
const ENROLLMENTS = marker('COURSE.OVERVIEW.CHARTS.LABELS.COURSES_NEW_ENROLLMENTS');

const CATEGORIES = 'CATEGORY';
const TYPES = 'GENERAL.CONTENT';

@Injectable()
export class CourseOverviewService {
  private _total = new BehaviorSubject<LazyResponse<number>>({ response: 0, isLoading: false });
  private _courses = new BehaviorSubject<LazyResponse<CourseListResponse>>({
    response: { data: [], total: 0 },
    isLoading: false,
  });
  private _coursesResume = new BehaviorSubject<LazyResponse<LabelValue[]>>({ response: [], isLoading: false });
  private _top5CourseCategories = new BehaviorSubject<LazyResponse<LabelValue[]>>({
    response: [],
    isLoading: false,
  });
  private _coursesContentTypes = new BehaviorSubject<LazyResponse<LabelValue[]>>({
    response: [],
    isLoading: false,
  });
  private _coursesCompletedRatio = new BehaviorSubject<LazyResponse<number>>({ response: 0, isLoading: false });
  private _coursesContentConsumed = new BehaviorSubject<LazyResponse<number>>({ response: 0, isLoading: false });
  private _coursesRating = new BehaviorSubject<LazyResponse<number>>({ response: 0, isLoading: false });
  private _coursesContentAvailable = new BehaviorSubject<LazyResponse<number>>({ response: 0, isLoading: false });

  readonly total$ = this._total.asObservable();
  readonly courses$ = this._courses.asObservable();
  readonly coursesResume$ = this._coursesResume.asObservable();
  readonly top5CourseCategories$ = this._top5CourseCategories.asObservable();
  readonly coursesCompletedRatio$ = this._coursesCompletedRatio.asObservable();
  readonly coursesContentConsumed$ = this._coursesContentConsumed.asObservable();
  readonly coursesRating$ = this._coursesRating.asObservable();
  readonly coursesContentTypes$ = this._coursesContentTypes.asObservable();
  readonly coursesContentAvailable$ = this._coursesContentAvailable.asObservable();

  constructor(
    private translateService: TranslocoService,
    private _learnAnalyticsService: LearnAnalyticsApi,
  ) {}

  fetchCourseTotals(filters: AnalyticsApiPageFilter): void {
    this._total.next({ ...this._total.getValue(), isLoading: true });

    this._learnAnalyticsService
      .fetchCoursesTotals(filters)
      .pipe(map(({ total }) => total))
      .subscribe((total) => this._total.next({ response: total || 0, isLoading: false }));
  }

  fetchCoursesCategories(filters: AnalyticsApiFilter): void {
    this._top5CourseCategories.next({ ...this._top5CourseCategories.getValue(), isLoading: true });
    this._learnAnalyticsService
      .fetchCoursesCategories(filters)
      .pipe(
        map(
          ({
            aggs: {
              categories: { buckets },
            },
          }: AnalyticsResponseAggs) => buckets?.slice(0, 5),
        ),
        filter((buckets) => !!buckets),
        mergeMap((buckets) => buckets),
        map(({ name: { buckets } }) => buckets[0]),
        map(({ doc_count: value, key }) => {
          const label = this.translateService.translate(`${CATEGORIES}.${key}`);
          return { value, label: label.startsWith(CATEGORIES) ? key : label };
        }),
        toArray(),
      )
      .subscribe((data) => this._top5CourseCategories.next({ response: data, isLoading: false }));
  }

  fetchCoursesContentTypes(filters: AnalyticsApiFilter): void {
    this._coursesContentTypes.next({ ...this._coursesContentTypes.getValue(), isLoading: true });
    this._learnAnalyticsService
      .fetchCoursesContentTypes(filters)
      .pipe(
        map(
          ({
            aggs: {
              course_contents: {
                types: { buckets },
              },
            },
          }: AnalyticsResponseAggs) => buckets?.slice(0, 5),
        ),
        filter((buckets) => !!buckets),
        mergeMap((buckets) => buckets),
        map(({ name: { buckets } }) => buckets[0]),
        map(({ doc_count: value, key }) => {
          const upperKey = key.toUpperCase();
          const label = this.translateService.translate(`${TYPES}.${upperKey}`);
          return { value, label };
        }),
        toArray(),
      )
      .subscribe((data) => this._coursesContentTypes.next({ response: data, isLoading: false }));
  }

  fetchCoursesResume(filters: AnalyticsApiFilter = {}): void {
    this._coursesResume.next({ ...this._coursesResume.getValue(), isLoading: true });

    const streams$ = [
      this._learnAnalyticsService.fetchCoursesCompletedTotals(filters),
      this._learnAnalyticsService.fetchCoursesStartedTotals(filters),
    ];

    forkJoin(streams$)
      .pipe(
        mergeMap((response) => response),
        map(({ total }) => total),
        toArray(),
      )
      .subscribe(([completedTotals, startedTotals]) => {
        if (isNumber(completedTotals) && isNumber(startedTotals)) {
          const enrollmentTotals = completedTotals + startedTotals;
          const startedPercent = (100 * startedTotals) / enrollmentTotals;
          const completedPercent = (100 * completedTotals) / enrollmentTotals;
          const enrollmentsPercent = 100 * 1;

          this._coursesResume.next({
            response: [
              {
                label: this.translateService.translate(ENROLLMENTS),
                value: enrollmentTotals,
                data: { percent: enrollmentsPercent },
              },
              {
                label: this.translateService.translate(COMPLETED),
                value: completedTotals,
                data: { percent: completedPercent },
              },
              {
                label: this.translateService.translate(STARTED),
                value: startedTotals,
                data: { percent: startedPercent },
              },
            ],
            isLoading: false,
          });
        }
      });
  }

  fetchCoursesList(filters: AnalyticsApiPageFilter): void {
    this._courses.next({ ...this._courses.getValue(), isLoading: true });

    this._learnAnalyticsService
      .fetchCoursesList(filters)
      .subscribe((response) => this._courses.next({ response, isLoading: false }));
  }

  fetchCoursesCompletedRatio(filters: AnalyticsApiPageFilter): void {
    this._coursesCompletedRatio.next({ ...this._coursesCompletedRatio.getValue(), isLoading: true });

    this._learnAnalyticsService
      .fetchCoursesCompletedRatio(filters)
      .pipe(map((response) => response.stats.completed_ratio))
      .subscribe((response) => this._coursesCompletedRatio.next({ response, isLoading: false }));
  }

  fetchCoursesContentConsumed(filters: AnalyticsApiPageFilter): void {
    this._coursesContentConsumed.next({ ...this._coursesContentConsumed.getValue(), isLoading: true });
    this._learnAnalyticsService
      .fetchCoursesContentConsumed(filters)
      .pipe(map((response) => response.stats.total_consumed_seconds))
      .subscribe((response) => this._coursesContentConsumed.next({ response, isLoading: false }));
  }

  fetchCoursesContentAvailable(filters: AnalyticsApiPageFilter): void {
    this._coursesContentAvailable.next({ ...this._coursesContentAvailable.getValue(), isLoading: true });
    this._learnAnalyticsService
      .fetchCoursesContentAvailable(filters)
      .pipe(map((response) => response.stats.total_available_seconds))
      .subscribe((response) => this._coursesContentAvailable.next({ response, isLoading: false }));
  }

  fetchCoursesRating(filters: AnalyticsApiPageFilter): void {
    this._coursesRating.next({ ...this._coursesRating.getValue(), isLoading: true });
    this._learnAnalyticsService
      .fetchCoursesRating(filters)
      .pipe(filter((aggs) => !!aggs))
      .subscribe(
        ({
          aggs: {
            rating: { value: data },
          },
        }: AnalyticsResponseAggs) => this._coursesRating.next({ response: data, isLoading: false }),
      );
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

/**
 * @deprecated use LazyResponse
 */
export interface AnalyticsDataResult {
  data: any;
  isLoading: boolean;
}

function isNumber(value: any): value is number {
  return typeof value === 'number';
}
