import { Route } from '@angular/router';
import { TermsOfUseComponent } from './containers/terms-of-use/terms-of-use.component';
import { CoursesComponent } from './containers/courses/courses.component';

export const caixaRoutes: Route[] = [
  {
    path: '',
    component: CoursesComponent,
  },
  {
    path: 'termos-de-uso',
    component: TermsOfUseComponent,
  },
  { path: '**', pathMatch: 'full', redirectTo: '' },
];
