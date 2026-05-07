import { Injectable } from '@angular/core';
import {
  AnalyticsApiFilter,
  AnalyticsApiUsersFilter,
  Intervals,
  LabelValue,
  LazyResponse,
  LearnAnalyticsApi,
  UserListResponse,
} from '@keeps-platform-frontend-workspace/kp-keeps';
import { TranslocoService } from '@jsverse/transloco';
import { BehaviorSubject } from 'rxjs';
import { filter, map, mergeAll, mergeMap, toArray } from 'rxjs/operators';

const CATEGORIES = 'CATEGORY';
const TYPES = 'GENERAL.CONTENT';
const RANGES = 'RANGES';

@Injectable()
export class UsersOverviewService {
  private _totalUsers = new BehaviorSubject<LazyResponse<number>>({ response: 0, isLoading: false });
  private _activeUsers = new BehaviorSubject<LazyResponse<number>>({ response: 0, isLoading: false });
  private _enrollmentsDistribution = new BehaviorSubject<LazyResponse>({ response: [], isLoading: false });
  private _engagementRate = new BehaviorSubject<LazyResponse<number>>({ response: 0, isLoading: false });
  private _contentConsumedAveragePerUser = new BehaviorSubject<LazyResponse<number>>({ response: 0, isLoading: false });
  private _usersCreators = new BehaviorSubject<LazyResponse<number>>({ response: 0, isLoading: false });
  private _activeUsersAveragePerDay = new BehaviorSubject<LazyResponse<number>>({ response: 0, isLoading: false });
  private _topEnrollmentCategories = new BehaviorSubject<LazyResponse<LabelValue[]>>({
    response: [],
    isLoading: false,
  });
  private _topContentConsumed = new BehaviorSubject<LazyResponse<LabelValue[]>>({ response: [], isLoading: false });
  private _usersList = new BehaviorSubject<LazyResponse<UserListResponse>>({
    response: { data: [], total: 0 },
    isLoading: false,
  });

  readonly totalUsers$ = this._totalUsers.asObservable();
  readonly activeUsers$ = this._activeUsers.asObservable();
  readonly enrollmentsDistribution$ = this._enrollmentsDistribution.asObservable();
  readonly engagementRate$ = this._engagementRate.asObservable();
  readonly contentConsumedAveragePerUser$ = this._contentConsumedAveragePerUser.asObservable();
  readonly usersCreators$ = this._usersCreators.asObservable();
  readonly activeUsersAveragePerDay$ = this._activeUsersAveragePerDay.asObservable();
  readonly topEnrollmentCategories$ = this._topEnrollmentCategories.asObservable();
  readonly topContentConsumed$ = this._topContentConsumed.asObservable();
  readonly usersList$ = this._usersList.asObservable();

  constructor(
    private translateService: TranslocoService,
    private _learnAnalyticsService: LearnAnalyticsApi,
  ) {}

  fetchAllForInterval(filters: AnalyticsApiFilter): void {
    this.fetchTotalUsers(filters);
    this.fetchActiveUsers(filters);
    this.fetchEnrollmentDistribution(filters);
    this.fetchEngagementRate();
    this.fetchAverageContentConsumedPerUser(filters);
    this.fetchUsersCreators(filters);
    this.fetchAverageActiveUsersPerDay(filters);
    this.fetchTopEnrollmentCategories(filters);
    this.fetchTopContentConsumed(filters);
  }

  fetchUsersList(filters: AnalyticsApiUsersFilter): void {
    this._usersList.next({ ...this._usersList.getValue(), isLoading: true });

    this._learnAnalyticsService
      .fetchUsersList(filters)
      .subscribe((response) => this._usersList.next({ response, isLoading: false }));
  }

  fetchTotalUsers(filters: AnalyticsApiFilter): void {
    this._totalUsers.next({ ...this._totalUsers.getValue(), isLoading: true });

    this._learnAnalyticsService
      .fetchTotalUsers(filters)
      .pipe(map(({ total }) => total))
      .subscribe((response) => this._totalUsers.next({ response, isLoading: false }));
  }

  fetchActiveUsers(filters: AnalyticsApiFilter): void {
    this._activeUsers.next({ ...this._activeUsers.getValue(), isLoading: true });

    this._learnAnalyticsService
      .fetchActiveUsers(filters)
      .pipe(map(({ aggs }) => aggs?.['active_users'].value))
      .subscribe((response) => this._activeUsers.next({ response, isLoading: false }));
  }

