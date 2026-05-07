import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, signal, Signal, viewChild } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { JobModel } from '@app/main/job-management/models';
import { globalSettingsFeature } from '@app/shared/store/features';
import {
  Language,
  LanguagesService,
  UserCreateDTO,
  WorkspaceService,
} from '@keeps-platform-frontend-workspace/kp-keeps';
import { Store } from '@ngrx/store';
import { UserDetailAction, UserDetailViewModel, UserRolesViewModel } from 'app/main/users/users.types';
import { UsersService } from 'app/shared/services';
import { RolesFormComponent, UserFormComponent } from '../components';
import { UserDataTransferActions, UserDetailsActions, UserRolesActions } from '../store/actions';
import { UserDetailsSelector, UserRolesSelectors } from '../store/selectors';
import { TranslocoPipe } from '@jsverse/transloco';
import { UpperCasePipe } from '@angular/common';
import { UserWorkspacesComponent } from 'app/main/users/containers/user-workspaces/user-workspaces.component';
import { MatSlideToggle } from '@angular/material/slide-toggle';
import { MatIcon } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';

@Component({
  selector: 'app-user-aside',
  template: `
    @if (vm()) {
      <app-user-form
        [vm]="vm()"
        [jobs]="jobs()"
        [languages]="languages()"
        (formSubmitted)="saveUser($event)"
        (avatarSelected)="avatarSelected($event)"
        (userAction)="onAction($event)"
        (leaderSearch)="onLeaderSearch($event)"
      >
        <div class="flex flex-col mt-8">
          <p class="text-sm">{{ 'USERS.DETAIL.WORKSPACES.THIS_WORKSPACE_PERMISSIONS' | transloco | uppercase }}</p>
          <app-roles-form
            [apps]="userRolesVm().applications"
            [userRoles]="userRolesVm().userRoles"
            [disabled]="vm().loading"
          ></app-roles-form>
          @let currentUser = vm().currentUser;
          <div class="flex gap-4 items-center mb-4">
            @let workspaceHasIdp = workspaceIdpEnabled();
            <mat-slide-toggle [disabled]="!workspaceHasIdp" [checked]="currentUser?.use_idp_login" #idpAccessToggle>
              {{ 'USERS.DETAIL.WORKSPACES.IDP_ACCESS' | transloco }}
            </mat-slide-toggle>
            @if (!workspaceHasIdp) {
              <mat-icon [matTooltip]="'USERS.DETAIL.WORKSPACES.NO_IDP_CONFIG' | transloco">info</mat-icon>
            }
          </div>
          <div class="flex gap-4 items-center mb-4">
            <mat-slide-toggle
              [checked]="currentUser?.use_two_factor_auth || currentUser?.two_factor_auth_pending"
              #twoFactorAuthToggle
            >
              {{ 'USERS.DETAIL.WORKSPACES.USE_TWO_FACTOR' | transloco }}
            </mat-slide-toggle>
            @if (currentUser?.two_factor_auth_pending) {
              <mat-icon [matTooltip]="'USERS.DETAIL.WORKSPACES.TWO_FACTOR_PENDING' | transloco">info</mat-icon>
            }
          </div>
          <app-user-workspaces></app-user-workspaces>
        </div>
      </app-user-form>
    }
  `,
  styles: [
    `
      :host {
        height: 100%;
        display: flex;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    UserFormComponent,
    RolesFormComponent,
    TranslocoPipe,
    UpperCasePipe,
    UserWorkspacesComponent,
    MatSlideToggle,
    MatIcon,
    MatTooltip,
  ],
})
export class UserAsideComponent implements OnInit, OnDestroy {
  protected readonly languages: Signal<Language[]>;
  protected readonly vm: Signal<UserDetailViewModel>;
  protected readonly userRolesVm: Signal<UserRolesViewModel>;
  protected readonly jobs: Signal<JobModel[]>;
  protected readonly rolesForm = viewChild(RolesFormComponent);
  protected readonly workspaceIdpEnabled: Signal<boolean>;
  protected readonly idpAccessToggle = viewChild<MatSlideToggle>('idpAccessToggle');
  protected readonly twoFactorToggle = viewChild<MatSlideToggle>('twoFactorAuthToggle');

  constructor(
    private readonly _route: ActivatedRoute,
    private readonly store: Store,
    private readonly usersService: UsersService,
    private readonly languagesService: LanguagesService,
    private readonly workspaceService: WorkspaceService,
  ) {
    this.languages = this.languagesService.languages;
    this.vm = toSignal(store.select(UserDetailsSelector.selectUserDetailVM));
    this.userRolesVm = toSignal(store.select(UserRolesSelectors.selectUserRolesVM));
    this.jobs = toSignal(store.select(globalSettingsFeature.selectJobs));
    this.workspaceIdpEnabled = signal(
      !!this.workspaceService.getCurrentWorkspace()?.default_federated_identity_provider_alias,
    );
  }

  ngOnInit(): void {
    this._route.paramMap.subscribe((params) => {
      if (params.has('id')) {
        this.store.dispatch(UserDetailsActions.openUserDetails({ userId: params.get('id') }));
      } else {
        this.store.dispatch(UserDetailsActions.openCreateUser());
      }
    });
  }

  ngOnDestroy() {
    this.store.dispatch(UserRolesActions.resetState());
  }

  onAction(action: UserDetailAction) {
    const actionMap = new Map<UserDetailAction, () => void>([
      ['sendInvitation', this.sendEmail],
      ['resetPassword', this.resetPassword],
      ['close', this.closeDetails],
      ['delete', this.deleteUser],
      ['importData', this.importData],
    ]);

    if (actionMap.has(action)) {
      actionMap.get(action)();
    }
  }

  private sendEmail = () => this.store.dispatch(UserDetailsActions.sendEmail());

  private resetPassword = () => this.store.dispatch(UserDetailsActions.generateTemporaryPassword());

  private closeDetails = () => this.store.dispatch(UserDetailsActions.closeUserDetails());

  private deleteUser = () => this.store.dispatch(UserDetailsActions.deleteUserFromWorkspace());

  private importData = () => this.store.dispatch(UserDataTransferActions.init());

  saveUser(user: UserCreateDTO) {
    const userRoles = this.rolesForm()?.getSelectedRolesByApplication();
    user.use_idp_login = this.idpAccessToggle()?.checked;
    user.use_two_factor_auth = this.twoFactorToggle()?.checked;
    this.store.dispatch(UserDetailsActions.saveUser({ user, userRoles }));
  }

  avatarSelected(avatar: File) {
    this.usersService.setUserAvatarForUpload(avatar);
  }

  onLeaderSearch(search: string) {
    this.store.dispatch(UserDetailsActions.searchLeaders({ search }));
  }
}
