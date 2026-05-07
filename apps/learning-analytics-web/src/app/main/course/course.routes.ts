import { Routes } from '@angular/router';
import { CourseOverviewComponent } from './overview/course-overview.component';
import { CourseDetailsComponent } from './details/course-details.component';
import { CourseContentsComponent } from './contents/course-contents.component';

export default [
  {
    path: '',
    component: CourseOverviewComponent,
  },
  {
    path: ':id',
    component: CourseDetailsComponent,
  },
  {
    path: ':id/contents',
    component: CourseContentsComponent,
  },
] as Routes;
