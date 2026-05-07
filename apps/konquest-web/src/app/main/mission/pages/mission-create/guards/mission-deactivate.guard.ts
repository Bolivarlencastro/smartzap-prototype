import { inject } from '@angular/core';
import { CanDeactivateFn, Router } from '@angular/router';
import { marker } from '@jsverse/transloco-keys-manager/marker';
import { TranslocoService } from '@jsverse/transloco';

export interface MissionCreationDeactivate {
  canDeactivate: () => boolean;
}

const LEAVE_MESSAGE = marker('MISSION.CREATE.LEAVE_CONFIRMATION');

export const missionDeactivateGuard: CanDeactivateFn<MissionCreationDeactivate> = (component) => {
  const translateService = inject(TranslocoService);
  const router = inject(Router);
  const routeState = router.currentNavigation().extras.state;

  if (routeState?.['missionSaved'] || component.canDeactivate()) {
    return true;
  }

  return confirm(translateService.translate(LEAVE_MESSAGE));
};
