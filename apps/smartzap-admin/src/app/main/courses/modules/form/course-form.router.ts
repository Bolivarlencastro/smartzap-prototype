import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {
  CourseContentsComponent,
  CourseFinishComponent,
  CourseFormComponent,
  CourseInformationComponent,
} from './containers';
import { CourseContentsGuard, CourseFinishGuard, CourseStatusGuard } from './services';
import { CourseImagesComponent } from './containers/course-images.component';
import { CourseSettingsComponent } from './containers/course-settings.component';

const routes: Routes = [
  {
    path: '',
    component: CourseFormComponent,
    canActivate: [CourseStatusGuard],
    children: [
      {
        path: '',
        pathMatch: 'full',
        component: CourseInformationComponent,
        // canActivate: [CourseOwnerGuard],
      },
      {
        path: 'images',
        component: CourseImagesComponent,
        canActivate: [CourseContentsGuard],
        data: { animation: 'isRight' },
      },
      {
        path: 'settings',
        component: CourseSettingsComponent,
        canActivate: [CourseContentsGuard],
        data: { animation: 'isRight' },
      },
      {
        path: 'contents',
        component: CourseContentsComponent,
        canActivate: [CourseContentsGuard],
        data: { animation: 'isRight' },
      },
      {
        path: 'finish',
        component: CourseFinishComponent,
        canActivate: [CourseFinishGuard],
        data: { animation: 'isLeft' },
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CourseFormRouterModule {}
