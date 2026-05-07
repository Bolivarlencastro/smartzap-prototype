import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CourseDetailDialogLauncherComponent } from './container';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: CourseDetailDialogLauncherComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CourseDetailRouterModule {}
