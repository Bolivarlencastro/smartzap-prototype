import { Routes } from '@angular/router';
import {
  CertificateComponent,
  ClassAudioComponent,
  ClassDocsComponent,
  ClassFinishComponent,
  ClassHtmlComponent,
  ClassImageComponent,
  ClassPDFComponent,
  ClassQuizComponent,
  ClassroomComponent,
  ClassScormComponent,
  ClassSubjectComponent,
  ClassVideoComponent,
} from './containers';
import { EvaluationComponent } from './containers/evaluation/evaluation.component';
import { classroomExitGuard, courseEnrollmentGuard } from './guards';
import { CLASSROOM_PROVIDERS } from './classroom.providers';
import { viewAsUserGuard } from './guards/view-as-user/view-as-user.guard';

const CHILD_ROUTES: Routes = [
  { path: 'quiz/:id', component: ClassQuizComponent },
  { path: 'subject/:id', component: ClassSubjectComponent },
  { path: 'video/:id', component: ClassVideoComponent },
  { path: 'image/:id', component: ClassImageComponent },
  { path: 'doc/:id', component: ClassDocsComponent },
  { path: 'pdf/:id', component: ClassPDFComponent },
  { path: 'podcast/:id', component: ClassAudioComponent },
  { path: 'html/:id', component: ClassHtmlComponent },
  { path: 'scorm/:id', component: ClassScormComponent },
  { path: 'evaluation', component: EvaluationComponent },
  { path: 'finish', component: ClassFinishComponent },
  { path: 'certificate', component: CertificateComponent },
];

export const classRoomRoutes: Routes = [
  {
    path: ':id',
    component: ClassroomComponent,
    providers: CLASSROOM_PROVIDERS,
    canActivate: [courseEnrollmentGuard],
    canDeactivate: [classroomExitGuard],
    children: CHILD_ROUTES,
  },
] as Routes;

export const classroomViewAsUserRoutes: Routes = [
  {
    path: ':id',
    component: ClassroomComponent,
    providers: CLASSROOM_PROVIDERS,
    canActivate: [viewAsUserGuard],
    canDeactivate: [classroomExitGuard],
    children: CHILD_ROUTES,
  },
] as Routes;
