import { LedListActions, ledListInitialState, LEDS_LIST_FEATURE_KEY } from '../../store/led';

jest.mock('@keeps-platform-frontend-workspace/ui/constants', () => ({
  constants: { defaultPageSizeOptions: [10, 25, 50, 100] },
}));

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PageEvent } from '@angular/material/paginator';
import { Sort } from '@angular/material/sort';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { getTranslocoTestingModule } from '../../transloco-testing.module';
import { LedComponent } from './led.component';

describe('LedComponent', () => {
  let component: LedComponent;
  let fixture: ComponentFixture<LedComponent>;
  let store: MockStore;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LedComponent, getTranslocoTestingModule()],
      providers: [provideMockStore({ initialState: { [LEDS_LIST_FEATURE_KEY]: ledListInitialState } })],
    }).compileComponents();

    store = TestBed.inject(MockStore);
    jest.spyOn(store, 'dispatch');

    fixture = TestBed.createComponent(LedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should dispatch init action on init', () => {
    expect(store.dispatch).toHaveBeenCalledWith(LedListActions.init());
  });

  it('should dispatch search action', () => {
    const search = 'test';
    component.onFilterChange(search);
    expect(store.dispatch).toHaveBeenCalledWith(LedListActions.search({ search }));
  });

  it('should dispatch sort action', () => {
    const sort: Sort = { active: 'name', direction: 'asc' };
    component.onSort(sort);
    expect(store.dispatch).toHaveBeenCalledWith(LedListActions.sort({ sort }));
  });

  it('should dispatch setPagination action', () => {
    const event = { pageIndex: 1, pageSize: 25 } as PageEvent;
    component.onPageChange(event);
    expect(store.dispatch).toHaveBeenCalledWith(
      LedListActions.setPagination({
        page: 2,
        per_page: 25,
      }),
    );
  });
});
