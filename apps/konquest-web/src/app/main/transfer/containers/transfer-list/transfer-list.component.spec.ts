import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PageEvent } from '@angular/material/paginator';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { Sort } from '@angular/material/sort';
import { initialState } from '../../store/reducers/transfer.reducer';
import { TransferListComponent } from './transfer-list.component';
import { TransfersActions, TransfersFiltersActions } from '../../store/actions';
import { getTranslocoTestingModule } from '@core/utils/transloco-testing.module';

describe('TransferListComponent', () => {
  let component: TransferListComponent;
  let fixture: ComponentFixture<TransferListComponent>;
  let store: MockStore;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TransferListComponent, getTranslocoTestingModule()],
      providers: [
        provideMockStore({
          initialState: { transfers: initialState },
        }),
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TransferListComponent);
    store = TestBed.inject(MockStore);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('onDelete', () => {
    it('should dispatch deleteTransfer action', () => {
      const transfer = { id: '1' } as any;
      const expectedAction = TransfersActions.deleteTransfer({ id: transfer.id });
      jest.spyOn(store, 'dispatch');

      component.onDelete(transfer);

      expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
    });
  });

  describe('onSort', () => {
    it('should dispatch sort action', () => {
      const sort = { active: 'name', direction: 'asc' } as Sort;
      const expectedAction = TransfersActions.setSort({ sort: { field: sort.active, direction: sort.direction } });
      jest.spyOn(store, 'dispatch');

      component.onSort(sort);

      expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
    });
  });

  describe('onPageChange', () => {
    it('should dispatch paginationChange action', () => {
      const pageChange = { pageIndex: 1, pageSize: 10 } as PageEvent;
      const expectedAction = TransfersActions.paginationChange({ page: 2, perPage: 10 });
      jest.spyOn(store, 'dispatch');

      component.onPageChange(pageChange);

      expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
    });
  });

  it('should dispatch action to filter by input', () => {
    const spy = jest.spyOn(store, 'dispatch');
    const search = 'test';
    component.onFilterByInput(search);
    expect(spy).toHaveBeenCalledWith(TransfersActions.setSearch({ search }));
  });

  it('should dispatch action to open filter modal', () => {
    const spy = jest.spyOn(store, 'dispatch');
    component.openFilters();
    expect(spy).toHaveBeenCalledWith(TransfersFiltersActions.openFilterDialog());
  });
});
