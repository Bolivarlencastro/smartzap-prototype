import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { FuseLoadingBarComponent } from './loading-bar.component';

@NgModule({
  imports: [CommonModule, MatProgressBarModule, FuseLoadingBarComponent],
  exports: [FuseLoadingBarComponent],
})
export class FuseLoadingBarModule {}
