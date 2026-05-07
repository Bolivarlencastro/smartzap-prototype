import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { KeepsSharedModule } from '@keeps-platform-frontend-workspace/kp-keeps';
import { TranslocoModule } from '@jsverse/transloco';

import { KpFilterModalComponent } from './filter-modal/kp-filter-modal.component';
import { KpCourseFilterComponent } from './kp-course-filter.component';
import { KpGlobalSearchInputComponent } from '@keeps-platform-frontend-workspace/ui/kp-global-search-input';

@NgModule({
  imports: [
    CommonModule,
    KeepsSharedModule,
    TranslocoModule,
    KpGlobalSearchInputComponent,
    KpFilterModalComponent,
    KpCourseFilterComponent,
  ],
  exports: [KpCourseFilterComponent],
})
export class KpCourseFilterModule {}
