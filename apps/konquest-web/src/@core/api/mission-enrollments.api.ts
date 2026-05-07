import { Injectable } from '@angular/core';
import { Pagination } from '@core/model';
import { Enrollment, EnrollmentTracking } from '@core/model/enrollment.model';
import { Observable } from 'rxjs';
import { KonquestAPI } from './base';

const BASE_PATH = '/mission-enrollments';

@Injectable({ providedIn: 'root' })
export class MissionEnrollmentsAPI {
  constructor(private _http: KonquestAPI) {}

  fetchAll(): Observable<Pagination<Enrollment>> {
    return this._http.get(`${BASE_PATH}/`);
  }

  fetchById(id: string): Observable<Enrollment> {
    return this._http.get(`${BASE_PATH}/${id}`);
  }

  fetchByQuery(queryParams?: Record<string, unknown>): Observable<Pagination<Enrollment>> {
    return this._http.get(`${BASE_PATH}`, queryParams);
  }

  fetchTracking(id: string): Observable<EnrollmentTracking[]> {
    return this._http.get(`${BASE_PATH}/${id}/tracking`);
  }

  deleteEnrollment(id: string): Observable<unknown> {
    return this._http.delete(`${BASE_PATH}/${id}`);
  }

  approveEnrollment(id: string, performance: number): Observable<unknown> {
    return this._http.post(`${BASE_PATH}/${id}/manual-finish`, {
      performance,
    });
  }

  changePerformance(id: string, performance: number): Observable<Enrollment> {
    return this._http.post(`${BASE_PATH}/${id}/change-performance`, {
      performance,
    });
  }

  restartEnrollment(id: string, goal_date): Observable<Enrollment> {
    return this._http.post(`${BASE_PATH}/${id}/restart`, {
      goal_date,
    });
  }

  extendGoalDate(id: string, new_goal_date: string): Observable<unknown> {
    return this._http.post(`${BASE_PATH}/${id}/extend-deadline`, {
      new_goal_date,
    });
  }

  requestExtendDeadline(id: string): Observable<unknown> {
    return this._http.post(`${BASE_PATH}/${id}/request-extension`, {});
  }

  giveUp(id: string, message: string): Observable<Enrollment> {
    return this._http.patch<Enrollment>(`${BASE_PATH}/${id}/give-up`, {
      give_up_comment: message,
    });
  }

  externalValidate(
    id: string,
    approved: boolean,
    reject_comment: string | null,
    performance: string | null = null,
  ): Observable<any> {
    return this._http.post(`${BASE_PATH}/${id}/external-validate`, {
      performance,
      approved,
      reject_comment,
    });
  }

  setPresentialLiveApproval(enrollmentId: string, approved: boolean): Observable<any> {
    return this._http.post(`${BASE_PATH}/${enrollmentId}/approval`, { approved });
  }

  finishPresentialLiveEnrollment(enrollmentId: string): Observable<any> {
    return this._http.post(`${BASE_PATH}/${enrollmentId}/sync-finish`, null);
  }
}
