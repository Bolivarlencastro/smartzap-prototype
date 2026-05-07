import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDividerModule } from '@angular/material/divider';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Store } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import { coursesListInitialState } from '../../store';
import { AluraCourseMirrorActions, CoursesListActions, TokensDialogActions } from '../../store/actions';
import { getTranslocoTestingModule } from '../../utils';
import { ManagementComponent } from './management.component';
import { ManagementFilter } from '../../models';

describe('ManagementComponent', () => {
  let component: ManagementComponent;
  let fixture: ComponentFixture<ManagementComponent>;
  let store: Store;
  let dispatchSpy: jest.SpyInstance;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManagementComponent, getTranslocoTestingModule(), NoopAnimationsModule, MatDividerModule],
      providers: [provideMockStore({ initialState: { aluraCoursesList: coursesListInitialState } })],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    store = TestBed.inject(Store);
    dispatchSpy = jest.spyOn(store, 'dispatch');
    fixture = TestBed.createComponent(ManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should dispatch resetState action on destroy', () => {
    component.ngOnDestroy();

    expect(dispatchSpy).toHaveBeenCalledWith(CoursesListActions.resetState());
  });

  it('should dispatch openTokensConfigDialog action when openTokensConfigDialog is called', () => {
    component.onOpenTokensConfigDialog();

    expect(dispatchSpy).toHaveBeenCalledWith(TokensDialogActions.openDialog());
  });

  it('should dispatch setPagination action when onPageChange is called', () => {
    const pagination = { currentPage: 1, perPage: 10 };

    component.onPageChange(pagination);

    expect(dispatchSpy).toHaveBeenCalledWith(CoursesListActions.setPagination({ pagination }));
  });

  it('should dispatch sort action when onSort is called', () => {
    const sort = '-name';

    component.onSort(sort);

    expect(dispatchSpy).toHaveBeenCalledWith(CoursesListActions.sort({ sort }));
  });

  it('should dispatch openDialog action when onOpenCourseMirrorDialog is called', () => {
    component.onOpenCourseMirrorDialog();

    expect(dispatchSpy).toHaveBeenCalledWith(AluraCourseMirrorActions.openDialog());
  });

  it('should dispatch deleteCourse action', () => {
    const courseIds = ['1', '2'];

    component.onDelete(courseIds);

    expect(dispatchSpy).toHaveBeenCalledWith(CoursesListActions.deleteCourse({ courseIds }));
  });

  it('should dispatch toggleActiveCourse action', () => {
    const data = { isActive: true, courseIds: ['1', '2'] };

    component.onToggleActive(data);

    expect(dispatchSpy).toHaveBeenCalledWith(CoursesListActions.toggleActiveCourse({ data }));
  });

  it('should dispatch openDetailDialog action', () => {
    const courseId = '1';

    component.onOpenDetailDialog(courseId);

    expect(dispatchSpy).toHaveBeenCalledWith(CoursesListActions.openDetailDialog({ courseId }));
  });

  it('should dispatch search action', () => {
    const search = 'test';

    component.onSearch(search);

    expect(dispatchSpy).toHaveBeenCalledWith(CoursesListActions.search({ search }));
  });

  it('should dispatch filter action', () => {
    const filter: ManagementFilter = { category: ['1', '2'] };

    component.onFilter(filter);

    expect(dispatchSpy).toHaveBeenCalledWith(CoursesListActions.filter({ filter }));
  });
});
