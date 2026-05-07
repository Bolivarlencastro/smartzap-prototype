import { ChangeDetectionStrategy, Component, Input, OnChanges, output, SimpleChanges } from '@angular/core';
import {
  ApplicationWithRoles,
  SetUserApplicationRolesDto,
  UserApplicationRoles,
} from '@keeps-platform-frontend-workspace/kp-keeps';
import { FormBuilder, FormControl, ReactiveFormsModule, UntypedFormGroup } from '@angular/forms';
import { environment } from 'environments/environment';
import { MatFormField } from '@angular/material/form-field';
import { TranslocoPipe } from '@jsverse/transloco';
import { MatSelectModule } from '@angular/material/select';
import { UpperCasePipe } from '@angular/common';

const KEEPS_ADMIN_ROLE_ID = environment.roleKeepsAdmin;

@Component({
  selector: 'app-roles-form',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, MatFormField, MatSelectModule, TranslocoPipe, UpperCasePipe],
  template: `
    @if (rolesForm) {
      <form [formGroup]="rolesForm" class="flex flex-col my-8 gap-6">
        @for (app of apps; track app.id) {
          <mat-form-field subscriptSizing="dynamic" class="grow" appearance="outline">
            <mat-label>{{ app.name }}</mat-label>
            <mat-select
              [attr.data-test]="'selector-role-' + app.name.toLowerCase()"
              [placeholder]="'GENERAL.APPS_ROLES.NO_PERMISSIONS' | transloco"
              [formControlName]="app.id"
              (selectionChange)="onRoleChange()"
            >
              <mat-option>
                {{ 'GENERAL.APPS_ROLES.NO_PERMISSIONS' | transloco }}
              </mat-option>
              @for (role of app.roles; track role.id) {
                <mat-option
                  [attr.data-test]="'role-' + role.key"
                  [value]="role.key"
                  [disabled]="roleOptionDisabled(role.id)"
                >
                  {{ 'GENERAL.APPS_ROLES.' + role.key | uppercase | transloco }}
                </mat-option>
              }
            </mat-select>
          </mat-form-field>
        }
      </form>
    } @else {
      <p class="my-6 font-medium">
        {{ 'GENERAL.APPS_ROLES.NO_APPLICATIONS' | transloco }}
      </p>
    }
  `,
})
export class RolesFormComponent implements OnChanges {
  @Input() apps: ApplicationWithRoles[];
  @Input() userRoles: UserApplicationRoles[];
  @Input() disabled: boolean;
  protected rolesForm: UntypedFormGroup;
  readonly roleChanged = output<void>();

  constructor(private readonly formBuilder: FormBuilder) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes['apps'] || changes['userRoles']) {
      this.setupFormOnChanges();
    }

    if (changes['disabled']) {
      this.toggleFormEnabledStatus(this.disabled);
    }
  }

  roleOptionDisabled(roleId: string) {
    return roleId === KEEPS_ADMIN_ROLE_ID;
  }

  getSelectedRolesByApplication(): SetUserApplicationRolesDto[] {
    if (!this.rolesForm) {
      return [];
    }

    const formValue: Record<string, string> = this.rolesForm.value;
    const rolesByApplication: SetUserApplicationRolesDto[] = [];

    this.apps.forEach((app) => {
      const roleId = this.getApplicationRoleId(app.id, formValue[app.id]);

      const applicationRoles: SetUserApplicationRolesDto = {
        applicationId: app.id,
        roles: roleId ? [roleId] : [],
      };
      rolesByApplication.push(applicationRoles);
    });

    return rolesByApplication;
  }

  onRoleChange() {
    this.roleChanged.emit();
  }

  private setupFormOnChanges() {
    if (!this.rolesForm && this.apps?.length) {
      this.rolesForm = this.buildForm(this.apps);
    }

    if (this.userRoles?.length) {
      this.patchForm(this.userRoles);
    }
  }

  private buildForm(apps: ApplicationWithRoles[]): UntypedFormGroup {
    const formControls = apps.reduce(
      (controls, app) => {
        controls[app.id] = new FormControl('');
        return controls;
      },
      {} as Record<string, FormControl>,
    );
    return this.formBuilder.group(formControls);
  }

  private patchForm(userRoles: UserApplicationRoles[]) {
    if (!userRoles.length || !this.rolesForm) {
      return;
    }

    const rolesByApp: Record<string, string> = userRoles.reduce((roles, role) => {
      roles[role.application.id] = role.roles.at(0);
      return roles;
    }, {});

    this.rolesForm.patchValue(rolesByApp);
  }

  private toggleFormEnabledStatus(disabled: boolean) {
    if (disabled) {
      this.rolesForm?.disable();
      return;
    }
    this.rolesForm?.enable();
  }

  private getApplicationRoleId(applicationId: string, roleKey: string): string {
    const application = this.apps.find((app) => app.id === applicationId);
    const role = application?.roles.find((role) => role.key === roleKey);
    return role?.id;
  }
}
