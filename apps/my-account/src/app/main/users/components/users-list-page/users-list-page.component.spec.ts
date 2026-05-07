import { SelectionModel } from '@angular/cdk/collections';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PageEvent } from '@angular/material/paginator';
import { Sort } from '@angular/material/sort';
import { UserSearchFilter } from '@app/shared/model';
import { BatchActionsViewModel, UserProfile } from '@keeps-platform-frontend-workspace/kp-keeps';
import { KpBatchActionSelectionCounterComponent } from '@keeps-platform-frontend-workspace/ui/kp-batch-action-selection-counter';
import { KpTableLayoutComponent } from '@keeps-platform-frontend-workspace/ui/kp-table-layout';
import { getTranslocoTestingModule } from 'app/shared/util/transloco-testing.module';
import { UsersListPageComponent } from './users-list-page.component';
import { UserFilterLists } from '../../users.types';
import { UsersTitleComponent } from '../users-title/users-title.component';
import { UsersSearchComponent } from '../users-search/users-search.component';
import { UsersListComponent } from '../users-list/users-list.component';

const makeUser = (id: string): UserProfile => ({ id, name: `User ${id}`, status: true }) as UserProfile;

const makeFilterLists = (): UserFilterLists => ({
  roles: [],
  statuses: [],
  jobPositions: [],
  leaders: [],
  activityAreas: [],
  directors: [],
  managers: [],
});

const makeBatchVm = (isTotalSelected = false): BatchActionsViewModel => ({
  actions: [],
  isTotalSelected,
});

