import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { EnrollmentsService } from 'app/main/enrollments/services/enrollments.service';

export const missionEnrollmentsGuard: CanActivateFn = (_route, _state) => {
  const enrollmentsService = inject(EnrollmentsService);
  const router = inject(Router);

  const canMatch = enrollmentsService.hasService('mission');
  return canMatch || router.parseUrl('/enrollments/learning-trails');
};
