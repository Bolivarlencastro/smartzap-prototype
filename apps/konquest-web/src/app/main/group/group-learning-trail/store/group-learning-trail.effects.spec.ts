import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { EMPTY, Observable } from 'rxjs';

import { GroupLearningTrailEffects } from './group-learning-trail.effects';
import { GroupLearningTrailAPI } from '../group-learning-trail.api';
import { GenericErrorHandlerService } from 'app/shared/components/generic-error-handler';

describe('GroupLearningTrailEffects', () => {
  const actions$: Observable<any> = EMPTY;
  let effects: GroupLearningTrailEffects;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        GroupLearningTrailEffects,
        provideMockActions(() => actions$),
        {
          provide: GroupLearningTrailAPI,
          useValue: {},
        },
        {
          provide: GenericErrorHandlerService,
          useValue: {},
        },
      ],
    });

    effects = TestBed.inject(GroupLearningTrailEffects);
  });

  it('should be created', () => {
    expect(effects).toBeTruthy();
  });
});
