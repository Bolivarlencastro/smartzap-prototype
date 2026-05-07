import { Injectable } from '@angular/core';
import { EnrollmentStatuses } from '@keeps-platform-frontend-workspace/kp-keeps';
import { delay, Observable, of } from 'rxjs';
import { Enrollment } from '../models/enrollment';

const COURSE_ENROLLMENTS_MOCK = of([
  {
    learn_content_name: 'Curso 1',
    id: '1',
    learn_content_type: 'course',
    status: EnrollmentStatuses.ENROLLED,
    progress: 0.5,
    required: false,
    normative: false,
    goal_date: null,
    performance: 0.5,
  },
  {
    learn_content_name: 'Curso 2',
    id: '2',
    learn_content_type: 'course',
    status: EnrollmentStatuses.STARTED,
    progress: 0.5,
    required: true,
    normative: false,
    goal_date: '2025-12-15',
    performance: 0.5,
  },
  {
    learn_content_name: 'Curso 3',
    id: '3',
    learn_content_type: 'course',
    status: EnrollmentStatuses.COMPLETED,
    progress: 0.5,
    required: false,
    normative: true,
    goal_date: '2025-12-15',
    performance: 0.5,
  },
] as Enrollment[]).pipe(delay(1000));

@Injectable({
  providedIn: 'root',
})
export class LedEnrollmentsService {
  getCoursesEnrollments(_userId: string): Observable<Enrollment[]> {
    return COURSE_ENROLLMENTS_MOCK;
  }

  getTrailsEnrollments(_userId: string): Observable<Enrollment[]> {
    return of([
      {
        learn_content_name: 'Trilha 1',
        id: '1',
        learn_content_type: 'trail',
        status: EnrollmentStatuses.ENROLLED,
        progress: 0.5,
        required: false,
        normative: false,
        goal_date: null,
        performance: 0.5,
      },
      {
        learn_content_name: 'Trilha 2',
        id: '2',
        learn_content_type: 'trail',
        status: EnrollmentStatuses.STARTED,
        progress: 0.5,
        required: true,
        normative: false,
        goal_date: '2025-12-15',
        performance: 0.5,
      },
      {
        learn_content_name: 'Trilha 3',
        id: '3',
        learn_content_type: 'trail',
        status: EnrollmentStatuses.COMPLETED,
        progress: 0.5,
        required: false,
        normative: true,
        goal_date: '2025-12-15',
        performance: 0.5,
      },
    ] as Enrollment[]).pipe(delay(1000));
  }

  getCoursesEnrollmentsByTrailId(_trailId: string): Observable<Enrollment[]> {
    return COURSE_ENROLLMENTS_MOCK;
  }
}
