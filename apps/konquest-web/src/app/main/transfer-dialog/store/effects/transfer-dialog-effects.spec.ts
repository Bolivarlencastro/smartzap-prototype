import { TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { initialState, transferDialogFeatureKey } from '../index';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable } from 'rxjs';
import { Action } from '@ngrx/store';
import { TransferDialogService } from '../../services/transfer-dialog.service';
import { TransferDialogEffects } from './transfer-dialog-effects';

describe('TransferDialogEffects', () => {
  let actions$: Observable<Action>;
  let effects: TransferDialogEffects;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        TransferDialogEffects,
        provideMockActions(() => actions$),
        provideMockStore({ initialState: { [transferDialogFeatureKey]: initialState } }),
        {
          provide: TransferDialogService,
          useValue: {},
        },
      ],
    }).compileComponents();
    effects = TestBed.inject(TransferDialogEffects);
  });

  it('should create', () => {
    expect(effects).toBeTruthy();
  });
});
