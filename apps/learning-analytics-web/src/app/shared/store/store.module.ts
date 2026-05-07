import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import {
  MinimalRouterStateSerializer,
  NavigationActionTiming,
  RouterState,
  StoreRouterConnectingModule,
} from '@ngrx/router-store';
import { MetaReducer, StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
/* CustomSerializer */
import { environment } from 'environments/environment';
import { storeFreeze } from 'ngrx-store-freeze';
import { effects, reducers } from '.';
import { globalSettingsFeature } from './features';

export const metaReducers: MetaReducer<any>[] = !environment.production ? [storeFreeze] : [];

@NgModule({
  imports: [
    StoreModule.forRoot(reducers, {
      metaReducers,
      runtimeChecks: {
        strictStateImmutability: true,
        strictActionImmutability: true,
        strictActionSerializability: false,
        strictStateSerializability: true,
      },
    }),
    EffectsModule.forRoot(effects),
    StoreModule.forFeature(globalSettingsFeature),
    StoreDevtoolsModule.instrument({
      maxAge: 25,
      logOnly: environment.production,
      name: 'Analytics',
      connectInZone: true,
    }),
    StoreRouterConnectingModule.forRoot({
      routerState: RouterState.Minimal,
      serializer: MinimalRouterStateSerializer,
      navigationActionTiming: NavigationActionTiming.PostActivation,
    }),
  ],
})
export class AppStoreModule {}