  fetchEnrollmentDistribution(filters: AnalyticsApiFilter): void {
    this._enrollmentsDistribution.next({ ...this._enrollmentsDistribution.getValue(), isLoading: true });

    this._learnAnalyticsService
      .fetchUserEnrollmentsDistribution(filters)
      .pipe(
        mergeMap(({ stats }) => stats?.enrollments_per_user || []),
        filter((ranges) => ranges.range !== '0'), // skip users without enrollments
        map((ranges) => ({ ...ranges, label: this.translateService.translate(`${RANGES}.${ranges.range}`) })),
        toArray(),
      )
      .subscribe((response) => this._enrollmentsDistribution.next({ response, isLoading: false }));
  }

  fetchEngagementRate(): void {
    this._engagementRate.next({ ...this._engagementRate.getValue(), isLoading: true });

    this._learnAnalyticsService
      .fetchEngagementRate()
      .pipe(map((response) => response.stats.engagement_rate_avg))
      .subscribe((response) => this._engagementRate.next({ response, isLoading: false }));
  }

  fetchAverageContentConsumedPerUser(filters: AnalyticsApiFilter): void {
    this._contentConsumedAveragePerUser.next({ ...this._contentConsumedAveragePerUser.getValue(), isLoading: true });

    this._learnAnalyticsService
      .fetchAverageContentConsumedPerUser(filters)
      .pipe(map((response) => response.stats.avg_hours_per_user))
      .subscribe((response) => this._contentConsumedAveragePerUser.next({ response, isLoading: false }));
  }

  fetchUsersCreators(filters: AnalyticsApiFilter): void {
    this._usersCreators.next({ ...this._usersCreators.getValue(), isLoading: true });

    this._learnAnalyticsService
      .fetchUsersCreators(filters)
      .pipe(map(({ total }) => total))
      .subscribe((response) => this._usersCreators.next({ response, isLoading: false }));
  }

  fetchAverageActiveUsersPerDay(filters: AnalyticsApiFilter): void {
    const params = { ...filters, interval: 'day' as Intervals };
    this._activeUsersAveragePerDay.next({ ...this._activeUsersAveragePerDay.getValue(), isLoading: true });

    this._learnAnalyticsService
      .fetchActiveUsers(params)
      .pipe(
        map(
          ({
            aggs: {
              avg_users_per_interval: { value },
            },
          }) => value,
        ),
      )
      .subscribe((response) => this._activeUsersAveragePerDay.next({ response, isLoading: false }));
  }

  fetchTopEnrollmentCategories(filters: AnalyticsApiFilter): void {
    this._topEnrollmentCategories.next({ ...this._topEnrollmentCategories.getValue(), isLoading: true });

    this._learnAnalyticsService
      .fetchTopEnrollmentCategories(filters)
      .pipe(
        map(
          ({
            aggs: {
              categories: { buckets },
            },
          }) => buckets.slice(0, 5),
        ),
        mergeAll(),
        map(({ name: { buckets } }) => buckets[0]),
        map(({ doc_count: value, key }) => {
          const label = this.translateService.translate(`${CATEGORIES}.${key}`);
          return { value, label: label.startsWith(CATEGORIES) ? key : label };
        }),
        toArray(),
      )
      .subscribe((response) => this._topEnrollmentCategories.next({ response, isLoading: false }));
  }

  fetchTopContentConsumed(filters: AnalyticsApiFilter): void {
    this._topContentConsumed.next({ ...this._topContentConsumed.getValue(), isLoading: true });

    this._learnAnalyticsService
      .fetchTopContentConsumed(filters)
      .pipe(
        map(
          ({
            aggs: {
              content_types: { buckets },
            },
          }) => buckets.slice(0, 5),
        ),
        mergeAll(),
        map(({ name: { buckets } }) => buckets[0]),
        map(({ doc_count: value, key }) => {
          const upperKey = key.toUpperCase();
          const label = this.translateService.translate(`${TYPES}.${upperKey}`);
          return { value, label };
        }),
        toArray(),
      )
      .subscribe((response) => this._topContentConsumed.next({ response, isLoading: false }));
  }
}

/**
 * @deprecated use LazyResponse
 */
export interface AnalyticsDataResult {
  data: any;
  isLoading: boolean;
}
