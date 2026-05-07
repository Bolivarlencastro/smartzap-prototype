import { inject } from '@angular/core';
import { CanMatchFn, Router } from '@angular/router';
import { EnrollmentsService } from 'app/main/enrollments/services/enrollments.service';
import { environment } from 'environments/environment';

export const learningTrailsEnrollmentsGuard: CanMatchFn = (_route, _state) => {
  const enrollmentsService = inject(EnrollmentsService);
  const router = inject(Router);

  const canMatch = enrollmentsService.hasService('learningTrail');
  return canMatch || router.parseUrl(environment.routeHome);
};
