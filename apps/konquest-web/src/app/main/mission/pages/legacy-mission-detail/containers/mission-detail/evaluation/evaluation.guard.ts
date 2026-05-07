import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { UserProfileService } from '@keeps-platform-frontend-workspace/kp-keeps';
import { MissionServiceV2 } from 'app/main/mission/services/mission.service';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { navigateToMission } from 'app/shared/services';

@Injectable({
  providedIn: 'root',
})
export class MissionEvaluationsGuard {
  constructor(
    private _missionService: MissionServiceV2,
    private _router: Router,
    private _userProfileService: UserProfileService,
  ) {}

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {
    const id = route.params['id'] ?? route.parent?.params['id'];
    return this._missionService.fetchMissionById(id).pipe(
      map((mission) => (mission.required_evaluation ? this._userProfileService.isCurator() : false)),
      tap((isAdminAndRequiredEvaluation) => this.navigation(isAdminAndRequiredEvaluation, id)),
    );
  }

  private navigation(isAdminAndRequiredEvaluation: boolean, id: string) {
    if (!isAdminAndRequiredEvaluation) {
      navigateToMission(this._router, id, false);
    }
  }
}
