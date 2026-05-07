import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ContentComponent } from './content.component';
import { ContentResolver } from './content.resolver';

const routes: Routes = [
  {
    path: ':id',
    pathMatch: 'full',
    component: ContentComponent,
    resolve: { data: ContentResolver },
  },
  { path: '', redirectTo: '/not-found' },
];

@NgModule({
  providers: [ContentResolver],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ContentRouterModule {}
