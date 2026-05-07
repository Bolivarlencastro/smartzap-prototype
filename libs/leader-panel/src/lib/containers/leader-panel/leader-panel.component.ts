import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { TranslocoPipe } from '@jsverse/transloco';
import { LeaderPanelTab } from '../../models/tabs';
import { TabsService } from '../../services/tabs.service';

@Component({
  imports: [MatTabsModule, RouterLink, RouterOutlet, RouterLinkActive, TranslocoPipe, MatIcon, MatTooltipModule],
  template: `
    <div class="h-20 flex items-center px-6 gap-2">
      <span class="text-2xl font-semibold">{{ 'LEADER_PANEL.TITLE' | transloco }}</span>
      <mat-icon class="s-6" [matTooltip]="'LEADER_PANEL.TITLE_TOOLTIP' | transloco" matTooltipPosition="right"
        >info</mat-icon
      >
    </div>

    <nav mat-tab-nav-bar [tabPanel]="tabPanel" [mat-stretch-tabs]="false" fitInkBarToContent>
      @for (tab of tabs; track tab.path) {
        <a mat-tab-link [routerLink]="tab.path" routerLinkActive #rla="routerLinkActive" [active]="rla.isActive">
          <mat-icon class="mr-2">{{ tab.icon }}</mat-icon>
          {{ tab.label | transloco }}
        </a>
      }
    </nav>
    <mat-tab-nav-panel #tabPanel class="grow">
      <router-outlet></router-outlet>
    </mat-tab-nav-panel>
  `,
  styles: `
    :host {
      height: 100%;
      display: flex;
      flex-direction: column;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LeaderPanelComponent {
  protected readonly tabs: LeaderPanelTab[];

  constructor(private readonly tabsService: TabsService) {
    this.tabs = this.tabsService.getLeaderPanelTabs();
  }
}
