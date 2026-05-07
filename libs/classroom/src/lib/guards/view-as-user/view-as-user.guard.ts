import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { ClassroomFacade } from '../../facades';
import { Course, UserProfileService } from '@keeps-platform-frontend-workspace/kp-keeps';
import { filter, map } from 'rxjs/operators';
import { Observable, zip } from 'rxjs';

export const viewAsUserGuard: CanActivateFn = (route, _state) => {
  const router = inject(Router);
  const classroomFacade = inject<ClassroomFacade>(ClassroomFacade);
  const userProfileService = inject<UserProfileService>(UserProfileService);
  const courseId = route.paramMap.get('id');
  const rollbackPath = route.queryParamMap.get('rollbackPath');
  classroomFacade.loadCourse(courseId, rollbackPath, true);
  const course$ = classroomFacade.course$.pipe(filter((course) => !!course?.id));
  const isAdmin$ = createAdminStream(userProfileService);
  return waitForLoadAndExecuteCheck(course$, isAdmin$, router, classroomFacade);
};

/**
 * Returns an observable that emits as soon as the current user is defined returning true if he has one of the admin roles
 */
function createAdminStream(userProfileService: UserProfileService) {
  return userProfileService.roles$.pipe(
    filter((roles) => !!roles.length),
    map(() => userProfileService.isAdmin()),
  );
}

/**
 * Returns an observable that emits as soon as the course finishes loading lets us know if the current user is an admin or not
 * @returns true if the user can view the course as a user or an urlTree redirecting to the course details dialog
 */
function waitForLoadAndExecuteCheck(
  course: Observable<Course>,
  isAdmin: Observable<boolean>,
  router: Router,
  classroomFacade: ClassroomFacade,
) {
  return zip([course, isAdmin]).pipe(
    map(([course, isAdmin]) => {
      const canAccess = course.is_owner || course.is_contributor || isAdmin;

      if (canAccess) {
        return true;
      }

      classroomFacade.clearCourse();
      return router.parseUrl(`C/${course.id}?rti=true`);
    }),
  );
}
