import { importProvidersFrom } from '@angular/core';
import { Routes } from '@angular/router';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { CustomSectionsComponent } from './containers/custom-sections/custom-sections.component';
import { CustomSectionsEffects, SectionContentsEffects } from './store/effects';
import { customSectionsFeature } from './store/features';
import { sectionContentsFeature } from './store/features/section-contents.feature';

const PROVIDERS = [
  importProvidersFrom([
    StoreModule.forFeature(customSectionsFeature),
    StoreModule.forFeature(sectionContentsFeature),
    EffectsModule.forFeature([CustomSectionsEffects, SectionContentsEffects]),
  ]),
];

export default [
  {
    path: '',
    component: CustomSectionsComponent,
    providers: [PROVIDERS],
  },
] as Routes;
