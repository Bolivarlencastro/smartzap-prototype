import { importProvidersFrom } from '@angular/core';
import { Routes } from '@angular/router';
import { CategoriesListComponent } from './containers';
import { StoreModule } from '@ngrx/store';
import * as fromCategory from 'app/main/category/categories/store/category.reducer';
import { EffectsModule } from '@ngrx/effects';
import { CategoryEffects } from 'app/main/category/categories/store/category.effects';

export default [
  {
    path: '',
    providers: [
      importProvidersFrom(
        StoreModule.forFeature(fromCategory.categoryFeatureKey, fromCategory.reducer),
        EffectsModule.forFeature([CategoryEffects]),
      ),
    ],
    component: CategoriesListComponent,
  },
] as Routes;
