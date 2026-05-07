import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { getTranslocoTestingModule } from '@core/utils/transloco-testing.module';
import { KpConfirmDialogComponent } from '@keeps-platform-frontend-workspace/ui/kp-confirm-dialog';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { of } from 'rxjs';
import { GroupDialogComponent, GroupImportDialogComponent } from '../../components';
import * as fromActions from '../../store/group.actions';
import { groupFeatureKey, initialState } from '../../store/group.reducer';
import { GroupListComponent } from './group-list.component';
import { MatIconTestingModule } from '@angular/material/icon/testing';

describe('GroupListComponent', () => {
  let component: GroupListComponent;
  let fixture: ComponentFixture<GroupListComponent>;
  let matDialog: MatDialog;
  let matDialogRef: MatDialogRef<GroupDialogComponent | KpConfirmDialogComponent>;
  let store: MockStore;
  const afterClosedMock = jest.fn().mockReturnValue(of({ name: 'Group2', file: {}, goal_date: '' }));

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GroupListComponent, getTranslocoTestingModule(), MatIconTestingModule],
      providers: [
        { provide: MatDialog, useValue: { open: jest.fn(() => matDialogRef) } },
        {
          provide: MatDialogRef,
          useValue: {
            componentInstance: { confirmMessage: null },
            close: jest.fn(),
            afterClosed: afterClosedMock,
          },
        },
        provideMockStore({ initialState: { [groupFeatureKey]: initialState } }),
      ],
    }).compileComponents();

    matDialog = TestBed.inject(MatDialog) as jest.Mocked<MatDialog>;
    matDialogRef = TestBed.inject(MatDialogRef) as jest.Mocked<MatDialogRef<GroupDialogComponent>>;
    store = TestBed.inject(MockStore);
    fixture = TestBed.createComponent(GroupListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should dispatch loadGroups action on ngOnInit', () => {
    const spy = jest.spyOn(store, 'dispatch');
    component.ngOnInit();
    expect(spy).toHaveBeenCalledWith(fromActions.loadGroups());
  });

  it('should dispatch clearCache action on ngOnDestroy', () => {
    const spy = jest.spyOn(store, 'dispatch');
    component.ngOnDestroy();
    expect(spy).toHaveBeenCalledWith(fromActions.clearCache());
  });

  it('should open delete group dialog and dispatch deleteGroup action when the dialog is closed', () => {
    const dispatchSpy = jest.spyOn(store, 'dispatch');
    const openSpy = jest.spyOn(matDialog, 'open');
    const afterClosedSpy = jest.spyOn(matDialogRef, 'afterClosed');
    afterClosedMock.mockReturnValueOnce(of(true));
    component.onDelete('1');

    expect(openSpy).toHaveBeenCalledWith(KpConfirmDialogComponent, { maxWidth: '350px' });
    expect((matDialogRef.componentInstance as KpConfirmDialogComponent).confirmMessage).toBe(
      'GROUPS.DIALOG.REMOVE_GROUP_MESSAGE',
    );

    matDialogRef.close();

    expect(afterClosedSpy).toHaveBeenCalled();
    expect(dispatchSpy).toHaveBeenCalledWith(fromActions.deleteGroup({ id: '1' }));
  });

  it('should open edit group dialog and dispatch updateGroup action when the dialog is closed', () => {
    const dispatchSpy = jest.spyOn(store, 'dispatch');
    const openSpy = jest.spyOn(matDialog, 'open');
    const afterClosedSpy = jest.spyOn(matDialogRef, 'afterClosed');
    const data = { id: '1', name: 'Group1' };
    component.onEdit(data);

    expect(openSpy).toHaveBeenCalledWith(GroupDialogComponent, {
      width: '450px',
      minWidth: '300px',
      autoFocus: 'dialog',
      data,
    });

    matDialogRef.close();

    expect(afterClosedSpy).toHaveBeenCalled();
    expect(dispatchSpy).toHaveBeenCalledWith(fromActions.updateGroup({ id: data.id, data: { name: 'Group2' } }));
  });

  it('should dispatch updateFilter', () => {
    const spy = jest.spyOn(store, 'dispatch');
    const search = 'test';
    component.applyFilter(search);
    expect(spy).toHaveBeenCalledWith(fromActions.updateFilter({ search }));
  });

  it('should dispatch importGroup', () => {
    const spy = jest.spyOn(store, 'dispatch');
    const [data, objectType, goal_date] = [{}, 'USER', '20/05/1996'];
    component.onImport(data, objectType, goal_date);
    expect(spy).toHaveBeenCalledWith(fromActions.importGroup({ data, objectType: 'USER', goal_date }));
  });

  describe('importDialog', () => {
    const cases = [
      ['USER', 'GROUPS.DIALOG_IMPORT.TITLE_USERS'],
      ['TRAIL', 'GROUPS.DIALOG_IMPORT.TITLE_TRAILS'],
      ['MISSION', 'GROUPS.DIALOG_IMPORT.TITLE_MISSIONS'],
      ['ANOTHER_TYPE', ''],
    ];

    test.each(cases)(
      'should open import dialog and dispatch importGroup action when the dialog is closed - %p',
      (type, title) => {
        const dispatchSpy = jest.spyOn(store, 'dispatch');
        const openSpy = jest.spyOn(matDialog, 'open');
        const afterClosedSpy = jest.spyOn(matDialogRef, 'afterClosed');
        const objectType = type as 'USER' | 'MISSION' | 'CHANNEL' | 'TRAIL';

        component.openUserImportDialog(objectType);

        expect(openSpy).toHaveBeenCalledWith(GroupImportDialogComponent, {
          width: '500px',
          minWidth: '300px',
          data: {
            title,
          },
        });

        matDialogRef.close();

        expect(afterClosedSpy).toHaveBeenCalled();
        expect(dispatchSpy).toHaveBeenCalledWith(fromActions.importGroup({ data: {}, objectType, goal_date: '' }));
      },
    );
  });

  it('should dispatch setPagination', () => {
    const spy = jest.spyOn(store, 'dispatch');
    const [pageIndex, pageSize] = [1, 10];
    component.onPageChange({ pageIndex, pageSize } as PageEvent);
    expect(spy).toHaveBeenCalledWith(fromActions.setPagination({ page: pageIndex + 1, per_page: pageSize }));
  });
});
