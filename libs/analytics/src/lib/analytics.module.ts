import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { analyticsRoutes } from './lib.routes';

@NgModule({
  imports: [CommonModule, RouterModule.forChild(analyticsRoutes)],
})
export class AnalyticsModule {}
