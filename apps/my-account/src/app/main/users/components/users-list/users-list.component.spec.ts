import { SelectionModel } from '@angular/cdk/collections';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';
import { BatchActionsViewModel, UserProfile } from '@keeps-platform-frontend-workspace/kp-keeps';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { Sort } from '@angular/material/sort';
import { Subject } from 'rxjs';
import { getTranslocoTestingModule } from 'app/shared/util/transloco-testing.module';
import { MatIconTestingModule } from '@angular/material/icon/testing';
import { UsersListComponent } from './users-list.component';

const makeUser = (id: string): UserProfile => ({ id, name: `User ${id}`, status: true }) as UserProfile;

const makeBatchVm = (isTotalSelected = false): BatchActionsViewModel => ({
  actions: [],
  isTotalSelected,
});

describe('UsersListComponent', () => {
  let component: UsersListComponent;
  let fixture: ComponentFixture<UsersListComponent>;

  const setInputs = (
    overrides: {
      users?: UserProfile[];
      isLoading?: boolean;
      displayedColumns?: string[];
      batchActionsVm?: BatchActionsViewModel;
      selection?: SelectionModel<UserProfile>;
    } = {},
  ) => {
    fixture.componentRef.setInput('users', overrides.users ?? []);
    fixture.componentRef.setInput('isLoading', overrides.isLoading ?? false);
    fixture.componentRef.setInput('displayedColumns', overrides.displayedColumns ?? ['name', 'status']);
    fixture.componentRef.setInput('batchActionsVm', overrides.batchActionsVm ?? makeBatchVm());
    fixture.componentRef.setInput('selection', overrides.selection ?? new SelectionModel<UserProfile>(true, []));
    fixture.detectChanges();
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UsersListComponent, getTranslocoTestingModule(), MatIconTestingModule],
      providers: [provideNoopAnimations(), provideRouter([])],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(UsersListComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    setInputs();
    expect(component).toBeTruthy();
  });

  describe('hiddenTable computed', () => {
    it('should be true when isLoading is true', () => {
      setInputs({ isLoading: true, users: [makeUser('1')] });
      expect(component.hiddenTable()).toBe(true);
    });

    it('should be true when users list is empty', () => {
      setInputs({ isLoading: false, users: [] });
      expect(component.hiddenTable()).toBe(true);
    });

    it('should be false when not loading and users exist', () => {
      setInputs({ isLoading: false, users: [makeUser('1')] });
      expect(component.hiddenTable()).toBe(false);
    });
  });

  describe('emptyState computed', () => {
    it('should be true when not loading and no users', () => {
      setInputs({ isLoading: false, users: [] });
      expect(component.emptyState()).toBe(true);
    });

    it('should be false when loading even with no users', () => {
      setInputs({ isLoading: true, users: [] });
      expect(component.emptyState()).toBe(false);
    });

    it('should be false when users exist', () => {
      setInputs({ isLoading: false, users: [makeUser('1')] });
      expect(component.emptyState()).toBe(false);
    });
  });

  describe('ngAfterViewInit', () => {
    it('should emit sortChanged when sort emits', () => {
      setInputs();
      const sortChangedSpy = jest.spyOn(component.sortChanged, 'emit');
      const sortChange$ = new Subject<Sort>();
      component.sort = { sortChange: sortChange$ } as any;

      component.ngAfterViewInit();
      const sortEvent: Sort = { active: 'name', direction: 'asc' };
      sortChange$.next(sortEvent);

      expect(sortChangedSpy).toHaveBeenCalledWith(sortEvent);
    });

    it('should not throw when sort ViewChild is not available', () => {
      setInputs();
      component.sort = undefined as any;
      expect(() => component.ngAfterViewInit()).not.toThrow();
    });
  });

  describe('ngOnDestroy', () => {
    it('should complete _unsubscribeAll subject', () => {
      setInputs();
      const completeSpy = jest.spyOn(component['_unsubscribeAll'], 'complete');
      component.ngOnDestroy();
      expect(completeSpy).toHaveBeenCalled();
    });
  });

  describe('onChangeStatus', () => {
    it('should emit statusChanged with the user', () => {
      setInputs();
      const statusChangedSpy = jest.spyOn(component.statusChanged, 'emit');
      const user = makeUser('1');

      component.onChangeStatus(user);

      expect(statusChangedSpy).toHaveBeenCalledWith(user);
    });
  });

  describe('onClearTotalSelection', () => {
    it('should emit clearTotalSelection', () => {
      setInputs();
      const clearSpy = jest.spyOn(component.clearTotalSelection, 'emit');

      component.onClearTotalSelection();

      expect(clearSpy).toHaveBeenCalled();
    });
  });

  describe('isAllSelected', () => {
    it('should return true when all users are selected', () => {
      const users = [makeUser('1'), makeUser('2')];
      const selection = new SelectionModel<UserProfile>(true, [...users]);
      setInputs({ users, selection });

      expect(component.isAllSelected()).toBe(true);
    });

    it('should return false when not all users are selected', () => {
      const users = [makeUser('1'), makeUser('2')];
      const selection = new SelectionModel<UserProfile>(true, [users[0]]);
      setInputs({ users, selection });

      expect(component.isAllSelected()).toBe(false);
    });

    it('should return false when selection is empty', () => {
      const users = [makeUser('1')];
      const selection = new SelectionModel<UserProfile>(true, []);
      setInputs({ users, selection });

      expect(component.isAllSelected()).toBe(false);
    });
  });

  describe('toggleAllRows', () => {
    it('should select all users when none are selected', () => {
      const users = [makeUser('1'), makeUser('2')];
      const selection = new SelectionModel<UserProfile>(true, []);
      setInputs({ users, selection, batchActionsVm: makeBatchVm(false) });

      component.toggleAllRows();

      expect(selection.selected).toEqual(users);
    });

    it('should clear selection when all users are already selected', () => {
      const users = [makeUser('1'), makeUser('2')];
      const selection = new SelectionModel<UserProfile>(true, [...users]);
      setInputs({ users, selection, batchActionsVm: makeBatchVm(false) });

      component.toggleAllRows();

      expect(selection.selected).toHaveLength(0);
    });

    it('should call onClearTotalSelection when isTotalSelected is true', () => {
      const users = [makeUser('1'), makeUser('2')];
      const selection = new SelectionModel<UserProfile>(true, [...users]);
      setInputs({ users, selection, batchActionsVm: makeBatchVm(true) });
      const clearSpy = jest.spyOn(component, 'onClearTotalSelection');

      component.toggleAllRows();

      expect(clearSpy).toHaveBeenCalled();
    });
  });

  describe('toggleOneRow', () => {
    it('should toggle the item in selection when event is truthy', () => {
      const users = [makeUser('1'), makeUser('2')];
      const selection = new SelectionModel<UserProfile>(true, []);
      setInputs({ users, selection, batchActionsVm: makeBatchVm(false) });

      component.toggleOneRow({ checked: true } as MatCheckboxChange, users[0]);

      expect(selection.isSelected(users[0])).toBe(true);
    });

    it('should call onClearTotalSelection when isTotalSelected is true', () => {
      const users = [makeUser('1')];
      const selection = new SelectionModel<UserProfile>(true, []);
      setInputs({ users, selection, batchActionsVm: makeBatchVm(true) });
      const clearSpy = jest.spyOn(component, 'onClearTotalSelection');

      component.toggleOneRow({ checked: true } as MatCheckboxChange, users[0]);

      expect(clearSpy).toHaveBeenCalled();
    });

    it('should not toggle when event is falsy', () => {
      const users = [makeUser('1')];
      const selection = new SelectionModel<UserProfile>(true, []);
      setInputs({ users, selection, batchActionsVm: makeBatchVm(false) });

      component.toggleOneRow(null as unknown as MatCheckboxChange, users[0]);

      expect(selection.isSelected(users[0])).toBe(false);
    });
  });
});
