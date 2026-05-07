import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreRouterConnectingModule } from '@ngrx/router-store';
import { MetaReducer, StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { environment } from 'environments/environment';
import { storeFreeze } from 'ngrx-store-freeze';
import { effects } from './effects';
import {
  categoriesFeature,
  cyclesFeature,
  gamificationFeature,
  globalSettingsFeature,
  missionListingConfigFeature,
  providersFeature,
  vinculateToGroupFeature,
} from './features';
import { reducers } from './reducers';

export const metaReducers: MetaReducer<any>[] = !environment.production ? [storeFreeze] : [];

@NgModule({
  imports: [
    StoreModule.forRoot(reducers, { metaReducers }),
    StoreModule.forFeature(gamificationFeature),
    StoreModule.forFeature(cyclesFeature),
    StoreModule.forFeature(vinculateToGroupFeature),
    StoreModule.forFeature(globalSettingsFeature),
    StoreModule.forFeature(categoriesFeature),
    StoreModule.forFeature(providersFeature),
    StoreModule.forFeature(missionListingConfigFeature),
    EffectsModule.forRoot(effects),
    StoreDevtoolsModule.instrument({
      maxAge: 25,
      logOnly: environment.production,
      name: 'Konquest',
      connectInZone: true,
    }),
    StoreRouterConnectingModule.forRoot(),
  ],
})
export class AppStoreModule {}
