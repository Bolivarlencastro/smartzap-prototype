import { Chance } from 'chance';
import { IntegrationCourseEvaluationStrategy } from './integration-course-evaluation-strategy.service';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { BellNotification } from '@core/model/notification';
import { IntegrationCourseEvaluationActions } from 'app/shared/store';

describe('IntegrationCourseEvaluationStrategy', () => {
  const chance = new Chance();
  let strategy: IntegrationCourseEvaluationStrategy;
  const routerStub = {} as Router;
  let storeMock: jest.Mocked<Store>;

  beforeEach(() => {
    storeMock = { dispatch: jest.fn() } as unknown as jest.Mocked<Store>;
    strategy = new IntegrationCourseEvaluationStrategy(routerStub, storeMock);
  });

  it('should dispatch the load course action', () => {
    const notification: BellNotification = {
      objectPk: chance.guid({ version: 4 }),
    } as BellNotification;
    strategy.navigate(notification);

    expect(storeMock.dispatch).toHaveBeenCalledWith(IntegrationCourseEvaluationActions.loadCourse({ notification }));
  });
});
