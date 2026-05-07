import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { MatIconTestingModule } from '@angular/material/icon/testing';
import { PageEvent } from '@angular/material/paginator';
import { SortDirection } from '@angular/material/sort';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { provideRouter, Router } from '@angular/router';
import { AuthService, UserProfileService } from '@keeps-platform-frontend-workspace/kp-keeps';
import { Course } from '@app/main/courses/model';
import { CoursesActions } from '@app/main/courses/store/actions';
import { CoursesFilter } from '@app/main/courses/store/reducers/courses.reducer';
import { CoursesSelectors } from '@app/main/courses/store/selectors';
import { ReportActions } from '@app/shared/store/actions';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { of } from 'rxjs';
import { getTranslocoTestingModule } from 'app/shared/test/transloco-testing.module';
import { CoursesComponent } from './courses.component';

describe('CoursesComponent', () => {
  let component: CoursesComponent;
  let fixture: ComponentFixture<CoursesComponent>;
  let store: MockStore;
  let router: Router;
  let dialogMock: { open: jest.Mock };

  const authServiceMock = { userId: 'user-1' };
  const userProfileServiceMock = {
    isAdmin: jest.fn().mockReturnValue(false),
  };

  beforeEach(async () => {
    dialogMock = {
      open: jest.fn().mockReturnValue({
        componentInstance: {},
        afterClosed: () => of(false),
      }),
    };

    await TestBed.configureTestingModule({
      imports: [CoursesComponent, getTranslocoTestingModule(), MatIconTestingModule],
      schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        provideNoopAnimations(),
        provideRouter([]),
        { provide: AuthService, useValue: authServiceMock },
        { provide: UserProfileService, useValue: userProfileServiceMock },
        { provide: MatDialog, useValue: dialogMock },
        provideMockStore({
          selectors: [{ selector: CoursesSelectors.selectCourses, value: [] }],
          initialState: {},
        }),
      ],
    }).compileComponents();

    store = TestBed.inject(MockStore);
    jest.spyOn(store, 'dispatch');

    router = TestBed.inject(Router);
    jest.spyOn(router, 'navigate').mockResolvedValue(true);

    fixture = TestBed.createComponent(CoursesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should route to form on edit action', () => {
    const course = { id: '1', user_creator: { id: 'user-1' } } as Course;

    component.onCourseAction({ action: 'edit', course });

    expect(router.navigate).toHaveBeenCalledWith(['/courses', '1', 'form']);
  });

  it('should dispatch report generation', () => {
    const course = { id: '1', user_creator: { id: 'user-1' } } as Course;

    component.onCourseAction({ action: 'report', course, reportType: 'ACTIVITY' });

    expect(store.dispatch).toHaveBeenCalledWith(ReportActions.generateReport({ id: '1', reportType: 'ACTIVITY' }));
  });

  it('should search', () => {
    const term = 'test';
    component.onSearch(term);
    expect(store.dispatch).toHaveBeenCalledWith(CoursesActions.searchCourses({ term }));
  });

  it('should filter', () => {
    const filters: CoursesFilter = {
      languages: [],
      categories: [],
      statuses: [],
    };
    component.onFilter(filters);
    expect(store.dispatch).toHaveBeenCalledWith(CoursesActions.setFilter({ filters }));
  });

  it('should change page', () => {
    const pageEvent: PageEvent = {
      pageIndex: 1,
      pageSize: 10,
      length: 80,
    };
    component.onPageChange(pageEvent);
    expect(store.dispatch).toHaveBeenCalledWith(CoursesActions.setPagination({ currentPage: 2, per_page: 10 }));
  });

  it('should sort', () => {
    const active = 'name';
    const direction = 'desc' as SortDirection;
    component.onSort({ active, direction });
    expect(store.dispatch).toHaveBeenCalledWith(CoursesActions.setSort({ sort: { field: active, direction } }));
  });
});
