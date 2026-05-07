import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { TranslocoPipe } from '@jsverse/transloco';
import { ContentManagementHeaderComponent } from '../components/content-management-header/content-management-header.component';
import { ManagementRoute } from '../management-routes-definition';
import { ManagementRouteResolver } from '../services/management-route-resolver.service';

@Component({
  selector: 'app-content-management',
  imports: [
    ContentManagementHeaderComponent,
    MatTabsModule,
    RouterLink,
    RouterOutlet,
    RouterLinkActive,
    TranslocoPipe,
    MatIcon,
    MatButton,
  ],
  providers: [ManagementRouteResolver],
  template: `
    <app-content-management-header />
    <nav mat-tab-nav-bar [tabPanel]="tabPanel" [mat-stretch-tabs]="false" fitInkBarToContent>
      @for (route of managementRoutes; track route.path) {
        <a
          [attr.data-test]="'content-management-tab-' + route.path"
          mat-tab-link
          [routerLink]="route.path"
          routerLinkActive
          #rla="routerLinkActive"
          [active]="rla.isActive"
        >
          <mat-icon class="mr-2">{{ route.icon }}</mat-icon>
          {{ route.label | transloco }}
        </a>
      }
    </nav>
    <mat-tab-nav-panel #tabPanel class="grow flex flex-col overflow-hidden">
      <router-outlet></router-outlet>
      @if (!managementRoutes.length) {
        <div class="grid w-full h-full place-content-center justify-items-center">
          <p>{{ 'CONTENT_MANAGEMENT.NO_SERVICES' | transloco }}</p>
          <a matButton class="mt-2" routerLink="/settings/configurations">{{
            'NAVIGATION.CONFIGURATIONS' | transloco
          }}</a>
        </div>
      }
    </mat-tab-nav-panel>
  `,
  styles: `
    :host {
      height: 100%;
      display: flex;
      flex-direction: column;
      --mat-tab-header-divider-color: var(--mat-sys-outline-variant);
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContentManagementComponent {
  protected readonly managementRoutes: ManagementRoute[];

  constructor(private readonly contentManagementRouteResolver: ManagementRouteResolver) {
    this.managementRoutes = this.contentManagementRouteResolver.getRoutes();
  }
}
