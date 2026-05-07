import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { EnrollmentsFilterComponent } from './enrollments-filter.component';
import { EnrollmentType } from './model/enrollment-filter';
import { EnrollmentsFilterActions, enrollmentsFilterInitialState } from './store';
import { EnrollmentsFilterService } from './services/enrollments-filter.service';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { getTranslocoTestingModule } from '@core/utils/transloco-testing.module';

describe('EnrollmentsFilterComponent', () => {
  let component: EnrollmentsFilterComponent;
  let fixture: ComponentFixture<EnrollmentsFilterComponent>;
  let store: MockStore;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EnrollmentsFilterComponent, getTranslocoTestingModule()],
      providers: [
        provideMockStore({ initialState: { ['enrollmentsFilter']: enrollmentsFilterInitialState } }),
        { provide: EnrollmentsFilterService, useValue: { getStatusOptions: jest.fn() } },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    store = TestBed.inject(MockStore);
    fixture = TestBed.createComponent(EnrollmentsFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeDefined();
  });

  it('should dispatch event to open filters modal', () => {
    const spy = jest.spyOn(store, 'dispatch');
    const enrollmentType: EnrollmentType = 'MISSION';
    fixture.componentRef.setInput('type', enrollmentType);
    fixture.detectChanges();

    component.openFiltersModal();
    expect(spy).toHaveBeenCalledWith(EnrollmentsFilterActions.openFilterDialog({ enrollmentType }));
  });

  it('should dispatch action to filter list', () => {
    const spy = jest.spyOn(store, 'dispatch');
    const enrollmentType: EnrollmentType = 'MISSION';
    const filterValue = { performance__gte: '56', performance__lte: '98' };
    fixture.componentRef.setInput('type', enrollmentType);
    component.filterForm.patchValue(filterValue);
    fixture.detectChanges();

    component.onFilter();
    expect(spy).toHaveBeenCalledWith(
      EnrollmentsFilterActions.storeFilterControllerState({
        enrollmentType: enrollmentType,
        filterState: {
          filter: {
            ...filterValue,
            status: null,
            start_date__gte: null,
            start_date__lte: null,
            end_date__gte: null,
            end_date__lte: null,
          },
        },
      }),
    );
  });
});
