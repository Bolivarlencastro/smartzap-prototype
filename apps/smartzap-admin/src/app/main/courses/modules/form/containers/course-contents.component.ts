import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ContentFormData } from '@keeps-platform-frontend-workspace/ui/kp-content-dialog';
import { Store } from '@ngrx/store';
import { filter, take, withLatestFrom } from 'rxjs/operators';
import { globalSettingsFeature } from '../../../../../shared/store/features';
import { Content, Course } from '../../../model';
import { LessonsActions } from '../../../store/actions';
import { CourseSelectors, LessonsSelectors } from '../../../store/selectors';
import { CourseFormContentComponent } from '../components/content/course-form-content.component';
import { EditDialogFormData } from '../components/edit-dialog/edit-dialog.component';

@Component({
  selector: 'app-course-contents',
  template: `
    @if (course$ | async; as course) {
      <app-course-form-content
        [course]="course"
        [isDisabled]="false"
        [contents]="(contents$ | async) ?? []"
        [messagesContentEmbed]="(messagesContentEmbed$ | async) ?? false"
        (createContent)="onCreateContent($event)"
        (removeContent)="onRemoveContent($event)"
        (editContent)="onEditContent($event)"
        (reorderContents)="onReorderContents($event)"
      >
      </app-course-form-content>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CourseFormContentComponent, AsyncPipe],
})
export class CourseContentsComponent implements OnInit {
  private readonly store = inject(Store);

  course$ = this.store.select(CourseSelectors.selectCourse);
  contents$ = this.store.select(LessonsSelectors.selectDefaultLessonContents);
  messagesContentEmbed$ = this.store.select(globalSettingsFeature.selectMessagesContentEmbed);
  lessonsLoaded$ = this.store.select(LessonsSelectors.selectLessonsLoaded);

  private readonly defaultLessonId = toSignal(this.store.select(LessonsSelectors.selectDefaultLessonId));

  ngOnInit(): void {
    this.lessonsLoaded$
      .pipe(
        filter(Boolean),
        take(1),
        withLatestFrom(this.store.select(LessonsSelectors.selectAllLessons), this.course$),
        filter(([_, lessons]) => lessons.length === 0),
      )
      .subscribe(([_, __, course]: [boolean, any, Course]) => {
        this.store.dispatch(LessonsActions.createLesson({ course: course.id, name: course.name, order: 1 }));
      });
  }

  onCreateContent({
    contentFormData,
    messagesContentEmbed,
  }: {
    contentFormData: ContentFormData;
    messagesContentEmbed: boolean;
  }): void {
    const lesson_id = this.defaultLessonId();
    if (!lesson_id) return;

    const { type, name } = contentFormData;
    const quizOptions = ['EVALUATIVE_QUIZ', 'SURVEY_QUIZ'];

    if (quizOptions.includes(type)) {
      this.store.dispatch(LessonsActions.createExam({ lesson_id, data: { type, name } }));
      return;
    }

    this.store.dispatch(LessonsActions.createContent({ lesson_id, contentFormData, messagesContentEmbed }));
  }

  onRemoveContent({ id: content_id }: { id: string }): void {
    const lesson_id = this.defaultLessonId();
    if (!lesson_id) return;
    this.store.dispatch(LessonsActions.deleteContent({ lesson_id, content_id }));
  }

  onEditContent({ id: content_id, data }: { id: string; data: EditDialogFormData }): void {
    const lesson_id = this.defaultLessonId();
    if (!lesson_id) return;
    this.store.dispatch(LessonsActions.editContent({ content_id, lesson_id, data }));
  }

  onReorderContents(contents: Content[]): void {
    const lesson_id = this.defaultLessonId();
    if (!lesson_id) return;
    this.store.dispatch(LessonsActions.reorderContents({ lesson_id, contents }));
  }
}
