import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { FullRouterStateSerializer, RouterStateSerializer, StoreRouterConnectingModule } from '@ngrx/router-store';
import { MetaReducer, StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { environment } from 'environments/environment';
import { storeFreeze } from 'ngrx-store-freeze';
import { CustomSerializer, effects, reducers } from '.';
import { globalSettingsFeature } from './features';

export const metaReducers: MetaReducer<any>[] = !environment.production ? [storeFreeze] : [];

@NgModule({
  imports: [
    StoreModule.forRoot(reducers, { metaReducers }),
    EffectsModule.forRoot(effects),
    StoreModule.forFeature(globalSettingsFeature),
    StoreDevtoolsModule.instrument({
      maxAge: 25,
      name: 'My Account',
      logOnly: environment.production,
      connectInZone: true,
    }),
    StoreRouterConnectingModule.forRoot({
      serializer: FullRouterStateSerializer,
    }),
  ],
  providers: [
    {
      provide: RouterStateSerializer,
      useClass: CustomSerializer,
    },
  ],
})
export class AppStoreModule {}
