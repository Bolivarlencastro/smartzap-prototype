import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CourseContentsGuard, CourseFinishGuard, CourseStatusGuard, ExamStateService } from './services';
import {
  CourseFormContentComponent,
  CourseFormInformationComponent,
  CoursePublishComponent,
  FormHeaderComponent,
  FormNavigationComponent,
  EvaluateQuizQuestionDialogComponent,
  QuizQuestionsListComponent,
} from './components';
import {
  CourseContentsComponent,
  CourseFinishComponent,
  CourseFormComponent,
  CourseInformationComponent,
} from './containers';
import { CourseFormRouterModule } from './course-form.router';
import { EditDialogComponent } from './components/edit-dialog/edit-dialog.component';
import { CourseImagesComponent } from './containers/course-images.component';
import { CourseSettingsComponent } from './containers/course-settings.component';
import { FuseScrollbarModule } from '@keeps-platform-frontend-workspace/layout';
import { ImageUploadV2Component } from '@keeps-platform-frontend-workspace/ui/kp-image-upload-v2';
import { KpLanguageColorTagComponent } from '@keeps-platform-frontend-workspace/ui/kp-language-color-tag';
import { KpReplacePipe } from '@keeps-platform-frontend-workspace/ui/kp-replace';
import { KpContentIconName } from '@keeps-platform-frontend-workspace/ui/kp-content-icon-name';

@NgModule({
  providers: [CourseFinishGuard, CourseContentsGuard, CourseStatusGuard, ExamStateService],
  imports: [
    ReactiveFormsModule,
    FormsModule,
    CourseFormRouterModule,
    FuseScrollbarModule,
    // Material
    ImageUploadV2Component,
    KpLanguageColorTagComponent,
    KpReplacePipe,
    KpContentIconName,
    // Components
    CourseFormContentComponent,
    CourseFormInformationComponent,
    FormHeaderComponent,
    FormNavigationComponent,
    CoursePublishComponent,
    QuizQuestionsListComponent,
    EvaluateQuizQuestionDialogComponent,
    // Containers
    CourseContentsComponent,
    CourseImagesComponent,
    CourseFinishComponent,
    CourseFormComponent,
    CourseInformationComponent,
    CourseSettingsComponent,
    EditDialogComponent,
  ],
})
export class CourseFormModule {}
