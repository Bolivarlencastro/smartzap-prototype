import { Component, Signal, ViewEncapsulation } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { globalSettingsFeature } from '@app/shared/store/features';
import { Workspace } from '@keeps-platform-frontend-workspace/kp-keeps';
import { fuseAnimations, FuseScrollbarModule } from '@keeps-platform-frontend-workspace/layout';
import { Store } from '@ngrx/store';
import { WorkspacePageWrapperComponent } from 'app/main/workspace/components';
import { MatTab, MatTabGroup } from '@angular/material/tabs';
import { WorkspaceInfoComponent } from './workspace-info.component';
import { WorkspaceLayoutComponent } from './workspace-layout.component';
import { IfRolesDirective } from 'app/shared/auth';
import { WorkspaceSettingsComponent } from './workspace-settings.component';
import { JobManagementWrapperComponent } from '../../job-management/containers/job-management-wrapper/job-management-wrapper.component';
import { SMTPComponent } from './smtp/smtp.component';
import { TranslocoPipe } from '@jsverse/transloco';

@Component({
  selector: 'workspace-profile',
  styleUrls: ['./workspace-profile.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
  template: `
    <app-workspace-page-wrapper class="flex flex-1" [workspace]="workspace()">
      <mat-tab-group [selectedIndex]="1">
        <mat-tab [label]="'WORKSPACES.DETAIL.TABS.GENERAL' | transloco">
          <app-workspace-info></app-workspace-info>
        </mat-tab>
        <mat-tab [label]="'WORKSPACES.DETAIL.TABS.LAYOUT' | transloco">
          <div class="tab-content p-6">
            <app-workspace-layout></app-workspace-layout>
          </div>
        </mat-tab>
        <mat-tab *ifRoles="['keeps_platform_admin']" [label]="'WORKSPACES.DETAIL.TABS.SETTING' | transloco">
          <div class="tab-content p-6">
            <app-workspace-settings></app-workspace-settings>
          </div>
        </mat-tab>
        <mat-tab [label]="'JOB_MANAGEMENT.TAB_TITLE' | transloco">
          <div class="tab-content p-6" fuseScrollbar>
            <app-job-management-wrapper></app-job-management-wrapper>
          </div>
        </mat-tab>

        <mat-tab *ifRoles="['keeps_admin', 'company_admin']" label="SMTP">
          <div class="tab-content p-6" fuseScrollbar>
            <app-smtp></app-smtp>
          </div>
        </mat-tab>
      </mat-tab-group>
    </app-workspace-page-wrapper>
  `,
  imports: [
    WorkspacePageWrapperComponent,
    MatTabGroup,
    MatTab,
    WorkspaceInfoComponent,
    WorkspaceLayoutComponent,
    IfRolesDirective,
    WorkspaceSettingsComponent,
    FuseScrollbarModule,
    JobManagementWrapperComponent,
    SMTPComponent,
    TranslocoPipe,
  ],
})
export class WorkspaceProfileComponent {
  isKeepsAdmin: boolean;
  workspace: Signal<Workspace>;

  constructor(private store: Store) {
    this.workspace = toSignal(store.select(globalSettingsFeature.selectBuildedWorkspace));
    this.isKeepsAdmin = true;
  }
}
