import { createAction, props } from '@ngrx/store';
import { ProviderDto } from '../../model/external-providers.dto';

export const newProvider = createAction(
  '[External Providers Header] Create a new Provider',
  props<{ newProvider: ProviderDto }>(),
);

export const newProviderSucess = createAction(
  '[External Providers Header] Create a new Provider Sucess',
  props<{ newProvider: ProviderDto }>(),
);

export const newProviderFailure = createAction('[External Providers Header] Create a new Provider Failure');
