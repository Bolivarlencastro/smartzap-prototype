import { Routes } from '@angular/router';
import { SectionContentsComponent } from './containers/section-contents.component';
import { StoreModule } from '@ngrx/store';
import { importProvidersFrom } from '@angular/core';
import { sectionContentsFeature } from './store/section-contents.feature';
import { SECTION_CONTENTS_EFFECTS } from './store/effects';
import { EffectsModule } from '@ngrx/effects';
import { SECTION_CONTENT_ACTIONS_PROVIDERS } from './services/section-content-actions/section-content-actions.providers';

const PROVIDERS = [
  ...SECTION_CONTENT_ACTIONS_PROVIDERS,
  importProvidersFrom(
    StoreModule.forFeature(sectionContentsFeature),
    EffectsModule.forFeature(SECTION_CONTENTS_EFFECTS),
  ),
];

export default [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  {
    path: ':sectionId',
    component: SectionContentsComponent,
    providers: PROVIDERS,
  },
] as Routes;
