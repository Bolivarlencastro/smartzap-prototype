import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { KeepsSharedModule } from '@keeps-platform-frontend-workspace/kp-keeps';
import { FuseCardModule } from '@keeps-platform-frontend-workspace/layout';
import { TranslocoModule } from '@jsverse/transloco';

import { KpCardComponent } from './kp-card.component';

@NgModule({
  imports: [CommonModule, KeepsSharedModule, FuseCardModule, TranslocoModule, KpCardComponent],
  exports: [KpCardComponent],
})
export class KpCardModule {}
