import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PulsesComponent } from './pulses.component';
import { getTranslocoTestingModule } from '../../transloco-testing.module';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { PulseListActions, pulseListInitialState, PULSES_LIST_FEATURE_KEY } from '../../store/pulse';
import { Sort } from '@angular/material/sort';
import { PageEvent } from '@angular/material/paginator';

jest.mock('@keeps-platform-frontend-workspace/ui/constants', () => ({
  constants: { defaultPageSizeOptions: [10, 25, 50, 100] },
}));

describe('PulsesComponent', () => {
  let component: PulsesComponent;
  let fixture: ComponentFixture<PulsesComponent>;
  let store: MockStore;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PulsesComponent, getTranslocoTestingModule()],
      providers: [provideMockStore({ initialState: { [PULSES_LIST_FEATURE_KEY]: pulseListInitialState } })],
    }).compileComponents();

    store = TestBed.inject(MockStore);
    jest.spyOn(store, 'dispatch');

    fixture = TestBed.createComponent(PulsesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should dispatch init action on init', () => {
    expect(store.dispatch).toHaveBeenCalledWith(PulseListActions.init());
  });

  it('should dispatch search action', () => {
    const search = 'test';
    component.onFilterChange(search);
    expect(store.dispatch).toHaveBeenCalledWith(PulseListActions.search({ search }));
  });

  it('should dispatch sort action', () => {
    const sort: Sort = { active: 'name', direction: 'asc' };
    component.onSort(sort);
    expect(store.dispatch).toHaveBeenCalledWith(PulseListActions.sort({ sort }));
  });

  it('should dispatch setPagination action', () => {
    const event = { pageIndex: 1, pageSize: 25 } as PageEvent;
    component.onPageChange(event);
    expect(store.dispatch).toHaveBeenCalledWith(
      PulseListActions.setPagination({
        page: 2,
        per_page: 25,
      }),
    );
  });
});
