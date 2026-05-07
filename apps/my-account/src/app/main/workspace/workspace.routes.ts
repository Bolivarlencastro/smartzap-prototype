import { importProvidersFrom } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { Routes } from '@angular/router';
import { WorkspaceProfileComponent } from 'app/main/workspace/containers';
import { JobManagementEffects, jobManagementFeature } from 'app/main/job-management/store';

const PROVIDERS = [
  importProvidersFrom(StoreModule.forFeature(jobManagementFeature), EffectsModule.forFeature(JobManagementEffects)),
];

export default [
  {
    path: '',
    component: WorkspaceProfileComponent,
    providers: PROVIDERS,
  },
] as Routes;
