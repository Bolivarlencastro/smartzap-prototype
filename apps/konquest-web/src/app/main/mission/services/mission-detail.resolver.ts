import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { KpMessageService } from '@keeps-platform-frontend-workspace/ui/kp-message-service';
import { Observable } from 'rxjs';
import { catchError, filter, take } from 'rxjs/operators';
import { Mission } from '../mission.model';
import { MissionDetailActions } from 'app/main/mission/pages/legacy-mission-detail/containers/mission-detail/store/actions';
import { MissionDetailSelectors } from 'app/main/mission/pages/legacy-mission-detail/containers/mission-detail/store/selectors';

@Injectable({ providedIn: 'root' })
export class MissionDetailResolver {
  constructor(
    private _router: Router,
    private _messageService: KpMessageService,
    private store: Store,
  ) {}

  resolve(route: ActivatedRouteSnapshot): Observable<Mission> {
    this.store.dispatch(MissionDetailActions.loadCourse({ id: route.params['id'] }));
    return this.store.select(MissionDetailSelectors.selectCourse).pipe(
      take(2),
      filter((mission) => !!mission),
      catchError((error) => this.handleError(error) as Observable<Mission>),
    );
  }

  private handleError(error: any): any {
    this._messageService.info('MISSION.INFO.MISSION_NOT_FOUND');
    this._router.navigate(['/', 'missions']);
    return error;
  }
}
