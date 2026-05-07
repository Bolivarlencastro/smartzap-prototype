import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { globalSettingsInitialState } from '@app/shared/store/features';
import { getTranslocoTestingModule } from '@app/shared/util/transloco-testing.module';
import { KpConfirmDialogComponent } from '@keeps-platform-frontend-workspace/ui/kp-confirm-dialog';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { of } from 'rxjs';
import * as GlobalSettingsActions from '../../../shared/store/actions';
import { WorkspaceInfoComponent } from './workspace-info.component';
import { UserProfileService } from '@keeps-platform-frontend-workspace/kp-keeps';

describe('WorkspaceInfoComponent', () => {
  let component: WorkspaceInfoComponent;
  let fixture: ComponentFixture<WorkspaceInfoComponent>;
  let store: MockStore;
  let matDialog: MatDialog;
  let matDialogRef: MatDialogRef<KpConfirmDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WorkspaceInfoComponent, getTranslocoTestingModule()],
      providers: [
        { provide: UserProfileService, useValue: { hasRoles: jest.fn() } },
        provideMockStore({ initialState: { ['globalSettings']: globalSettingsInitialState } }),
        { provide: MatDialog, useValue: { open: jest.fn(() => matDialogRef) } },
        {
          provide: MatDialogRef,
          useValue: {
            close: jest.fn(),
            afterClosed: jest.fn(() => of(true)),
            componentInstance: {},
          },
        },
      ],
    }).compileComponents();

    matDialog = TestBed.inject(MatDialog) as jest.Mocked<MatDialog>;
    matDialogRef = TestBed.inject(MatDialogRef) as jest.Mocked<MatDialogRef<KpConfirmDialogComponent>>;
    store = TestBed.inject(MockStore);
    jest.spyOn(store, 'dispatch');

    fixture = TestBed.createComponent(WorkspaceInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should dispatch updateWorkspace action', () => {
    const workspace = { id: '123', name: 'New Name' };
    component.onUpdate(workspace);
    expect(store.dispatch).toHaveBeenCalledWith(GlobalSettingsActions.updateWorkspace({ workspace }));
  });

  it('should dispatch deleteWorkspace action and open KpConfirmDialogComponent', () => {
    const openSpy = jest.spyOn(matDialog, 'open');
    const afterClosedSpy = jest.spyOn(matDialogRef, 'afterClosed');

    component.onDelete('123');

    expect(openSpy).toHaveBeenCalledWith(KpConfirmDialogComponent, { maxWidth: '350px' });
    expect(matDialogRef.componentInstance.confirmTitle).toBe('WORKSPACE_PROFILE.DELETE_DIALOG.TITLE');
    expect(matDialogRef.componentInstance.confirmMessage).toBe('WORKSPACE_PROFILE.DELETE_DIALOG.MESSAGE');
    expect(matDialogRef.componentInstance.positiveButtonLabel).toBe('GENERAL.DELETE');
    expect(afterClosedSpy).toHaveBeenCalled();
    expect(store.dispatch).toHaveBeenCalledWith(GlobalSettingsActions.deleteWorkspace({ id: '123' }));
  });
});
