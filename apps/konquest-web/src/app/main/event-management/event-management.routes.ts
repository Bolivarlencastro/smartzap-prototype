import { importProvidersFrom } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { EventManagementComponent } from './event-management.component';
import { EventManagementUserActionsService } from './services/event-management-user-actions.service';
import { EventManagementService } from './services/event-management.service';
import { EventManagementEffects, EventManagementUserActionsEffects, ImportListEffects } from './store/effects';
import { eventManagementFeature, importListFeature } from './store/features';

const SERVICES = [EventManagementService, EventManagementUserActionsService];
const EFFECTS = [EventManagementEffects, EventManagementUserActionsEffects, ImportListEffects];

const PROVIDERS = [
  importProvidersFrom([
    StoreModule.forFeature(eventManagementFeature),
    StoreModule.forFeature(importListFeature),
    EffectsModule.forFeature(EFFECTS),
  ]),
  ...SERVICES,
];

export default [
  {
    path: ':eventId',
    component: EventManagementComponent,
    providers: [PROVIDERS],
  },
];
