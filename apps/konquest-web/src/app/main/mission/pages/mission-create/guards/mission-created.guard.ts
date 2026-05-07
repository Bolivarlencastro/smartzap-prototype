import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { selectRouteNestedParam } from 'app/shared/store';
import { map } from 'rxjs/operators';
import { MissionCreateService } from '../services/mission-create.service';

export const missionCreatedGuard: CanActivateFn = (_route, _state) => {
  const store = inject(Store);
  const router = inject(Router);

  return store.select(selectRouteNestedParam('mission-model-id')).pipe(
    map((missionModelOrId) => {
      if (MissionCreateService.checkIsMissionModel(missionModelOrId)) {
        return router.parseUrl('/missions');
      }
      return true;
    }),
  );
};
