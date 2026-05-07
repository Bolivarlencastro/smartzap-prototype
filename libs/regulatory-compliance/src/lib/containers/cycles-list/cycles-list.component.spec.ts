import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PageEvent } from '@angular/material/paginator';
import { CycleDto } from '@keeps-platform-frontend-workspace/kp-keeps';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { getTranslocoTestingModule } from '../../helpers/transloco-testing.module';
import { CycleCreateActions, CyclesListActions, ComplianceDialogActions } from '../../store/actions';
import { cyclesListFeature, cyclesListInitialState } from '../../store/features';
import { CyclesListComponent } from './cycles-list.component';

describe('CyclesListComponent', () => {
  let component: CyclesListComponent;
  let fixture: ComponentFixture<CyclesListComponent>;
  let store: MockStore;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CyclesListComponent, getTranslocoTestingModule()],
      providers: [provideMockStore({ initialState: { [cyclesListFeature.name]: cyclesListInitialState } })],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    store = TestBed.inject(MockStore);
    jest.spyOn(store, 'dispatch');

    fixture = TestBed.createComponent(CyclesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('constructor', () => {
    it('should dispatch loadCycles on construction', () => {
      expect(store.dispatch).toHaveBeenCalledWith(CyclesListActions.loadCycles());
    });
  });

  describe('createCycle', () => {
    it('should dispatch openNewCycleDialog', () => {
      component.createCycle();
      expect(store.dispatch).toHaveBeenCalledWith(CycleCreateActions.openNewCycleDialog());
    });
  });

  describe('editCycle', () => {
    it('should dispatch openEditCycleDialog with the cycle', () => {
      const cycle = { id: 'cycle-1' } as CycleDto;

      component.editCycle(cycle);

      expect(store.dispatch).toHaveBeenCalledWith(CycleCreateActions.openEditCycleDialog({ cycle }));
    });
  });

  describe('deleteCycle', () => {
    it('should dispatch deleteCycle with the ids', () => {
      const ids = ['id-1', 'id-2'];

      component.deleteCycle(ids);

      expect(store.dispatch).toHaveBeenCalledWith(CyclesListActions.deleteCycle({ ids }));
    });
  });

  describe('openComplianceDialog', () => {
    it('should dispatch openDialog', () => {
      component.openComplianceDialog();
      expect(store.dispatch).toHaveBeenCalledWith(ComplianceDialogActions.openDialog());
    });
  });

  describe('onPageChange', () => {
    it('should dispatch setPagination with page = pageIndex + 1', () => {
      const event: PageEvent = { pageIndex: 2, pageSize: 25, length: 100 };

      component.onPageChange(event);

      expect(store.dispatch).toHaveBeenCalledWith(
        CyclesListActions.setPagination({ pagination: { page: 3, perPage: 25 } }),
      );
    });
  });

  describe('searchCycles', () => {
    it('should dispatch setFilter with the search term', () => {
      component.searchCycles('mock_search');

      expect(store.dispatch).toHaveBeenCalledWith(CyclesListActions.setFilter({ filter: { search: 'mock_search' } }));
    });
  });
});
