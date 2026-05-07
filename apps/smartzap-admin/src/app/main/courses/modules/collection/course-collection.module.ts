import { NgModule } from '@angular/core';
import { KpCourseFilterModule } from '@app/shared/kp-components/kp-filter/kp-course-filter.module';

import { FuseScrollbarModule } from '@keeps-platform-frontend-workspace/layout';
import { KpCardModule } from 'app/shared/kp-components/kp-card/kp-card.module';
import { InfiniteScrollDirective } from 'ngx-infinite-scroll';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { CourseCardComponent, CourseListComponent } from './components';
import { CourseSideMenuComponent } from './components/course-side-menu/course-side-menu.component';
import { CoursesComponent } from './containers';
import { CourseCollectionRouterModule } from './course-collection.router';
import { StatusColorPipe } from './components/list/pipes/status-color.pipe';
import { ImageUrlPipe } from './components/list/pipes/image-url.pipe';
import { StatusLabelPipe } from './components/list/pipes/status-label.pipe';
import { KpInfoTagComponent } from '@keeps-platform-frontend-workspace/ui/kp-info-tag';
import { KpStatusChipComponent } from '@keeps-platform-frontend-workspace/ui/kp-status-chip';
import { KpDurationPipe } from '@keeps-platform-frontend-workspace/ui/kp-duration';

@NgModule({
  imports: [
    CourseCollectionRouterModule,
    FuseScrollbarModule,
    InfiniteScrollDirective,
    KpCourseFilterModule,
    KpCardModule,
    NgxSkeletonLoaderModule,
    KpInfoTagComponent,
    KpStatusChipComponent,
    KpDurationPipe,
    // Components
    CourseListComponent,
    CourseCardComponent,
    // Containers
    CoursesComponent,
    CourseSideMenuComponent,
    // Pipes
    StatusColorPipe,
    ImageUrlPipe,
    StatusLabelPipe,
  ],
})
export class CourseCollectionModule {}
