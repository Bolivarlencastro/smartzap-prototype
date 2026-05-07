import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import {
  MinimalRouterStateSerializer,
  NavigationActionTiming,
  RouterState,
  StoreRouterConnectingModule,
} from '@ngrx/router-store';
import { ActionReducer, MetaReducer, StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { environment } from 'environments/environment';
import { storeFreeze } from 'ngrx-store-freeze';
import { effects, reducers } from '.';
import { UIActions } from './actions';
import { globalSettingsFeature } from './features';

// CLEAR STATE
export function clearState(reducer: ActionReducer<any>): ActionReducer<any> {
  return (state, action) => {
    // IF IS RESET EVENT
    if (action.type === UIActions.reset.type) {
      const { workspacesState } = state;
      state = { workspacesState };
    }

    return reducer(state, action);
  };
}

export const metaReducers: MetaReducer<any>[] = !environment.production ? [storeFreeze, clearState] : [clearState];

@NgModule({
  imports: [
    EffectsModule.forRoot(effects),
    StoreModule.forFeature(globalSettingsFeature),
    StoreModule.forRoot(reducers, {
      metaReducers,
      runtimeChecks: {
        strictStateImmutability: true,
        strictActionImmutability: true,
        strictActionSerializability: false,
        strictStateSerializability: true,
      },
    }),
    StoreRouterConnectingModule.forRoot({
      routerState: RouterState.Minimal,
      serializer: MinimalRouterStateSerializer,
      navigationActionTiming: NavigationActionTiming.PostActivation,
    }),
    StoreDevtoolsModule.instrument({
      maxAge: 25,
      logOnly: environment.production,
      name: 'Smartzap Admin',
      connectInZone: true,
    }),
  ],
})
export class AppStoreModule {}
