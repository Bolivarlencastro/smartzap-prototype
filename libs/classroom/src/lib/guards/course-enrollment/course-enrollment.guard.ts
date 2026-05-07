import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { inject } from '@angular/core';
import { Course, EnrollmentStatuses } from '@keeps-platform-frontend-workspace/kp-keeps';

import { filter, map } from 'rxjs/operators';
import { ClassroomFacade } from '../../facades';

const ALLOWED_ENROLLMENT_STATUS = [
  EnrollmentStatuses.ENROLLED,
  EnrollmentStatuses.STARTED,
  EnrollmentStatuses.COMPLETED,
];

export const courseEnrollmentGuard: CanActivateFn = (route, _state): Observable<boolean | UrlTree> => {
  const router = inject(Router);
  const classroomFacade = inject<ClassroomFacade>(ClassroomFacade);
  const courseId = route.paramMap.get('id');
  const rollbackPath = route.queryParamMap.get('rollbackPath');
  classroomFacade.loadCourse(courseId, rollbackPath);

  return classroomFacade.course$.pipe(
    filter((course) => !!course?.id),
    map((course) => checkAccess(course, router, classroomFacade)),
  );
};

function checkAccess(course: Course, router: Router, classroomFacade: ClassroomFacade): boolean | UrlTree {
  const isOwnerOrContributor = course.is_owner || course.is_contributor;
  if (isOwnerOrContributor) {
    return router.parseUrl(`view-as-user/${course.id}`);
  }

  const canAccess = ALLOWED_ENROLLMENT_STATUS.includes(course.enrollment?.status);
  if (!canAccess) {
    classroomFacade.clearCourse();
    return router.parseUrl(`C/${course.id}?rti=true`);
  }

  return true;
}
