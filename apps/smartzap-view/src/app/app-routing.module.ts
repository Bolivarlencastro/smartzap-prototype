import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PageNotFoundComponent } from './main/page-not-found/page-not-found.component';
import { PrototypeHomeComponent } from './main/prototype-home/prototype-home.component';
import { AuthGuard } from '@core/services/auth.gurad';
import { environment } from 'environments/environment';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: environment.prototypeMode ? 'prototype' : 'not-found',
  },
  {
    path: 'prototype',
    component: PrototypeHomeComponent,
  },
  {
    path: 'contents',
    loadChildren: () => import('./main/content/content.module').then((m) => m.ContentModule),
    canLoad: [AuthGuard],
    canActivate: [AuthGuard],
  },
  {
    path: 'not-found',
    component: PageNotFoundComponent,
  },
  {
    path: 'invalid-token',
    component: PageNotFoundComponent,
  },
  { path: '**', redirectTo: environment.prototypeMode ? '/prototype' : '/not-found' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard],
})
export class AppRoutingModule {}
