import { Component, ViewChild } from '@angular/core';
import { MatTab, MatTabGroup } from '@angular/material/tabs';
import { UserProfileService } from '@keeps-platform-frontend-workspace/kp-keeps';
import { LatestReportTabComponent } from './latest-report-tab/latest-report-tab.component';
import { environment } from 'environments/environment';
import { FuseScrollbarModule } from '@keeps-platform-frontend-workspace/layout';
import { MatIcon } from '@angular/material/icon';
import { KonquestReportsTabComponent } from './konquest-reports-tab/konquest-reports-tab.component';
import { SmartZapReportsTabComponent } from './smart-zap-reports-tab/smart-zap-reports-tab.component';
import { TranslocoPipe } from '@jsverse/transloco';

@Component({
  selector: 'app-reports',
  template: `
    <div class="page-layout page-layout-container blank" fuseScrollbar>
      <div class="flex items-center pt-5 px-5">
        <mat-icon class="material-icons-outlined">assessment</mat-icon>
        <h1 class="text-2xl" [innerHTML]="'REPORT.TITLE' | transloco"></h1>
      </div>

      <mat-tab-group class="report-collection pb-5" [selectedIndex]="1" (selectedTabChange)="onChangeTab()">
        <mat-tab class="flex flex-col" [label]="'REPORT.TABS.LATEST_REPORTS' | transloco">
          <app-latest-report-tab></app-latest-report-tab>
        </mat-tab>

        <mat-tab class="flex flex-col" label="Konquest">
          <app-konquest-reports-tab></app-konquest-reports-tab>
        </mat-tab>

        <mat-tab class="flex flex-col" label="SmartZap" [disabled]="!isSmartzapAdmin">
          <app-smart-zap-reports-tab></app-smart-zap-reports-tab>
        </mat-tab>
      </mat-tab-group>
    </div>
  `,
  imports: [
    FuseScrollbarModule,
    MatIcon,
    MatTabGroup,
    MatTab,
    LatestReportTabComponent,
    KonquestReportsTabComponent,
    SmartZapReportsTabComponent,
    TranslocoPipe,
  ],
})
export class ReportsComponent {
  @ViewChild(MatTabGroup) tabGroup!: MatTabGroup;
  @ViewChild(LatestReportTabComponent) latestReportTab!: LatestReportTabComponent;
  isSmartzapAdmin: boolean;

  constructor(private _userProfileService: UserProfileService) {
    this.isSmartzapAdmin = this._userProfileService.isApplicationAdmin(environment.apps.smartzap.id);
  }

  onChangeTab() {
    if (this.tabGroup.selectedIndex === 0) {
      this.latestReportTab.refreshResults();
    }
  }
}
