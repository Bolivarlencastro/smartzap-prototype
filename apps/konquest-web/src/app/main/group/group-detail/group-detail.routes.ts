import { importProvidersFrom } from '@angular/core';
import { Routes } from '@angular/router';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { GroupDetailComponent } from './containers';
import { GroupDetailService } from './services/group-detail.service';
import { GroupDetailEffects, groupDetailFeature } from './store';

const PROVIDERS = [
  importProvidersFrom(EffectsModule.forFeature([GroupDetailEffects]), StoreModule.forFeature(groupDetailFeature)),
  GroupDetailService,
];

export default [
  {
    path: '',
    component: GroupDetailComponent,
    children: [
      { path: '', redirectTo: 'users', pathMatch: 'full' },
      {
        path: 'users',
        loadChildren: () => import('../group-user/group-user.routes'),
      },
      {
        path: 'learning-trails',
        loadChildren: () => import('../group-learning-trail/group-learning-trail.routes'),
      },
      {
        path: 'missions',
        loadChildren: () => import('../group-mission/group-mission.routes'),
      },
      {
        path: 'channels',
        loadChildren: () => import('../group-channel/group-channel.routes'),
      },
    ],
    providers: PROVIDERS,
  },
] as Routes;
