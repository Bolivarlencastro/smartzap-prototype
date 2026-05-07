import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { KonquestAPI } from '@core/api';
import { Pagination } from '@core/model';
import { EnrollmentTracking, TrackStep } from '@core/model/enrollment.model';
import { LearningTrailEnrollment, LearningTrailEnrollmentFilter } from 'app/main/learning-trail/model/learning-trail';
import { format } from 'date-fns';

const BASE_PATH = '/learning-trail-enrollments';

@Injectable({ providedIn: 'root' })
export class LearningTrailEnrollmentsAPI {
  constructor(private _http: KonquestAPI) {}

  deleteEnrollment(id: string): Observable<LearningTrailEnrollment> {
    return this._http.delete<LearningTrailEnrollment>(`${BASE_PATH}/${id}`);
  }

  approveEnrollment(id: string, performance: number): Observable<unknown> {
    return this._http.post(`${BASE_PATH}/${id}/manual-finish`, {
      performance,
    });
  }

  restartEnrollment(id: string, goal_date): Observable<LearningTrailEnrollment> {
    return this._http.post(`${BASE_PATH}/${id}/restart`, {
      goal_date,
    });
  }

  enroll(learning_trail: string, userId: string, goalDate?: string): Observable<LearningTrailEnrollment> {
    const parsedDate = new Date(goalDate);
    const body = {
      ...(goalDate && { goal_date: format(parsedDate, 'yyy-MM-dd') }),
      user: userId,
      learning_trail,
    };

    return this._http.post<LearningTrailEnrollment>(BASE_PATH, body);
  }

  enrollGiveUp(enrollmentId: string): Observable<LearningTrailEnrollment> {
    return this._http.post<LearningTrailEnrollment>(`${BASE_PATH}/${enrollmentId}/give-up`, {
      give_up_comment: 'Give Up',
    });
  }

  enrollRetake(enrollmentId: string, goal_date: string): Observable<LearningTrailEnrollment> {
    return this._http.post<LearningTrailEnrollment>(`${BASE_PATH}/${enrollmentId}/retake`, {
      goal_date,
    });
  }

  enrollGetCertificate(learningTrailId: string, userId: string): Observable<LearningTrailEnrollment> {
    return this._http.post<LearningTrailEnrollment>(`${BASE_PATH}/certificates`, {
      learning_trail_id: learningTrailId,
      user_id: userId,
    });
  }

  extendDeadline(enrollmentId: string, newGoalDate: string) {
    return this._http.post(`${BASE_PATH}/${enrollmentId}/extend-deadline`, { new_goal_date: newGoalDate });
  }

  fetchTracking(id: string): Observable<TrackStep[]> {
    return this._http.get(`${BASE_PATH}/${id}/tracking`);
  }

  fetchTrackingFromPulse(id: string, pulseId: string): Observable<EnrollmentTracking> {
    return this._http.get(`${BASE_PATH}/${id}/tracking/pulse/${pulseId}`);
  }

  getLearningTrailEnrollments(
    filters?: LearningTrailEnrollmentFilter,
  ): Observable<Pagination<LearningTrailEnrollment>> {
    return this._http.get<Pagination<LearningTrailEnrollment>>(`${BASE_PATH}`, filters);
  }

  getLearningTrailEnrollmentById(id: string): Observable<LearningTrailEnrollment> {
    return this._http.get<LearningTrailEnrollment>(`${BASE_PATH}/${id}`);
  }
}
