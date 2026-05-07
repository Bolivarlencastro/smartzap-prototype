import { createFeature, createReducer, on } from '@ngrx/store';
import { ProviderDto } from '../../model/external-providers.dto';
import { EntityState, createEntityAdapter } from '@ngrx/entity';
import { ExternalProviderHeaderActions, ExternalProviderListActions } from '../actions';

export interface ExternalProvidersListFeaturesState extends EntityState<ProviderDto> {
  isLoading: boolean;
}

const adapter = createEntityAdapter<ProviderDto>();

export const externalProviderList: ExternalProvidersListFeaturesState = adapter.getInitialState({
  isLoading: false,
});

const reducer = createReducer(
  externalProviderList,

  on(ExternalProviderListActions.loadProviders, (state): ExternalProvidersListFeaturesState => {
    return adapter.removeAll({ ...state, isLoading: true });
  }),

  on(ExternalProviderListActions.loadProvidersSucess, (state, { payload }): ExternalProvidersListFeaturesState => {
    return adapter.setAll(payload, { ...state, isLoading: false });
  }),

  on(ExternalProviderHeaderActions.newProviderSucess, (state, { newProvider }): ExternalProvidersListFeaturesState => {
    return adapter.addOne(newProvider, state);
  }),

  on(ExternalProviderListActions.deleteProviderSucess, (state, { idProvider }): ExternalProvidersListFeaturesState => {
    return adapter.removeOne(idProvider, state);
  }),

  on(
    ExternalProviderListActions.loadProvidersFailure,
    (state): ExternalProvidersListFeaturesState => ({ ...state, isLoading: false }),
  ),
);

export const externalProviderFeature = createFeature({
  name: 'externalProvidersProvider',
  reducer,
  extraSelectors: ({ selectExternalProvidersProviderState }) => ({
    ...adapter.getSelectors(selectExternalProvidersProviderState),
  }),
});
