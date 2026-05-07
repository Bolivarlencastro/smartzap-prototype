import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import {
  UserApiResponse,
  UserDataResponse,
  UserEnrollmentDistributionResponse,
  UserListResponse,
  AnalyticsApiFilter,
  AnalyticsApiPageFilter,
  AnalyticsApiUserEnrollmentsFilter,
  AnalyticsApiUsersFilter,
  CourseApiResponse,
  CourseContentFilter,
  CourseContentListResponse,
  CourseDataResponse,
  CourseListResponse,
  EnrollmentListResponse,
} from '../models';
import { LearnAnalyticsClient } from './learn-analytics.client';

@Injectable({
  providedIn: 'root',
})
export class LearnAnalyticsApi {
  private coursesOverviewPath = '/v2/courses';
  private courseDetailsPath = '/v2/course';
  private usersOverviewPath = '/v2/users';
  private userDetailsPath = '/v2/user';
  public unsubscribeComponent$ = new Subject<void>();
  public unsubscribe$ = this.unsubscribeComponent$.asObservable();

  constructor(private _http: LearnAnalyticsClient) {}

  /**
   * Returns the total courses created in the period, and aggregation of date histogram.
   */
  fetchCoursesTotals(filter: AnalyticsApiFilter = {}): Observable<CourseApiResponse> {
    return this._http.get<CourseApiResponse>(`${this.coursesOverviewPath}`, filter);
  }

  /**
   * Returns the total courses with enrollment started in the period, and aggregation of date histogram.
   */
  fetchCoursesStartedTotals(filter: AnalyticsApiFilter = {}): Observable<CourseApiResponse> {
    return this._http.get<CourseApiResponse>(`${this.coursesOverviewPath}/started`, filter);
  }

  /**
   * Returns the total courses with enrollment ending in the period, and aggregation of date histogram.
   */
  fetchCoursesCompletedTotals(filter: AnalyticsApiFilter = {}): Observable<CourseApiResponse> {
    return this._http.get<CourseApiResponse>(`${this.coursesOverviewPath}/completed`, filter);
  }

  /**
   * Returns the ratio of total enrollments completed over started, in the period.
   */
  fetchCoursesCompletedRatio(filter: AnalyticsApiFilter = {}): Observable<CourseApiResponse> {
    return this._http.get<CourseApiResponse>(`${this.coursesOverviewPath}/completed/ratio`, filter);
  }

  /**
   * Returns the sum of total hours of content of courses available in the period.
   */
  fetchCoursesContentAvailable(filter: AnalyticsApiFilter = {}): Observable<CourseApiResponse> {
    return this._http.get<CourseApiResponse>(`${this.coursesOverviewPath}/content/available`, filter);
  }

  /**
   * Returns the sum of total hours of content of activities in the period.
   */
  fetchCoursesContentConsumed(filter: AnalyticsApiFilter = {}): Observable<CourseApiResponse> {
    return this._http.get<CourseApiResponse>(`${this.coursesOverviewPath}/content/consumed`, filter);
  }

  /**
   * Returns the ranking of course categories, id and name in sub aggregation.
   */
  fetchCoursesCategories(filter: AnalyticsApiFilter = {}): Observable<CourseApiResponse> {
    return this._http.get<CourseApiResponse>(`${this.coursesOverviewPath}/categories`, filter);
  }

  /**
   * Returns the ranking of course types, id and name in sub aggregation.
   */
  fetchCoursesContentTypes(filter: AnalyticsApiFilter = {}): Observable<CourseApiResponse> {
    return this._http.get<CourseApiResponse>(`${this.coursesOverviewPath}/content/types`, filter);
  }

  /**
   * Course Listing.
   */
  fetchCoursesList(filter: AnalyticsApiPageFilter = {}): Observable<CourseListResponse> {
    return this._http.get<CourseListResponse>(`${this.coursesOverviewPath}/list`, filter);
  }

  /**
   * Returns the total enrollments created in the period, and aggregation of date histogram.
   */
  fetchCoursesNewEnrollmentTotals(filter: AnalyticsApiFilter = {}): Observable<CourseApiResponse> {
    return this._http.get<CourseApiResponse>(`${this.coursesOverviewPath}/new-enrollment`, filter);
  }

