import { TestBed } from '@angular/core/testing';
import { Action } from '@ngrx/store';
import { provideMockActions } from '@ngrx/effects/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { Observable, of, throwError } from 'rxjs';
import { BillingService } from '../../services/billing.service';
import { BillingEffects } from './billing.effects';
import { initialState } from '../reducers/billing.reducer';
import { BillingActions } from '../actions';

class BillingServiceMock {
  fetchBilling(_workspaceId: string): Observable<any> {
    return of({});
  }
}

describe('BillingEffects', () => {
  let actions$: Observable<Action>;
  let effects: BillingEffects;
  let billingService: BillingService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        BillingEffects,
        provideMockActions(() => actions$),
        provideMockStore({ initialState }),
        {
          provide: BillingService,
          useClass: BillingServiceMock,
        },
      ],
    }).compileComponents();
    effects = TestBed.inject(BillingEffects);
    billingService = TestBed.inject(BillingService);
  });

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  describe('loadBilling$', () => {
    it('should fire action when load billing succeeds', (done) => {
      const workspaceId = 'workspace-id';
      actions$ = of(BillingActions.loadBilling({ workspaceId }));
      jest.spyOn(billingService, 'fetchBilling');

      effects.loadBilling$.subscribe((action) => {
        expect(action.type).toEqual(BillingActions.loadBillingSuccess.type);
        done();
      });
    });

    it('should fire failure action when could not load billing', (done) => {
      const workspaceId = 'workspace-id';
      actions$ = of(BillingActions.loadBilling({ workspaceId }));
      jest.spyOn(billingService, 'fetchBilling').mockReturnValue(throwError('error'));

      effects.loadBilling$.subscribe((action) => {
        expect(action.type).toEqual(BillingActions.loadBillingFailure.type);
        done();
      });
    });
  });
});
