import { Injectable } from '@angular/core';
import { AbstractNotificationRouteStrategy } from './notification-route-strategy';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';
import { BellNotification } from '@core/model/notification';
import { IntegrationCourseEvaluationActions } from 'app/shared/store';

@Injectable()
export class IntegrationCourseEvaluationStrategy extends AbstractNotificationRouteStrategy {
  constructor(
    protected router: Router,
    private store: Store,
  ) {
    super(router);
  }

  navigate(notification?: BellNotification) {
    this.store.dispatch(IntegrationCourseEvaluationActions.loadCourse({ notification }));
  }
}