describe('UsersListPageComponent', () => {
  let component: UsersListPageComponent;
  let fixture: ComponentFixture<UsersListPageComponent>;

  const setInputs = (
    overrides: {
      users?: UserProfile[];
      isLoading?: boolean;
      displayedColumns?: string[];
      batchActionsVm?: BatchActionsViewModel;
      selection?: SelectionModel<UserProfile>;
      page?: PageEvent;
      filterLists?: UserFilterLists;
      currentRoute?: string;
      hasAppliedFilter?: boolean;
    } = {},
  ) => {
    fixture.componentRef.setInput('users', overrides.users ?? []);
    fixture.componentRef.setInput('isLoading', overrides.isLoading ?? false);
    fixture.componentRef.setInput('displayedColumns', overrides.displayedColumns ?? ['name']);
    fixture.componentRef.setInput('batchActionsVm', overrides.batchActionsVm ?? makeBatchVm());
    fixture.componentRef.setInput('selection', overrides.selection ?? new SelectionModel<UserProfile>(true, []));
    fixture.componentRef.setInput('page', overrides.page ?? ({ length: 0, pageSize: 10, pageIndex: 0 } as PageEvent));
    fixture.componentRef.setInput('filterLists', overrides.filterLists ?? makeFilterLists());
    fixture.componentRef.setInput('currentRoute', overrides.currentRoute ?? 'users');
    fixture.componentRef.setInput('hasAppliedFilter', overrides.hasAppliedFilter ?? false);
    fixture.detectChanges();
  };

  beforeEach(async () => {
    TestBed.overrideComponent(UsersListPageComponent, {
      remove: {
        imports: [
          KpBatchActionSelectionCounterComponent,
          KpTableLayoutComponent,
          UsersTitleComponent,
          UsersSearchComponent,
          UsersListComponent,
        ],
      },
      add: { schemas: [CUSTOM_ELEMENTS_SCHEMA] },
    });

    await TestBed.configureTestingModule({
      imports: [UsersListPageComponent, getTranslocoTestingModule()],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(UsersListPageComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    setInputs();
    expect(component).toBeTruthy();
  });

  describe('onOpenDialog', () => {
    it('should emit openDialog', () => {
      setInputs();
      const spy = jest.spyOn(component.openDialog, 'emit');

      component.onOpenDialog();

      expect(spy).toHaveBeenCalled();
    });
  });

  describe('onSearch', () => {
    it('should emit searchChanged with the provided term', () => {
      setInputs();
      const spy = jest.spyOn(component.searchChanged, 'emit');

      component.onSearch('john');

      expect(spy).toHaveBeenCalledWith('john');
    });
  });

  describe('onSetDisplayedColumns', () => {
    it('should emit displayedColumnsChanged with the provided columns', () => {
      setInputs();
      const spy = jest.spyOn(component.displayedColumnsChanged, 'emit');
      const columns = ['name', 'email', 'status'];

      component.onSetDisplayedColumns(columns);

      expect(spy).toHaveBeenCalledWith(columns);
    });
  });

  describe('onFilter', () => {
    it('should emit filterChanged with the provided filter data', () => {
      setInputs();
      const spy = jest.spyOn(component.filterChanged, 'emit');
      const filter: UserSearchFilter = {
        roleId: ['role-1'],
        status: true,
        jobPositions: [],
        activityAreas: [],
        directors: [],
        managers: [],
        leaders: [],
      };

      component.onFilter(filter);

      expect(spy).toHaveBeenCalledWith(filter);
    });
  });

  describe('onSort', () => {
    it('should emit sortChanged with the provided sort event', () => {
      setInputs();
      const spy = jest.spyOn(component.sortChanged, 'emit');
      const sort: Sort = { active: 'name', direction: 'asc' };

      component.onSort(sort);

      expect(spy).toHaveBeenCalledWith(sort);
    });
  });

  describe('onChangePage', () => {
    it('should emit pageChanged with the provided page event', () => {
      setInputs();
      const spy = jest.spyOn(component.pageChanged, 'emit');
      const pageEvent: PageEvent = { pageIndex: 2, pageSize: 10, length: 100 };

      component.onChangePage(pageEvent);

      expect(spy).toHaveBeenCalledWith(pageEvent);
    });
  });

  describe('onStatusChange', () => {
    it('should emit statusChanged with the provided user', () => {
      setInputs();
      const spy = jest.spyOn(component.statusChanged, 'emit');
      const user = makeUser('1');

      component.onStatusChange(user);

      expect(spy).toHaveBeenCalledWith(user);
    });
  });

  describe('emitChangedTotalSelection', () => {
    it('should emit toggleTotalSelection with true', () => {
      setInputs();
      const spy = jest.spyOn(component.toggleTotalSelection, 'emit');

      component.emitChangedTotalSelection(true);

      expect(spy).toHaveBeenCalledWith(true);
    });

    it('should emit toggleTotalSelection with false', () => {
      setInputs();
      const spy = jest.spyOn(component.toggleTotalSelection, 'emit');

      component.emitChangedTotalSelection(false);

      expect(spy).toHaveBeenCalledWith(false);
    });
  });

  describe('onToggleTotalSelection', () => {
    it('should select all provided items and emit toggleTotalSelection with true', () => {
      const users = [makeUser('1'), makeUser('2')];
      const selection = new SelectionModel<UserProfile>(true, []);
      setInputs({ selection });
      const toggleSpy = jest.spyOn(component.toggleTotalSelection, 'emit');

      component.onToggleTotalSelection(users);

      expect(selection.isSelected(users[0])).toBe(true);
      expect(selection.isSelected(users[1])).toBe(true);
      expect(toggleSpy).toHaveBeenCalledWith(true);
    });

    it('should clear selection and emit toggleTotalSelection with false when called without items', () => {
      const users = [makeUser('1'), makeUser('2')];
      const selection = new SelectionModel<UserProfile>(true, [...users]);
      setInputs({ selection });
      const toggleSpy = jest.spyOn(component.toggleTotalSelection, 'emit');

      component.onToggleTotalSelection();

      expect(selection.selected).toHaveLength(0);
      expect(toggleSpy).toHaveBeenCalledWith(false);
    });

    it('should emit toggleTotalSelection with false when called with empty array', () => {
      const selection = new SelectionModel<UserProfile>(true, []);
      setInputs({ selection });
      const toggleSpy = jest.spyOn(component.toggleTotalSelection, 'emit');

      component.onToggleTotalSelection([]);

      expect(toggleSpy).toHaveBeenCalledWith(true);
    });
  });
});
