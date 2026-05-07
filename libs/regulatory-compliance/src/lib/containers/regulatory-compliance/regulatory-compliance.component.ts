import { Component } from '@angular/core';
import { marker } from '@jsverse/transloco-keys-manager/marker';
import { MatTabLink, MatTabNav, MatTabNavPanel } from '@angular/material/tabs';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { TranslocoPipe } from '@jsverse/transloco';

type RegulatoryComplianceTab = {
  label: string;
  path: string;
};

@Component({
  selector: 'kp-regulatory-compliance',
  template: `
    <nav mat-tab-nav-bar [tabPanel]="tabPanel" fitInkBarToContent>
      @for (tab of tabs; track tab) {
        <a
          [attr.data-test]="'regulatory-compliance-tab-' + tab.path"
          mat-tab-link
          [routerLink]="tab.path"
          routerLinkActive
          #rla="routerLinkActive"
          [active]="rla.isActive"
        >
          {{ tab.label | transloco }}
        </a>
      }
    </nav>
    <mat-tab-nav-panel #tabPanel class="flex-grow">
      <router-outlet></router-outlet>
    </mat-tab-nav-panel>
  `,
  styles: [
    `
      :host {
        display: flex;
        flex-direction: column;
        flex-grow: 1;
      }
    `,
  ],
  imports: [MatTabNav, MatTabLink, RouterLinkActive, RouterLink, MatTabNavPanel, RouterOutlet, TranslocoPipe],
})
export class RegulatoryComplianceComponent {
  protected readonly tabs: RegulatoryComplianceTab[] = [
    {
      label: marker('REGULATORY_COMPLIANCE.MANAGEMENT'),
      path: 'management',
    },
    {
      label: marker('REGULATORY_COMPLIANCE.CREATION'),
      path: 'creation',
    },
  ];
}
