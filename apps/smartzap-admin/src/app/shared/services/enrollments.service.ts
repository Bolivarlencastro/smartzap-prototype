import { Injectable } from '@angular/core';
import { SortDirection } from '@angular/material/sort';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { SmartzapAPI } from '@core/api';
import { Enrollment } from 'app/main/courses/model';
import { CollectionApiResponse, CollectionResponse, Page } from 'app/shared/model';
import { Tracking } from 'app/main/courses/model/tracking';

export interface EnrollmentFilter {
  status__in?: string;
  start_date__gte?: string;
  end_date__lte?: string;
  performance__gte?: string;
  performance__lte?: string;
  search?: string;
  course_id?: string;
}

type PaginationParams = Pick<Page, 'page' | 'per_page'>;

@Injectable({ providedIn: 'root' })
export class EnrollmentsService {
  constructor(private _http: SmartzapAPI) {}

  buildSort({ field, direction }: { field: string; direction: SortDirection }): string {
    if (direction) {
      return `${direction === 'asc' ? '' : '-'}${field}`;
    }
    return '-created';
  }

  fetchEnrollments({
    pagination,
    sort,
    filter,
  }: {
    pagination: PaginationParams;
    sort?: string;
    filter?: EnrollmentFilter;
  }): Observable<CollectionResponse<Enrollment>> {
    const sanitizedFilter = Object.entries(filter || {}).reduce<Record<string, string>>((acc, [key, value]) => {
      if (value === undefined || value === null || value === '' || value === 'undefined' || value === 'null') {
        return acc;
      }

      if (key === 'search' && typeof value === 'string' && value.trim().length < 3) {
        return acc;
      }

      acc[key] = typeof value === 'string' ? value.trim() : value;
      return acc;
    }, {});

    const params: Record<string, string> = {
      page: pagination.page.toString(),
      per_page: pagination.per_page.toString(),
      ...sanitizedFilter,
    };

    if (sort) params['sort'] = sort;

    return this._http.get<CollectionApiResponse<Enrollment>>('/enrollment', params).pipe(
      map(({ count, per_page, page, total_pages, result: collection }) => ({
        page: { count, per_page, page, total_pages },
        collection,
      })),
    );
  }

  delete(enrollmentId: string): Observable<void> {
    return this._http.delete<void>(`/enrollment/${enrollmentId}`);
  }

  cancel(enrollmentId: string): Observable<Enrollment> {
    return this._http.patch<Enrollment>(`/enrollment/${enrollmentId}`, { status: 'CANCELED' });
  }

  create({ userId, courseId }: { userId: string; courseId: string }): Observable<Enrollment> {
    return this._http.post<Enrollment>('/enrollment', { user_id: userId, course_id: courseId });
  }

  fetchTracking(enrollmentId: string): Observable<Tracking[]> {
    return this._http
      .get<CollectionApiResponse<Tracking>>(`/enrollment/${enrollmentId}/tracking`)
      .pipe(map((response) => response.result));
  }

  renewContentAccess({ contentId, enrollmentId }: { enrollmentId: string; contentId: string }): Observable<void> {
    return this._http.post(`/content/${contentId}/enrollment/${enrollmentId}/renew-access`, null);
  }

  countSentMessages({
    startDate,
    endDate,
  }: {
    startDate?: string;
    endDate?: string;
  } = {}): Observable<number> {
    const params: Record<string, string> = {};
    if (startDate) params['send_date__gte'] = startDate;
    if (endDate) params['send_date__lte'] = endDate;
    return this._http
      .get<{ messages_sent_count: number }>('/schedule/sent-messages-count', params)
      .pipe(map(({ messages_sent_count }) => messages_sent_count));
  }

  countPendingMessages(): Observable<number> {
    return this._http
      .get<{ message_pending_count: number }>('/enrollment/messages-pending-count')
      .pipe(map(({ message_pending_count }) => message_pending_count));
  }

  countTotalUsers(): Observable<number> {
    return this._http.get<{ users_count: number }>('/user/count').pipe(map(({ users_count }) => users_count));
  }

  countEnrollmentsByStatus(): Observable<{ started: number; waiting: number }> {
    return this._http
      .get<{ started_count: number; waiting_count: number }>('/enrollment/status-count')
      .pipe(map(({ started_count, waiting_count }) => ({ started: started_count, waiting: waiting_count })));
  }
}
