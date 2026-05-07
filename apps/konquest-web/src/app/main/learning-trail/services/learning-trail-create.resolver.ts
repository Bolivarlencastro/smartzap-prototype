import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { LearningTrailAPI } from '@core/api/learning-trail.api';
import { AuthService } from '@keeps-platform-frontend-workspace/kp-keeps';
import { KpMessageService } from '@keeps-platform-frontend-workspace/ui/kp-message-service';
import { catchError, map } from 'rxjs/operators';

@Injectable()
export class LearningTrailCreateResolver {
  constructor(
    private _service: LearningTrailAPI,
    private _router: Router,
    private _authService: AuthService,
    private _messageService: KpMessageService,
  ) {}

  resolve(route: ActivatedRouteSnapshot): any {
    return this._service.getById(route.params['id']).pipe(
      map((learningTrail) => this.setOwner(learningTrail)),
      catchError((error) => this.handleError(error)),
    );
  }

  private setOwner(learningTrail: any): any {
    const userCreatorId = learningTrail.user_creator.id;
    const userId = this._authService.userId;
    const isOwner = userCreatorId === userId;
    return { ...learningTrail, isOwner };
  }

  private handleError(error: Error): any {
    this._messageService.info('LEARNING_TRAIL.INFO.LEARNING_TRAIL_NOT_FOUND');
    this._router.navigate(['/learning-trails']);
    return error;
  }
}
