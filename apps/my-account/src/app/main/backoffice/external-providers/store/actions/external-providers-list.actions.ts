import { createAction, props } from '@ngrx/store';
import { ProviderDto } from '../../model/external-providers.dto';

export const loadProviders = createAction('[External Providers List] Load Providers');

export const loadProvidersSucess = createAction(
  '[External Providers List] Load Providers Sucess',
  props<{ payload: ProviderDto[] }>(),
);

export const loadProvidersFailure = createAction('[External Providers List] Load Providers Failure');

export const OpenDialogDelete = createAction('[External Providers List] Open Dialog', props<{ idProvider: string }>());

export const openDialogEdit = createAction(
  '[External Providers List] Open Edit Dialog',
  props<{ provider: ProviderDto }>(),
);

export const deleteProvider = createAction(
  '[External Providers List] Delete Provider',
  props<{ idProvider: string }>(),
);

export const deleteProviderSucess = createAction(
  '[External Providers List] Delete Provider Sucess',
  props<{ idProvider: string }>(),
);

export const editProvider = createAction(
  '[External Providers List] Edit Provider',
  props<{ providerId: string; formData: FormData }>(),
);

export const editProviderSucess = createAction(
  '[External Providers List] Edit Provider Sucess',
  props<{ idProvider: string; editProvider: ProviderDto }>(),
);

export const deleteProviderFailure = createAction('[External Providers List] Delete Provider Failure');
