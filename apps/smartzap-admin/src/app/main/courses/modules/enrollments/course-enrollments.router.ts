import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CourseEnrollmentsComponent } from './containers';
import { EnrollmentStatusGuard } from './services';

const routes: Routes = [
  {
    path: '',
    component: CourseEnrollmentsComponent,
    canActivate: [EnrollmentStatusGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CourseEnrollmentsRouterModule {}
