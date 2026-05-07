import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PageEvent } from '@angular/material/paginator';
import { Sort } from '@angular/material/sort';
import { UserSearchFilter } from '@app/shared/model';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { getTranslocoTestingModule } from 'app/shared/util/transloco-testing.module';
import { UserDetailsDrawerService } from '../services/user-details-drawer.service';
import { BatchActionsActions, UsersImportDialogActions, UsersListActions } from '../store/actions';
import { featureKey } from '../store/reducers';
import { initialState } from '../store/reducers/user-details.reducer';
import { UserManagementComponent } from './user-management.component';
import { BatchAction, UserProfile } from '@keeps-platform-frontend-workspace/kp-keeps';
import { provideRouter } from '@angular/router';

describe('UserManagementComponent', () => {
  let component: UserManagementComponent;
  let fixture: ComponentFixture<UserManagementComponent>;
  let store: MockStore;
  let mockMatDrawerService: jest.Mocked<UserDetailsDrawerService>;

  beforeEach(async () => {
    mockMatDrawerService = { setDrawer: jest.fn() } as unknown as jest.Mocked<UserDetailsDrawerService>;

    await TestBed.configureTestingModule({
      imports: [UserManagementComponent, getTranslocoTestingModule()],
      providers: [
        {
          provide: UserDetailsDrawerService,
          useValue: mockMatDrawerService,
        },
        provideMockStore({ initialState: { [featureKey]: initialState } }),
        provideRouter([]),
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(UserManagementComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(MockStore);
    jest.spyOn(store, 'dispatch');
  });

  it('should call setDrawer on UserDetailsDrawerService in ngOnInit', () => {
    component.ngOnInit();
    expect(mockMatDrawerService.setDrawer).toHaveBeenCalledWith(component.matDrawer);
  });

  it('should dispatch clear action on destroy', () => {
    component.ngOnDestroy();
    expect(store.dispatch).toHaveBeenCalledWith(UsersListActions.clear());
  });

  it('should dispatch search action', () => {
    const search = 'test';

    component.onSearch(search);

    expect(store.dispatch).toHaveBeenCalledWith(UsersListActions.search({ search }));
  });

  it('should dispatch changePage action', () => {
    const pageEvent: PageEvent = { pageIndex: 3, pageSize: 20, length: 555 };

    component.onChangePage(pageEvent);

    expect(store.dispatch).toHaveBeenCalledWith(UsersListActions.changePage({ pageEvent }));
  });

  it('should dispatch sort action', () => {
    const sort: Sort = { active: 'name', direction: 'asc' };

    component.onSort(sort);

    expect(store.dispatch).toHaveBeenCalledWith(UsersListActions.sort({ sort }));
  });

  it('should dispatch toggleUserStatus on status change', () => {
    const user = { id: '1', name: 'John Doe', email: 'john@example.com', status: true } as unknown as UserProfile;
    component.onStatusChange(user);

    expect(store.dispatch).toHaveBeenCalledWith(UsersListActions.toggleUserStatus({ user }));
  });

  it('should dispatch openImportDialog on dialog open', () => {
    component.onOpenDialog();
    expect(store.dispatch).toHaveBeenCalledWith(UsersImportDialogActions.openDialog());
  });

  it('should dispatch setDisplayedColumns on column change', () => {
    const columns = ['name', 'email'];
    component.onSetDisplayedColumns(columns);

    expect(store.dispatch).toHaveBeenCalledWith(UsersListActions.setDisplayedColumns({ columns }));
  });

  it('should dispatch filter action', () => {
    const data: UserSearchFilter = {
      roleId: ['1'],
      status: true,
      jobPositions: ['1', '3', '4'],
      activityAreas: ['1'],
      directors: ['1', '2', '3'],
      managers: ['3', '4'],
      leaders: [''],
    };

    component.onFilter(data);

    expect(store.dispatch).toHaveBeenCalledWith(UsersListActions.filter({ data }));
  });

  it('should dispatch toggleTotalSelection action', () => {
    const isTotalSelected = true;

    component.onToggleTotalSelection(isTotalSelected);

    expect(store.dispatch).toHaveBeenCalledWith(BatchActionsActions.toggleTotalSelection({ isTotalSelected }));
  });

  it('should dispatch dispatchAction action', () => {
    component.selection.select(...([{ id: '1' }, { id: '2' }] as UserProfile[]));
    const [action, total] = ['ACTIVATE_USERS' as BatchAction, 55];

    component.dispatchAction(action, total);

    expect(store.dispatch).toHaveBeenCalledWith(BatchActionsActions.dispatchAction({ action, ids: ['1', '2'], total }));
  });
});
