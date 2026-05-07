import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { EMPTY, Observable } from 'rxjs';

import { GroupMissionEffects } from './group-mission.effects';
import { GroupMissionAPI } from '../group-mission.api';
import { GenericErrorHandlerService } from 'app/shared/components/generic-error-handler';

describe('GroupMissionEffects', () => {
  const actions$: Observable<any> = EMPTY;
  let effects: GroupMissionEffects;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        GroupMissionEffects,
        provideMockActions(() => actions$),
        {
          provide: GroupMissionAPI,
          useValue: {},
        },
        {
          provide: GenericErrorHandlerService,
          useValue: {},
        },
      ],
    });

    effects = TestBed.inject(GroupMissionEffects);
  });

  it('should be created', () => {
    expect(effects).toBeTruthy();
  });
});
