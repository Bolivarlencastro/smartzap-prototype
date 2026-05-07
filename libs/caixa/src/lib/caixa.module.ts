import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import {
  courseEnrollmentFeature,
  courseListFeature,
  enrollmentsFeature,
  FEATURE_EFFECTS,
  loginFeature,
  partnerSelectionFeature,
  userRegistrationFeature,
} from './store';

@NgModule({
  imports: [
    CommonModule,
    StoreModule.forFeature(courseListFeature),
    StoreModule.forFeature(courseEnrollmentFeature),
    StoreModule.forFeature(userRegistrationFeature),
    StoreModule.forFeature(loginFeature),
    StoreModule.forFeature(enrollmentsFeature),
    StoreModule.forFeature(partnerSelectionFeature),
    EffectsModule.forFeature(FEATURE_EFFECTS),
  ],
})
export class CaixaModule {}
