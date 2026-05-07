jest.mock('@keeps-platform-frontend-workspace/ui/constants', () => ({
  constants: { defaultPageSizeOptions: [10, 25, 50, 100] },
}));

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PageEvent } from '@angular/material/paginator';
import { Sort } from '@angular/material/sort';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { CourseListActions, courseListInitialState, COURSES_LIST_FEATURE_KEY } from '../../store/course';
import { getTranslocoTestingModule } from '../../transloco-testing.module';
import { CoursesComponent } from './courses.component';

describe('CoursesComponent', () => {
  let component: CoursesComponent;
  let fixture: ComponentFixture<CoursesComponent>;
  let store: MockStore;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CoursesComponent, getTranslocoTestingModule()],
      providers: [provideMockStore({ initialState: { [COURSES_LIST_FEATURE_KEY]: courseListInitialState } })],
    }).compileComponents();

    store = TestBed.inject(MockStore);
    jest.spyOn(store, 'dispatch');

    fixture = TestBed.createComponent(CoursesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should dispatch init action on init', () => {
    expect(store.dispatch).toHaveBeenCalledWith(CourseListActions.init());
  });

  it('should dispatch search action', () => {
    const search = 'test';
    component.onFilterChange(search);
    expect(store.dispatch).toHaveBeenCalledWith(CourseListActions.search({ search }));
  });

  it('should dispatch sort action', () => {
    const sort: Sort = { active: 'name', direction: 'asc' };
    component.onSort(sort);
    expect(store.dispatch).toHaveBeenCalledWith(CourseListActions.sort({ sort }));
  });

  it('should dispatch setPagination action', () => {
    const event = { pageIndex: 1, pageSize: 25 } as PageEvent;
    component.onPageChange(event);
    expect(store.dispatch).toHaveBeenCalledWith(
      CourseListActions.setPagination({
        page: 2,
        per_page: 25,
      }),
    );
  });
});
