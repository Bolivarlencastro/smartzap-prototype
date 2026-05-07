import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CourseGuard, CourseEditGuard } from './services';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./modules/collection/course-collection.module').then((m) => m.CourseCollectionModule),
  },
  {
    path: ':id',
    canActivate: [CourseGuard],
    children: [
      {
        path: '',
        pathMatch: 'full',
        loadChildren: () => import('./modules/detail/course-detail.module').then((m) => m.CourseDetailModule),
      },
      {
        path: 'form',
        loadChildren: () => import('./modules/form/course-form.module').then((m) => m.CourseFormModule),
        canActivate: [CourseEditGuard],
      },
      {
        path: 'enrollments',
        loadChildren: () =>
          import('./modules/enrollments/course-enrollments.module').then((m) => m.CourseEnrollmentsModule),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CoursesRouterModule {}
