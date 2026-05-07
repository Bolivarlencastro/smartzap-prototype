import { createFeature, createReducer, on } from '@ngrx/store';
import { IntegrationGroup } from '../../models/integrations-model';
import { IntegrationsActions } from '../actions';

export interface IntegrationsFeatureState {
  integrations: IntegrationGroup[];
}

export const integrationsInitialState: IntegrationsFeatureState = {
  integrations: null,
};

export const integrationsReducer = createReducer(
  integrationsInitialState,

  on(
    IntegrationsActions.loadIntegrationsSuccess,
    (state, { integrations }): IntegrationsFeatureState => ({ ...state, integrations }),
  ),

  on(IntegrationsActions.resetState, (): IntegrationsFeatureState => integrationsInitialState),
);

export const integrationsFeature = createFeature({
  name: 'integrations',
  reducer: integrationsReducer,
});
