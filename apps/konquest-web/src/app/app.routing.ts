import { Routes } from '@angular/router';
import {
  canActivateAuthGuard,
  workspacesGuardActivate,
  workspacesGuardMatch,
} from '@keeps-platform-frontend-workspace/kp-keeps';
import { environment } from 'environments/environment';
import { AdminGuard } from './shared/guard/admin.guard';
import { CertificatesComponent } from '@keeps-platform-frontend-workspace/custom-certificates';
import { MarketplaceComponent } from './main/marketplace/marketplace.component';
import { serviceActive } from 'app/shared/guard/service-active.guard';
import { ContentCreatorGuard } from './shared/guard/content-creator.guard';
import { customSectionsFeature } from './shared/guard/custom-sections-feature.guard';
import { NotFoundComponent } from 'app/shared/components/not-found/not-found.component';

const KONQUEST_SERVICES = environment.apps.konquest.services;

export const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./main/home/home.routes'),
    canMatch: [workspacesGuardMatch],
    data: { serviceId: KONQUEST_SERVICES.customSections.id },
    canActivate: [workspacesGuardActivate, canActivateAuthGuard, serviceActive],
  },
  {
    path: 'learn-contents',
    loadChildren: () => import('./main/section-contents/section-contents.routes'),
    canMatch: [workspacesGuardMatch],
    data: { serviceId: KONQUEST_SERVICES.customSections.id },
    canActivate: [workspacesGuardActivate, canActivateAuthGuard, serviceActive],
  },
  {
    path: 'dashboard',
    loadChildren: () => import('./main/dashboard/dashboard.routes'),
    data: { serviceId: KONQUEST_SERVICES.dashboard.id },
    canActivate: [workspacesGuardActivate, canActivateAuthGuard, serviceActive, customSectionsFeature],
  },
  {
    path: 'workspaces',
    loadChildren: () =>
      import('@keeps-platform-frontend-workspace/workspaces').then((m) => {
        m.WorkspacesModule.moduleConfig = { logoUrl: environment.workspacesPageLogo, environment };
        return m.WorkspacesModule;
      }),
    data: { layout: 'empty' },
  },
  {
    path: 'channels',
    loadChildren: () => import('./main/channel/channel.routes'),
    canMatch: [workspacesGuardMatch],
    data: { serviceId: KONQUEST_SERVICES.pulse.id },
    canActivate: [workspacesGuardActivate, canActivateAuthGuard, serviceActive],
  },
  {
    path: 'pulses-feed',
    loadChildren: () => import('./main/pulses-feed/pulses-feed.routes'),
    canMatch: [workspacesGuardMatch],
    data: { serviceId: KONQUEST_SERVICES.pulse.id },
    canActivate: [workspacesGuardActivate, canActivateAuthGuard, serviceActive],
  },
  {
    path: 'learning-trails',
    loadChildren: () => import('./main/learning-trail/learning-trail.routes'),
    data: { serviceId: KONQUEST_SERVICES.learning_trail.id },
    canActivate: [workspacesGuardActivate, canActivateAuthGuard, serviceActive],
  },
  {
    path: 'missions',
    loadChildren: () => import('./main/mission/mission.routes'),
    canMatch: [workspacesGuardMatch],
    data: { serviceId: KONQUEST_SERVICES.mission.id },
    canActivate: [workspacesGuardActivate, canActivateAuthGuard],
  },
  {
    path: 'events',
    loadChildren: () => import('./main/mission/mission.routes'),
    canMatch: [workspacesGuardMatch],
    data: { serviceId: KONQUEST_SERVICES.event.id },
    canActivate: [workspacesGuardActivate, canActivateAuthGuard, serviceActive],
  },
  {
    path: 'course',
    loadChildren: () => import('@keeps-platform-frontend-workspace/classroom').then((m) => m.classRoomRoutes),
    data: { layout: 'empty', serviceId: KONQUEST_SERVICES.mission.id },
    canMatch: [workspacesGuardMatch],
    canActivate: [workspacesGuardActivate, canActivateAuthGuard],
  },
  {
    path: 'view-as-user',
    loadChildren: () => import('@keeps-platform-frontend-workspace/classroom').then((m) => m.classroomViewAsUserRoutes),
    data: { layout: 'empty' },
    canMatch: [workspacesGuardMatch],
    canActivate: [workspacesGuardActivate, canActivateAuthGuard],
  },
  {
    path: 'settings',
    loadChildren: () => import('./main/setting/setting.routes'),
    canMatch: [workspacesGuardMatch],
    canActivate: [workspacesGuardActivate, canActivateAuthGuard],
  },
  {
    path: 'enrollments',
    loadChildren: () => import('./main/enrollments/enrollments.routes'),
    canMatch: [workspacesGuardMatch],
    canActivate: [workspacesGuardActivate, canActivateAuthGuard],
  },
  {
    path: 'profile',
    loadChildren: () =>
      import('@keeps-platform-frontend-workspace/profile').then((m) => {
        m.ProfileModule.moduleConfig = {
          keycloak: {
            url: environment.keycloakConfig.url,
            realm: environment.keycloakConfig.realm,
            clientId: environment.keycloakConfig.clientId,
          },
        };
        return m.ProfileModule;
      }),
    canMatch: [workspacesGuardMatch],
    canActivate: [workspacesGuardActivate, canActivateAuthGuard],
  },
  {
    path: 'regulatory-compliance',
    loadChildren: () =>
      import('@keeps-platform-frontend-workspace/regulatory-compliance').then((m) => m.RegulatoryComplianceModule),
    canMatch: [workspacesGuardMatch],
    data: { serviceId: KONQUEST_SERVICES.regulatory_compliance.id },
    canActivate: [workspacesGuardActivate, canActivateAuthGuard, serviceActive],
  },
  {
    path: 'custom-certificates',
    component: CertificatesComponent,
    canMatch: [workspacesGuardMatch],
    canActivate: [workspacesGuardActivate, canActivateAuthGuard],
  },
  {
    path: 'gamification',
    loadChildren: () => import('@keeps-platform-frontend-workspace/gamification').then((m) => m.GamificationModule),
    canMatch: [workspacesGuardMatch],
    data: { serviceId: KONQUEST_SERVICES.gamification.id },
    canActivate: [workspacesGuardActivate, canActivateAuthGuard, serviceActive],
  },
  {
    path: 'integrations',
    loadChildren: () =>
      import('@keeps-platform-frontend-workspace/integrations').then((m) => {
        m.IntegrationsModule.moduleConfig = { environment };
        return m.IntegrationsModule;
      }),
    canMatch: [workspacesGuardMatch],
    canActivate: [workspacesGuardActivate, canActivateAuthGuard, AdminGuard],
  },
  {
    path: 'custom-sections',
    loadChildren: () => import('./main/custom-sections/custom-sections.routes'),
    canMatch: [workspacesGuardMatch],
    data: { serviceId: KONQUEST_SERVICES.customSections.id },
    canActivate: [workspacesGuardActivate, canActivateAuthGuard],
  },
  {
    path: 'marketplace',
    component: MarketplaceComponent,
    canMatch: [workspacesGuardMatch],
    canActivate: [workspacesGuardActivate, canActivateAuthGuard],
  },
  {
    path: 'management',
    loadChildren: () => import('./main/content-management/content-management.routes'),
    canMatch: [workspacesGuardMatch],
    canActivate: [workspacesGuardActivate, canActivateAuthGuard, ContentCreatorGuard],
  },
  {
    path: 'event-management',
    loadChildren: () => import('./main/event-management/event-management.routes'),
    canMatch: [workspacesGuardMatch],
    canActivate: [workspacesGuardActivate, canActivateAuthGuard, serviceActive],
  },
  {
    path: 'channel-pulses-management',
    loadChildren: () => import('./main/channel-pulses-management/channel-pulses-management.routes'),
    canMatch: [workspacesGuardMatch],
    data: { serviceId: KONQUEST_SERVICES.pulse.id },
    canActivate: [workspacesGuardActivate, canActivateAuthGuard, serviceActive],
  },
  {
    path: 'leader-panel',
    loadChildren: () => import('@keeps-platform-frontend-workspace/leader-panel').then((m) => m.leaderPanelRoutes),
    canMatch: [workspacesGuardMatch],
    canActivate: [workspacesGuardActivate, canActivateAuthGuard, AdminGuard],
  },
  { path: '', pathMatch: 'full', redirectTo: environment.routeHome },
  { path: '404', loadComponent: () => NotFoundComponent },
  { path: '**', redirectTo: '404' },
];
