import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { defaultConfig, FuseConfigService } from '@keeps-platform-frontend-workspace/layout';
import { Store } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import { of } from 'rxjs';

import { UsersActions } from '../../store/actions';
import { initialState } from '../../store/reducers/users.reducer';
import { UsersComponent } from './users.component';
import { ReportActions } from 'app/shared/store';
import { PageEvent } from '@angular/material/paginator';
import { getTranslocoTestingModule } from 'app/shared/test/transloco-testing.module';
import { MatIconTestingModule } from '@angular/material/icon/testing';

describe('UsersComponent', () => {
  let component: UsersComponent;
  let fixture: ComponentFixture<UsersComponent>;
  let store: Store;
  let dialog: MatDialog;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UsersComponent, getTranslocoTestingModule(), MatIconTestingModule],
      providers: [
        provideMockStore({
          initialState: { users: { users: initialState } },
        }),
        FuseConfigService,
        { provide: defaultConfig, useValue: {} },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(UsersComponent);
    store = TestBed.inject(Store);
    dialog = TestBed.inject(MatDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('onEdit', () => {
    it('should open edit user dialog and fire update user action when it gets closed', () => {
      const user = {
        id: 'id',
        name: 'name',
        phone: '+5511900000000',
        email: 'email',
        tags: 'tags',
        timezone: 'America/Sao_Paulo',
      };
      const expectedUserPayload = {
        phone: '5511900000000',
        name: user.name,
        email: user.email,
        tags: user.tags,
      };
      const dialogRef = {
        componentInstance: { title: 'title' },
        afterClosed: jest.fn().mockReturnValue(of({ data: user })),
      } as any;
      jest.spyOn(component.subscriptions$, 'add');
      jest.spyOn(store, 'dispatch');
      jest.spyOn(dialog, 'open').mockReturnValue(dialogRef);

      component.onEdit(user);

      expect(dialog.open).toHaveBeenCalled();
      expect(component.subscriptions$.add).toHaveBeenCalled();
      expect(store.dispatch).toHaveBeenCalledWith(UsersActions.updateUser({ id: user.id, user: expectedUserPayload }));
    });
  });

  describe('onUserSelected', () => {
    it('should dispatch action when user select state has changed', () => {
      const dispatchSpy = jest.spyOn(store, 'dispatch');
      const user = { id: 'id', selected: true };

      component.onUserSelected(user);

      expect(dispatchSpy).toHaveBeenCalledWith(UsersActions.toggleSelectUser(user));
    });
  });

  describe('onDeleteSelected', () => {
    it('should dispatch delete actions for each user id when user confirms deletion', () => {
      const userIds = ['1', '2'];
      const hasConfirmedDeletion = true;
      const dialogRef = {
        componentInstance: { confirmMessage: 'confirm message' },
        afterClosed: jest.fn().mockReturnValue(of(hasConfirmedDeletion)),
      } as any;
      jest.spyOn(store, 'dispatch');
      jest.spyOn(dialog, 'open').mockReturnValue(dialogRef);
      jest.spyOn(component.subscriptions$, 'add');

      component.onDeleteSelected(userIds);

      expect(component.subscriptions$.add).toHaveBeenCalled();
      expect(store.dispatch).toHaveBeenCalledTimes(userIds.length);
      expect(store.dispatch).toHaveBeenCalledWith(UsersActions.removeUser({ id: userIds[0] }));
      expect(store.dispatch).toHaveBeenCalledWith(UsersActions.removeUser({ id: userIds[1] }));
    });

    it('should not dispatch actions when user cancel deletion', () => {
      const userIds = ['1', '2'];
      const hasConfirmedDeletion = false;
      const dialogRef = {
        componentInstance: { confirmMessage: 'confirm message' },
        afterClosed: jest.fn().mockReturnValue(of(hasConfirmedDeletion)),
      } as any;
      jest.spyOn(store, 'dispatch');
      jest.spyOn(dialog, 'open').mockReturnValue(dialogRef);
      jest.spyOn(component.subscriptions$, 'add');

      component.onDeleteSelected(userIds);

      expect(component.subscriptions$.add).toHaveBeenCalled();
      expect(store.dispatch).not.toHaveBeenCalled();
    });

    it('should not dispatch actions when user ids list is empty', () => {
      const userIds = [];
      jest.spyOn(store, 'dispatch');
      jest.spyOn(component.subscriptions$, 'add');

      component.onDeleteSelected(userIds);

      expect(component.subscriptions$.add).not.toHaveBeenCalled();
      expect(store.dispatch).not.toHaveBeenCalled();
    });
  });

  describe('onSelectAll', () => {
    it('should dispatch toggleSelectAll action', () => {
      jest.spyOn(store, 'dispatch');

      component.onSelectAll();

      expect(store.dispatch).toHaveBeenCalledWith(UsersActions.toggleSelectAll());
    });
  });

  describe('onSearch', () => {
    it('should dispatch the searchUsers action', () => {
      const dispatchSpy = jest.spyOn(store, 'dispatch');
      component.onSearch('mock_search');

      expect(dispatchSpy).toHaveBeenCalledWith(UsersActions.searchUsers({ searchTerm: 'mock_search' }));
    });
  });

  describe('onSort', () => {
    it('should dispatch the sortUsers action', () => {
      const dispatchSpy = jest.spyOn(store, 'dispatch');
      component.onSort('-name');

      expect(dispatchSpy).toHaveBeenCalledWith(UsersActions.sortUsers({ sort: '-name' }));
    });
  });

  describe('onRemove', () => {
    it('should dispatch the removeUsers action', () => {
      const dispatchSpy = jest.spyOn(store, 'dispatch');
      jest.spyOn(dialog, 'open').mockReturnValue({
        componentInstance: {},
        afterClosed: jest.fn().mockReturnValue(of(true)),
      } as any);

      component.onRemove('mock_id');

      expect(dispatchSpy).toHaveBeenCalledWith(UsersActions.removeUser({ id: 'mock_id' }));
    });
  });

  describe('onGenerateReport', () => {
    it('should dispatch the generateReport action', () => {
      const dispatchSpy = jest.spyOn(store, 'dispatch');
      component.onGenerateReport('USERS');

      expect(dispatchSpy).toHaveBeenCalledWith(ReportActions.generateReport({ reportType: 'USERS' }));
    });
  });

  it('should dispatch the fetchMoreUsers action', () => {
    const dispatchSpy = jest.spyOn(store, 'dispatch');

    component.onFetchMoreUsers();
    expect(dispatchSpy).toHaveBeenCalledWith(UsersActions.fetchMoreUsers());
  });

  it('should dispatch setUserPagination action on page change', () => {
    const dispatchSpy = jest.spyOn(store, 'dispatch');
    const pageEvent: PageEvent = { pageIndex: 1, pageSize: 10, length: 100 };
    const expectedAction = UsersActions.setUserPagination({ currentPage: 2, per_page: 10 });

    component.onPageChange(pageEvent);

    expect(dispatchSpy).toHaveBeenCalledWith(expectedAction);
  });
});
