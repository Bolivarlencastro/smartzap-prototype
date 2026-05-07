import { importProvidersFrom } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { GlobalSearchService } from './services/global-search.service';
import { GlobalSearchEffects } from './store/effects';
import { GlobalSearchReducer } from './store/reducers';

export const GLOBAL_SEARCH_PROVIDERS = [
  GlobalSearchService,
  importProvidersFrom(
    StoreModule.forFeature(GlobalSearchReducer.globalSearchFeatureKey, GlobalSearchReducer.globalSearchReducers),
    EffectsModule.forFeature([GlobalSearchEffects]),
  ),
];
