import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import { EMPTY, Observable, of, throwError } from 'rxjs';
import { TransferService } from '../../services/transfer.service';
import * as fromActions from '../actions/transfer.actions';
import { featureKey, initialState } from '../reducers/transfer.reducer';
import { TransferEffects } from './transfer.effects';

describe('TransferEffects', () => {
  let actions$: Observable<Action>;
  let effects: TransferEffects;
  let transfersService: TransferService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        TransferEffects,
        provideMockActions(() => actions$),
        provideMockStore({ initialState: { [featureKey]: initialState } }),
        {
          provide: TransferService,
          useValue: {
            fetch: jest.fn(),
            confirmCancel: jest.fn(),
            openFilters: jest.fn().mockReturnValue(of(EMPTY)),
            normalizeDialogFilterToRequest: jest.fn().mockReturnValue(undefined),
          },
        },
      ],
    }).compileComponents();
    effects = TestBed.inject(TransferEffects);
    transfersService = TestBed.inject(TransferService);
  });

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  describe('loadTransfers$', () => {
    it('should return loadTransfersSuccess action when load succeeds', (done) => {
      actions$ = of(fromActions.loadTransfers());
      jest.spyOn(transfersService, 'fetch').mockReturnValue(
        of({
          count: 0,
          next: '',
          previous: '',
          results: [],
        }),
      );

      effects.loadTransfers$.subscribe((action) => {
        expect(transfersService.fetch).toHaveBeenCalled();
        expect(action.type).toEqual(fromActions.loadTransfersSuccess.type);
        done();
      });
    });

    it('should return failure action when could not load transfers', (done) => {
      actions$ = of(fromActions.loadTransfers());
      jest.spyOn(transfersService, 'fetch').mockReturnValue(throwError('error'));

      effects.loadTransfers$.subscribe((action) => {
        expect(transfersService.fetch).toHaveBeenCalled();
        expect(action.type).toEqual(fromActions.loadTransfersFailure.type);
        done();
      });
    });
  });

  describe('setPage$', () => {
    it('should return loadTransfers action', (done) => {
      actions$ = of(fromActions.setPage({ page: 1 }));

      effects.setPage$.subscribe((action) => {
        expect(action.type).toEqual(fromActions.loadTransfers.type);
        done();
      });
    });
  });

  describe('setSearch$', () => {
    it('should reset page with setPage action', (done) => {
      actions$ = of(fromActions.setSearch({ search: 'testing' }));

      effects.setSearch$.subscribe((action) => {
        expect(action.type).toEqual(fromActions.setPage.type);
        done();
      });
    });
  });

  describe('setSort$', () => {
    it('should reset page with setPage action', (done) => {
      actions$ = of(fromActions.setSort({ sort: { field: 'name', direction: 'asc' } }));

      effects.setSort$.subscribe((action) => {
        expect(action.type).toEqual(fromActions.setPage.type);
        done();
      });
    });
  });

  describe('deleteTransfer$', () => {
    it('should return deleteTransferSuccess action when delete succeeds', (done) => {
      const id = 'id';
      actions$ = of(fromActions.deleteTransfer({ id }));
      jest.spyOn(transfersService, 'confirmCancel').mockReturnValue(of(undefined));

      effects.deleteTransfer$.subscribe((action) => {
        expect(transfersService.confirmCancel).toHaveBeenCalledWith(id);
        expect(action.type).toEqual(fromActions.deleteTransferSuccess.type);
        done();
      });
    });

    it('should return failure action when could not delete transfer', (done) => {
      const id = 'id';
      actions$ = of(fromActions.deleteTransfer({ id }));
      jest.spyOn(transfersService, 'confirmCancel').mockReturnValue(throwError('error'));

      effects.deleteTransfer$.subscribe((action) => {
        expect(transfersService.confirmCancel).toHaveBeenCalledWith(id);
        expect(action.type).toEqual(fromActions.deleteTransferFailure.type);
        done();
      });
    });
  });

  describe('setPagination$', () => {
    it('should return loadTransfers action', (done) => {
      actions$ = of(fromActions.paginationChange({ page: 1, perPage: 10 }));

      effects.setPagination$.subscribe((action) => {
        expect(action.type).toEqual(fromActions.loadTransfers.type);
        done();
      });
    });
  });

  describe('setFilter$', () => {
    it('should return setPage action', (done) => {
      actions$ = of(fromActions.setFilters({ filter: { owner: 'test' } }));

      effects.setFilter$.subscribe((action) => {
        expect(action.type).toEqual(fromActions.setPage.type);
        done();
      });
    });
  });
});