  /**
   * Returns the average ratings of the courses, per enrollment rating.
   */
  fetchCoursesRating(filter: AnalyticsApiFilter = {}): Observable<CourseApiResponse> {
    return this._http.get<CourseApiResponse>(`${this.coursesOverviewPath}/rating`, filter);
  }

  /**
   * Get Total Active Users.
   */
  fetchCoursesUsersActive(filter: AnalyticsApiFilter = {}): Observable<CourseApiResponse> {
    return this._http.get<CourseApiResponse>(`${this.coursesOverviewPath}/users/active`, filter);
  }

  fetchCourseData(courseId: string, filters: AnalyticsApiFilter = {}): Observable<CourseDataResponse> {
    return this._http.get<CourseDataResponse>(`${this.courseDetailsPath}/${courseId}`, filters);
  }

  fetchCourseEnrollments(courseId: string, filters: AnalyticsApiPageFilter = {}): Observable<EnrollmentListResponse> {
    return this._http.get<EnrollmentListResponse>(`${this.courseDetailsPath}/${courseId}/enrollments`, filters);
  }

  fetchCourseContents(courseId: string, filters: CourseContentFilter = {}): Observable<CourseContentListResponse> {
    return this._http.get<CourseContentListResponse>(`${this.courseDetailsPath}/${courseId}/contents`, filters);
  }

  // -------------------- //

  fetchTotalUsers(filters: AnalyticsApiFilter = {}): Observable<UserApiResponse> {
    return this._http.get<UserApiResponse>(`${this.usersOverviewPath}`, filters);
  }

  fetchActiveUsers(filters: AnalyticsApiFilter = {}): Observable<UserApiResponse> {
    return this._http.get<UserApiResponse>(`${this.usersOverviewPath}/active`, filters);
  }

  fetchUserEnrollmentsDistribution(filters: AnalyticsApiFilter = {}): Observable<UserEnrollmentDistributionResponse> {
    return this._http.get<UserEnrollmentDistributionResponse>(
      `${this.usersOverviewPath}/enrollment/distribution`,
      filters,
    );
  }

  fetchEngagementRate(filters: AnalyticsApiFilter = {}): Observable<UserApiResponse> {
    return this._http.get<UserApiResponse>(`${this.usersOverviewPath}/engagement/rate`, filters);
  }

  fetchAverageContentConsumedPerUser(filters: AnalyticsApiFilter = {}): Observable<UserApiResponse> {
    return this._http.get<UserApiResponse>(`${this.usersOverviewPath}/content/consumed`, filters);
  }

  fetchUsersCreators(filters: AnalyticsApiFilter = {}): Observable<UserApiResponse> {
    return this._http.get<UserApiResponse>(`${this.usersOverviewPath}/creators`, filters);
  }

  fetchTopEnrollmentCategories(filters: AnalyticsApiFilter = {}): Observable<UserApiResponse> {
    return this._http.get<UserApiResponse>(`${this.usersOverviewPath}/enrollment/categories`, filters);
  }

  fetchTopContentConsumed(filters: AnalyticsApiFilter = {}): Observable<UserApiResponse> {
    return this._http.get<UserApiResponse>(`${this.usersOverviewPath}/activity/content-types`, filters);
  }

  fetchUsersList(filters: AnalyticsApiUsersFilter = {}): Observable<UserListResponse> {
    return this._http.get<UserListResponse>(`${this.usersOverviewPath}/list`, filters);
  }

  fetchUserData(userId: string, params: AnalyticsApiFilter): Observable<UserDataResponse> {
    return this._http.get<UserDataResponse>(`${this.userDetailsPath}/${userId}`, params);
  }

  fetchUserEnrollments(
    userId: string,
    filters: AnalyticsApiUserEnrollmentsFilter = {},
  ): Observable<EnrollmentListResponse> {
    return this._http.get<EnrollmentListResponse>(`${this.userDetailsPath}/${userId}/enrollments`, filters);
  }
}
