import { Injectable } from '@angular/core';
import {
  AnalyticsApiFilter,
  AnalyticsResponseRange,
  LabelValue,
  LazyResponse,
  LearnAnalyticsApi,
  UserDataResponse,
  UserDataStats,
  UserSource,
} from '@keeps-platform-frontend-workspace/kp-keeps';
import { TranslocoService } from '@jsverse/transloco';
import { marker } from '@jsverse/transloco-keys-manager/marker';
import { BehaviorSubject, Observable, forkJoin, of } from 'rxjs';
import { filter, map, mergeAll, switchMap, tap, toArray } from 'rxjs/operators';

const ERROR_NOT_FOUND = marker('USERS.DETAILS.ERROR.NOT_FOUND');
const ERROR_UNKNOWN = marker('USERS.DETAILS.ERROR.UNKNOWN');

const CATEGORIES = 'CATEGORY';
const TYPES = 'GENERAL.CONTENT';

@Injectable()
export class UserDetailsService {
  private _userResponse = new BehaviorSubject<LazyResponse<UserDataResponse>>({
    response: undefined,
    isLoading: false,
  });
  private _userData = new BehaviorSubject<UserSource | null>(null);
  private _userStats = new BehaviorSubject<UserDataStats | null>(null);
  private _performanceRanges = new BehaviorSubject<AnalyticsResponseRange[]>([]);
  private _topEnrollmentCategories = new BehaviorSubject<LabelValue[]>([]);
  private _topContentConsumed = new BehaviorSubject<LabelValue[]>([]);

  readonly userResponse$ = this._userResponse.asObservable();
  readonly userData$ = this._userData.asObservable();
  readonly userStats$ = this._userStats.asObservable();
  readonly performanceRanges$ = this._performanceRanges.asObservable();
  readonly topEnrollmentCategories$ = this._topEnrollmentCategories.asObservable();
  readonly topContentConsumed$ = this._topContentConsumed.asObservable();

  constructor(
    private translateService: TranslocoService,
    private _learnAnalyticsAPI: LearnAnalyticsApi,
  ) {}

  fetchUserData(userId: string, filter: AnalyticsApiFilter): void {
    this._userResponse.next({ ...this._userResponse.getValue(), isLoading: true });

    this._learnAnalyticsAPI
      .fetchUserData(userId, filter)
      .pipe(
        map((response) => of(response)),
        switchMap((response) =>
          forkJoin([
            response,
            this.handleUserInfo(response),
            this.handleUserStats(response),
            this.handlePerformanceRanges(response),
            this.handleTopEnrollmentCategories(response),
            this.handleTopContentConsumed(response),
          ]),
        ),
      )
      .subscribe({
        next: (responses) => this._userResponse.next({ response: responses[0], isLoading: false }),
        error: (error) => {
          if (error.status === 404) {
            this._userResponse.next({ response: {}, isLoading: false, error: ERROR_NOT_FOUND });
          } else {
            this._userResponse.next({ response: {}, isLoading: false, error: ERROR_UNKNOWN });
          }
        },
      });
  }

  private handleUserInfo(response: Observable<UserDataResponse>): Observable<UserSource> {
    return response.pipe(
      filter((response) => !!response.data),
      map((response) => response.data?.[0]?._source),
      tap((source) => this._userData.next(source)),
    );
  }

  private handleUserStats(response: Observable<UserDataResponse>): Observable<UserDataStats> {
    return response.pipe(
      filter((response) => !!response.stats),
      map((response) => response?.stats),
      tap((stats) => this._userStats.next(stats)),
    );
  }

  private handlePerformanceRanges(response: Observable<UserDataResponse>): Observable<AnalyticsResponseRange[]> {
    return response.pipe(
      filter((response) => !!response),
      map(({ stats }) => stats?.enrollments?.completed.ranges),
      mergeAll(),
      tap((range) => {
        range.from = range.from || 0;
        range.to = range.to || 1;
      }),
      toArray(),
      tap((range) => this._performanceRanges.next(range)),
    );
  }

  private handleTopEnrollmentCategories(response: Observable<UserDataResponse>): Observable<LabelValue[]> {
    return response.pipe(
      filter((response) => !!response),
      map(({ stats }) => stats?.enrollments?.categories.slice(0, 5)),
      mergeAll(),
      map(({ name: { buckets } }) => buckets?.[0]),
      map(({ doc_count: value, key }) => {
        const label = this.translateService.translate(`${CATEGORIES}.${key}`);
        return { value, label: label.startsWith(CATEGORIES) ? key : label };
      }),
      toArray(),
      tap((data) => this._topEnrollmentCategories.next(data)),
    );
  }

  private handleTopContentConsumed(response: Observable<UserDataResponse>): Observable<LabelValue[]> {
    return response.pipe(
      filter((response) => !!response),
      map(({ stats }) => stats?.activities?.content_types.slice(0, 5)),
      mergeAll(),
      map(({ name: { buckets } }) => buckets?.[0]),
      map(({ doc_count: value, key }) => {
        const upperKey = key.toUpperCase();
        const label = this.translateService.translate(`${TYPES}.${upperKey}`);
        return { value, label };
      }),
      toArray(),
      tap((data) => this._topContentConsumed.next(data)),
    );
  }
}
