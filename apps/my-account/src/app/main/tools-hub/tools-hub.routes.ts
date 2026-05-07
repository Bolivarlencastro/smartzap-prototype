import { importProvidersFrom } from '@angular/core';
import { Routes } from '@angular/router';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { ToolsHubService } from './services/tools-hub.service';
import { ToolsHubEffects, toolsHubFeature } from './store';
import { ToolsHubComponent } from './tools-hub.component';

export default [
  {
    path: '',
    component: ToolsHubComponent,
    providers: [
      importProvidersFrom([StoreModule.forFeature(toolsHubFeature), EffectsModule.forFeature(ToolsHubEffects)]),
      ToolsHubService,
    ],
  },
] as Routes;
