import { createAction, props } from '@ngrx/store';
import { Integration, IntegrationGroup } from '../../models/integrations-model';

export const loadIntegrations = createAction('[Integrations] Load Integrations');
export const loadIntegrationsSuccess = createAction(
  '[Integrations] Load Integrations Success',
  props<{ integrations: IntegrationGroup[] }>(),
);

export const toggleIntegration = createAction(
  '[Integrations] Toggle Integration',
  props<{ integration: Integration; enabled: boolean }>(),
);

export const openInstructions = createAction('[Integrations] Open Instructions', props<{ integration: Integration }>());

export const resetState = createAction('[Gamification] Reset State');
