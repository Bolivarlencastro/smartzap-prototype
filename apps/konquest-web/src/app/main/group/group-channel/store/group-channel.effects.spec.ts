import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { EMPTY, Observable } from 'rxjs';

import { GroupChannelEffects } from './group-channel.effects';
import { GroupChannelAPI } from '../group-channel.api';
import { GenericErrorHandlerService } from 'app/shared/components/generic-error-handler';

describe('GroupChannelEffects', () => {
  const actions$: Observable<any> = EMPTY;
  let effects: GroupChannelEffects;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        GroupChannelEffects,
        provideMockActions(() => actions$),
        {
          provide: GroupChannelAPI,
          useValue: {},
        },
        { provide: GenericErrorHandlerService, useValue: {} },
      ],
    }).compileComponents();

    effects = TestBed.inject(GroupChannelEffects);
  });

  it('should be created', () => {
    expect(effects).toBeTruthy();
  });
});
