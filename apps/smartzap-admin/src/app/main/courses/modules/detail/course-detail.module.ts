import { NgModule } from '@angular/core';

import {
  CourseDetailContentsComponent,
  CourseDetailDescriptionComponent,
  CourseDetailHeaderComponent,
  CourseDetailStatusComponent,
} from './components';
import { CourseDetailComponent, CourseDetailDialogLauncherComponent } from './container';
import { CourseDetailRouterModule } from './course-detail.router';
import { DialogTransferComponent } from './components/dialog-transfer/dialog-transfer.component';
import { CourseDetailActionsComponent } from './components/detail-actions/course-detail-actions.component';
import { FuseScrollbarModule } from '@keeps-platform-frontend-workspace/layout';
import { KpContentIconName } from '@keeps-platform-frontend-workspace/ui/kp-content-icon-name';
import { KpDurationPipe } from '@keeps-platform-frontend-workspace/ui/kp-duration';

@NgModule({
  imports: [
    CourseDetailRouterModule,
    FuseScrollbarModule,
    // Material
    KpContentIconName,
    KpDurationPipe,
    // Components
    CourseDetailStatusComponent,
    CourseDetailContentsComponent,
    CourseDetailHeaderComponent,
    CourseDetailDescriptionComponent,
    DialogTransferComponent,
    CourseDetailActionsComponent,
    // Containers
    CourseDetailComponent,
    CourseDetailDialogLauncherComponent,
  ],
})
export class CourseDetailModule {}
