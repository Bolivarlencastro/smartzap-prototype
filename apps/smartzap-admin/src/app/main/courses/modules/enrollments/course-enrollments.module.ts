import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import {
  CourseCreateEnrollmentDialogComponent,
  CourseImportEnrollmentDialogComponent,
  EnrollmentFilterComponent,
  EnrollmentListComponent,
  EnrollmentUploadComponent,
  ImportErrorDialogComponent,
} from './components';
import { CourseEnrollmentsComponent } from './containers';
import { CourseEnrollmentsRouterModule } from './course-enrollments.router';
import { EnrollmentStatusGuard } from './services';
import { TrackingDialogComponent } from './components/tracking-dialog/tracking-dialog.component';
import { TrackingListComponent } from './components/tracking-list/tracking-list.component';
import { TrackingPercentagePipe } from './components/tracking-list/pipes/tracking-percentage.pipe';
import { TrackingPercetangePositionPipe } from './components/tracking-list/pipes/tracking-percetange-position.pipe';
import { TrackingConsumePipe } from './components/tracking-list/pipes/tracking-consume.pipe';
import { TrackingStatusIconComponent } from './components/tracking-status-icon/tracking-status-icon.component';
import { TrackingListItemComponent } from './components/tracking-list-item/tracking-list-item.component';
import { FuseScrollbarModule } from '@keeps-platform-frontend-workspace/layout';
import { InfiniteScrollDirective } from 'ngx-infinite-scroll';
import { KpPhoneInputComponent } from '@keeps-platform-frontend-workspace/ui/kp-phone-input';
import { KpStatusChipComponent } from '@keeps-platform-frontend-workspace/ui/kp-status-chip';
import { KpEnrollmentStatusColorPipe } from '@keeps-platform-frontend-workspace/ui/kp-enrollment-status-color';
import { KpTransformInDashDirective } from '@keeps-platform-frontend-workspace/ui/kp-transform-in-dash';
import { KpNormalizePercentPipe } from '@keeps-platform-frontend-workspace/ui/kp-normalize-percent';
import { KpPhonePipe } from '@keeps-platform-frontend-workspace/ui/kp-phone';
import { KpContentIconName } from '@keeps-platform-frontend-workspace/ui/kp-content-icon-name';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';

@NgModule({
  imports: [
    ReactiveFormsModule,
    FuseScrollbarModule,
    FormsModule,
    CourseEnrollmentsRouterModule,
    // Material
    InfiniteScrollDirective,
    KpPhoneInputComponent,
    KpStatusChipComponent,
    KpEnrollmentStatusColorPipe,
    KpTransformInDashDirective,
    KpNormalizePercentPipe,
    KpPhonePipe,
    KpContentIconName,
    NgxSkeletonLoaderModule,
    // Components
    CourseImportEnrollmentDialogComponent,
    CourseCreateEnrollmentDialogComponent,
    EnrollmentFilterComponent,
    EnrollmentListComponent,
    EnrollmentUploadComponent,
    ImportErrorDialogComponent,
    TrackingStatusIconComponent,
    TrackingListItemComponent,
    // Containers
    CourseEnrollmentsComponent,
    TrackingDialogComponent,
    TrackingListComponent,
    // Pipes
    TrackingPercentagePipe,
    TrackingPercetangePositionPipe,
    TrackingConsumePipe,
  ],
  providers: [EnrollmentStatusGuard],
})
export class CourseEnrollmentsModule {}
