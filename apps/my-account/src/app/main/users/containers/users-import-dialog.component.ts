import { ChangeDetectionStrategy, Component, OnDestroy, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { UserRolesViewModel, UsersImportDialogViewMode, UsersImportDialogViewModel } from 'app/main/users/users.types';
import { UserRolesSelectors } from '../store/selectors';
import { UsersImportDialogActions } from 'app/main/users/store/actions';
import { RolesFormComponent } from 'app/main/users/components/roles-form/roles-form.component';
import { UsersImportFormComponent } from 'app/main/users/components/users-import-form/users-import-form.component';
import { UserRolesFooterComponent } from 'app/main/users/components/user-roles-footer/user-roles-footer.component';
import { UsersImportService } from 'app/main/users/services/users-import.service';
import { usersImportDialogFeature } from 'app/main/users/store/features/users-import-dialog.feature';
import { MatDialogContent, MatDialogTitle } from '@angular/material/dialog';
import { AsyncPipe } from '@angular/common';
import { KpLoadingShadeComponent } from '@keeps-platform-frontend-workspace/ui/kp-loading-shade';
import { TranslocoPipe } from '@jsverse/transloco';
import { UsersImportTitlePipe } from '../pipes/users-import-title.pipe';
import { UsersImportSubtitlePipe } from '../pipes/users-import-subtitle.pipe';

@Component({
  selector: 'app-user-import-dialog',
  template: `
    @let usersImportVm = usersImportViewModel$ | async;
    @let userRolesVm = usersRolesViewModel$ | async;

    <div class="flex flex-col gap-4" matDialogTitle>
      <div class="flex justify-between text-2xl gap-3">
        <h1>
          {{ usersImportVm.viewMode | usersImportTitle | transloco }}
        </h1>
      </div>
      <div class="text-secondary text-base">
        <p>{{ usersImportVm.viewMode | usersImportSubtitle | transloco }}</p>
      </div>
    </div>
    <div mat-dialog-content>
      @switch (usersImportVm.viewMode) {
        @case ('selectFile') {
          <app-users-import-form #fileSelectForm></app-users-import-form>
        }
        @case ('selectRoles') {
          @if (!userRolesVm.applicationsLoaded) {
            <kp-loading-shade class="h-90 block"></kp-loading-shade>
          }
          @if (userRolesVm.applicationsLoaded) {
            <app-roles-form
              #rolesForm
              [apps]="userRolesVm.applications"
              [disabled]="usersImportVm.isSaving"
            ></app-roles-form>
          }
        }
      }
    </div>

    <app-user-roles-footer
      #footer
      [viewMode]="usersImportVm.viewMode"
      [positiveButtonDisabled]="positiveButtonDisabled(usersImportVm.viewMode, usersImportVm.isSaving)"
      [showTemporaryPasswordToggle]="usersImportVm.showTemporaryPasswordToggle"
      (saveRoles)="save()"
      (setImportFile)="setImportFile()"
    ></app-user-roles-footer>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatDialogTitle,
    MatDialogContent,
    UsersImportFormComponent,
    KpLoadingShadeComponent,
    RolesFormComponent,
    UserRolesFooterComponent,
    AsyncPipe,
    TranslocoPipe,
    UsersImportTitlePipe,
    UsersImportSubtitlePipe,
  ],
})
export class UsersImportDialogComponent implements OnDestroy {
  protected readonly usersImportViewModel$: Observable<UsersImportDialogViewModel>;
  protected readonly usersRolesViewModel$: Observable<UserRolesViewModel>;

  @ViewChild('rolesForm') protected rolesForm: RolesFormComponent;
  @ViewChild('fileSelectForm') protected fileSelectForm: UsersImportFormComponent;
  @ViewChild('footer') protected footer: UserRolesFooterComponent;

  constructor(
    private store: Store,
    private usersImportService: UsersImportService,
  ) {
    this.usersImportViewModel$ = this.store.select(usersImportDialogFeature.selectViewModel);
    this.usersRolesViewModel$ = this.store.select(UserRolesSelectors.selectUserRolesVM);
  }

  positiveButtonDisabled(viewMode: UsersImportDialogViewMode, isSaving: boolean) {
    if (viewMode === 'selectFile') {
      return !this.fileSelectForm?.valid;
    }

    return isSaving;
  }

  ngOnDestroy() {
    this.store.dispatch(UsersImportDialogActions.resetState());
  }

  save() {
    const selectedRoles = this.rolesForm.getSelectedRolesByApplication();
    this.store.dispatch(
      UsersImportDialogActions.importUsers({
        selectedRoles,
        temporaryPassword: this.footer.temporaryPassword,
      }),
    );
  }

  setImportFile() {
    this.usersImportService.setImportFile(this.fileSelectForm.value);
    this.store.dispatch(UsersImportDialogActions.importFileSelected());
  }
}
