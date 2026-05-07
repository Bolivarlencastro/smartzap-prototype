import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { gamificationRoutes } from './lib.routes';
import { GamificationService } from './services/gamification.service';
import { FEATURE_EFFECTS, gamificationFeature, gamificationListFeature } from './store';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(gamificationRoutes),
    StoreModule.forFeature(gamificationListFeature),
    StoreModule.forFeature(gamificationFeature),
    EffectsModule.forFeature(FEATURE_EFFECTS),
  ],
  providers: [GamificationService],
})
export class GamificationModule {}
