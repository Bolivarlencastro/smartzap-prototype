import { ChangeDetectionStrategy, Component, Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatDialog } from '@angular/material/dialog';
import { globalSettingsFeature } from '@app/shared/store/features';
import { marker } from '@jsverse/transloco-keys-manager/marker';
import { Workspace } from '@keeps-platform-frontend-workspace/kp-keeps';
import { KpConfirmDialogComponent } from '@keeps-platform-frontend-workspace/ui/kp-confirm-dialog';
import { Store } from '@ngrx/store';
import { filter } from 'rxjs';
import * as GlobalSettingsActions from '../../../shared/store/actions';
import { WorkspaceFormComponent } from 'app/main/workspace/components';

@Component({
  selector: 'app-workspace-info',
  template: `
    <app-workspace-form
      [workspace]="workspace()"
      (deleted)="onDelete($event)"
      (updated)="onUpdate($event)"
    ></app-workspace-form>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [WorkspaceFormComponent],
})
export class WorkspaceInfoComponent {
  workspace: Signal<Workspace>;

  constructor(
    private store: Store,
    private _dialog: MatDialog,
  ) {
    this.workspace = toSignal(store.select(globalSettingsFeature.selectBuildedWorkspace));
  }

  onUpdate(workspace: Workspace) {
    this.store.dispatch(GlobalSettingsActions.updateWorkspace({ workspace }));
  }

  onDelete(workspaceId: string): void {
    const dialogRef = this._dialog.open(KpConfirmDialogComponent, { maxWidth: '350px' });
    dialogRef.componentInstance.confirmTitle = marker('WORKSPACE_PROFILE.DELETE_DIALOG.TITLE');
    dialogRef.componentInstance.confirmMessage = marker('WORKSPACE_PROFILE.DELETE_DIALOG.MESSAGE');
    dialogRef.componentInstance.positiveButtonLabel = 'GENERAL.DELETE';

    dialogRef
      .afterClosed()
      .pipe(filter((result) => !!result))
      .subscribe(() => this.store.dispatch(GlobalSettingsActions.deleteWorkspace({ id: workspaceId })));
  }
}
