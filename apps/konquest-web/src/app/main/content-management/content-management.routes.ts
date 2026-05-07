import { importProvidersFrom } from '@angular/core';
import { Routes } from '@angular/router';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { ContentManagementComponent } from './containers/content-management.component';
import { CoursesPageComponent } from './containers/courses-page.component';
import { EventsPageComponent } from './containers/events-page.component';
import { TrailsPageComponent } from './containers/trails-page.component';
import { ChannelsPageComponent } from './containers/channels-page.component';
import { CONTENT_MANAGEMENT_ROUTES } from './management-routes-definition';
import { MANAGEMENT_ACTIONS_PROVIDERS } from './services/content-management-actions/management-actions-providers';
import { contentManagementGuard, getDefaultManagementRedirect } from './services/content-management.guard';
import { contentManagementListFeature } from './store/content-management-list.feature';
import { CONTENT_MANAGEMENT_EFFECTS } from './store/effects';

const PROVIDERS = [
  ...MANAGEMENT_ACTIONS_PROVIDERS,
  importProvidersFrom([
    StoreModule.forFeature(contentManagementListFeature),
    EffectsModule.forFeature(CONTENT_MANAGEMENT_EFFECTS),
  ]),
];

export default [
  {
    path: '',
    component: ContentManagementComponent,
    providers: PROVIDERS,
    canActivate: [contentManagementGuard],
    children: [
      {
        path: '',
        redirectTo: getDefaultManagementRedirect(),
        pathMatch: 'full',
      },
      {
        path: CONTENT_MANAGEMENT_ROUTES.courses.path,
        component: CoursesPageComponent,
        data: { contentType: CONTENT_MANAGEMENT_ROUTES.courses.contentType },
      },
      {
        path: CONTENT_MANAGEMENT_ROUTES.events.path,
        component: EventsPageComponent,
        data: { contentType: CONTENT_MANAGEMENT_ROUTES.events.contentType },
      },
      {
        path: CONTENT_MANAGEMENT_ROUTES.trails.path,
        component: TrailsPageComponent,
        data: { contentType: CONTENT_MANAGEMENT_ROUTES.trails.contentType },
      },
      {
        path: CONTENT_MANAGEMENT_ROUTES.channels.path,
        component: ChannelsPageComponent,
        data: { contentType: CONTENT_MANAGEMENT_ROUTES.channels.contentType },
      },
    ],
  },
] as Routes;
