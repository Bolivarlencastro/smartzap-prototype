import { Injectable } from '@angular/core';
import { KonquestClient } from './konquest.client';
import { EnrollmentResume } from '../models';
import { Observable } from 'rxjs';

const PATH = 'mission-enrollments';

@Injectable({
  providedIn: 'root',
})
export class CourseEnrollmentsApi {
  constructor(private _http: KonquestClient) {}

  finishCourseEnrollment(enrollmentId: string) {
    return this._http.post<EnrollmentResume>(`/${PATH}/${enrollmentId}/finish`, {});
  }

  updateGoalDate(enrollmentId: string, goal_date: Date) {
    return this._http.patch(`/${PATH}/${enrollmentId}`, { goal_date });
  }

  loadCertificate(enrollmentId: string): Observable<{ certificate_url: string }> {
    return this._http.post<{ certificate_url: string }>(`/${PATH}/${enrollmentId}/certificates`, {});
  }
}
