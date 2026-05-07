import { Component, CUSTOM_ELEMENTS_SCHEMA, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { ActivatedRoute } from '@angular/router';
import { getTranslocoTestingModule } from '@core/utils/transloco-testing.module';
import { EnrollmentType } from '@keeps-platform-frontend-workspace/ui/kp-enrollment-settings-form';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { of } from 'rxjs';
import { RemoveDialogComponent } from 'app/main/group/shared/components/remove-dialog/remove-dialog.component';
import { GroupUserCreateComponent } from '../group-user-create/group-user-create.component';
import * as fromActions from '../../store/group-user.actions';
import { groupUserFeatureKey, initialState } from '../../store/group-user.reducer';
import { GroupUsersPageComponent } from './group-users-page.component';

@Component({
  selector: 'app-host-component',
  template: '<div id="container-3"><app-group-users-page></app-group-users-page></div>',
  imports: [GroupUsersPageComponent],
})
class TestHostComponent {
  @ViewChild(GroupUsersPageComponent)
  groupUsersPageComponent!: GroupUsersPageComponent;
}

describe('GroupUsersPageComponent', () => {
  let hostFixture: ComponentFixture<TestHostComponent>;
  let hostComponent: TestHostComponent;
  let component: GroupUsersPageComponent;
  let store: MockStore;
  let dialog: jest.Mocked<MatDialog>;

  beforeEach(async () => {
    dialog = {
      open: jest.fn(),
    } as unknown as jest.Mocked<MatDialog>;

    await TestBed.configureTestingModule({
      imports: [TestHostComponent, getTranslocoTestingModule()],
      providers: [
        { provide: MatDialog, useValue: dialog },
        { provide: MatDialogRef, useValue: {} },
        provideMockStore({ initialState: { [groupUserFeatureKey]: initialState } }),
        {
          provide: ActivatedRoute,
          useValue: { parent: { parent: { params: of({ id: 'mock_id' }) } } },
        },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    store = TestBed.inject(MockStore);
    jest.spyOn(store, 'dispatch');

    hostFixture = TestBed.createComponent(TestHostComponent);
    hostComponent = hostFixture.componentInstance;
    hostFixture.detectChanges();

    component = hostComponent.groupUsersPageComponent;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should dispatch init with route group id', () => {
      expect(store.dispatch).toHaveBeenCalledWith(fromActions.init({ groupId: 'mock_id' }));
    });
  });

  describe('ngOnDestroy', () => {
    it('should dispatch clearCache', () => {
      component.ngOnDestroy();
      expect(store.dispatch).toHaveBeenCalledWith(fromActions.clearCache());
    });
  });

  describe('applyFilter', () => {
    it('should dispatch filter with the search term', () => {
      component.applyFilter('test');
      expect(store.dispatch).toHaveBeenCalledWith(fromActions.filter({ search: 'test' }));
    });
  });

  describe('onSort', () => {
    it('should dispatch order with the ordering value', () => {
      component.onSort({ ordering: 'job' });
      expect(store.dispatch).toHaveBeenCalledWith(fromActions.order({ ordering: 'job' }));
    });

    it('should dispatch order with null when event has no ordering', () => {
      component.onSort(null);
      expect(store.dispatch).toHaveBeenCalledWith(fromActions.order({ ordering: null }));
    });
  });

  describe('onPageChange', () => {
    it('should dispatch setPagination with page = pageIndex + 1', () => {
      const event: PageEvent = { pageIndex: 2, pageSize: 25, length: 100 };

      component.onPageChange(event);

      expect(store.dispatch).toHaveBeenCalledWith(fromActions.setPagination({ page: 3, per_page: 25 }));
    });
  });

  describe('filterByDeletedUsers', () => {
    it('should dispatch filterByDeletedUsers with the deleted flag', () => {
      component.filterByDeletedUsers(true);
      expect(store.dispatch).toHaveBeenCalledWith(fromActions.filterByDeletedUsers({ deleted: true }));
    });
  });

  describe('openDialog', () => {
    it('should dispatch addGroupUsers with selected ids and enrollment after dialog closes', () => {
      const result = {
        selectedItems: ['1', '2', '3'],
        enrollment: { date: '01/01/2024', enrollmentType: EnrollmentType.FREE },
      };
      dialog.open.mockReturnValue({ afterClosed: () => of(result) } as unknown as MatDialogRef<any>);

      component.openDialog();

      expect(dialog.open).toHaveBeenCalledWith(GroupUserCreateComponent, {
        width: '90vw',
        autoFocus: false,
        disableClose: true,
      });
      expect(store.dispatch).toHaveBeenCalledWith(
        fromActions.addGroupUsers({ userIds: result.selectedItems, enrollment: result.enrollment }),
      );
    });

    it('should not dispatch addGroupUsers when dialog returns empty result', () => {
      dialog.open.mockReturnValue({ afterClosed: () => of(null) } as unknown as MatDialogRef<any>);
      jest.clearAllMocks();
      jest.spyOn(store, 'dispatch');

      component.openDialog();

      expect(store.dispatch).not.toHaveBeenCalled();
    });
  });

  describe('onRemove', () => {
    it('should dispatch deleteGroupUser after dialog confirmation', () => {
      const removeResult = { ok: true, removeEnrollments: true };
      dialog.open.mockReturnValue({ afterClosed: () => of(removeResult) } as unknown as MatDialogRef<any>);

      component.onRemove({ id: 'row-1', userId: 'user-1' });

      expect(dialog.open).toHaveBeenCalledWith(RemoveDialogComponent, { width: '500px' });
      expect(store.dispatch).toHaveBeenCalledWith(
        fromActions.deleteGroupUser({ userId: 'user-1', id: 'row-1', removeEnrollments: true }),
      );
    });

    it('should not dispatch deleteGroupUser when dialog is cancelled', () => {
      dialog.open.mockReturnValue({ afterClosed: () => of(null) } as unknown as MatDialogRef<any>);
      jest.clearAllMocks();
      jest.spyOn(store, 'dispatch');

      component.onRemove({ id: 'row-1', userId: 'user-1' });

      expect(store.dispatch).not.toHaveBeenCalled();
    });
  });
});
