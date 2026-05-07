import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { CdkDrag, CdkDragDrop, CdkDragHandle, CdkDropList, moveItemInArray } from '@angular/cdk/drag-drop';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Content, Course, EVALUATIVE_TYPE_ID, Question } from 'app/main/courses/model';
import {
  EvaluateQuizQuestionDialogComponent,
  SurveyQuizQuestionDialogComponent,
} from 'app/main/courses/modules/form/components';
import { filter, switchMap } from 'rxjs/operators';
import { ExamStateService } from '../../services';
import { EditDialogComponent, EditDialogFormData } from '../edit-dialog/edit-dialog.component';
import { ContentFormData, KpContentFormDialogComponent } from '@keeps-platform-frontend-workspace/ui/kp-content-dialog';
import { KpConfirmDialogComponent } from '@keeps-platform-frontend-workspace/ui/kp-confirm-dialog';
import { MatAnchor, MatButton, MatIconButton } from '@angular/material/button';
import { MatTooltip } from '@angular/material/tooltip';
import { MatIcon } from '@angular/material/icon';
import { MatDivider } from '@angular/material/divider';
import { QuizQuestionsListComponent } from '../quiz/quiz-questions-list/quiz-questions-list.component';
import { RouterLink } from '@angular/router';
import { DatePipe, UpperCasePipe } from '@angular/common';
import { TranslocoPipe } from '@jsverse/transloco';
import { KpContentIconName } from '@keeps-platform-frontend-workspace/ui/kp-content-icon-name';

@Component({
  selector: 'app-course-form-content',
  templateUrl: './course-form-content.component.html',
  styleUrls: ['./course-form-content.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  preserveWhitespaces: false,
  imports: [
    MatButton,
    MatTooltip,
    MatIcon,
    MatDivider,
    MatIconButton,
    QuizQuestionsListComponent,
    MatAnchor,
    RouterLink,
    UpperCasePipe,
    DatePipe,
    TranslocoPipe,
    KpContentIconName,
    CdkDropList,
    CdkDrag,
    CdkDragHandle,
  ],
})
export class CourseFormContentComponent {
  @Input() course!: Course;
  @Input() set contents(value: Content[]) {
    this.localContents = [...value];
  }
  @Input() isDisabled = false;
  @Input() messagesContentEmbed = false;

  localContents: Content[] = [];

  @Output() createContent = new EventEmitter<{
    contentFormData: ContentFormData;
    messagesContentEmbed: boolean;
  }>();
  @Output() removeContent = new EventEmitter<{ id: string }>();
  @Output() editContent = new EventEmitter<{
    id: string;
    data: EditDialogFormData;
  }>();
  @Output() reorderContents = new EventEmitter<Content[]>();

  constructor(
    private _dialog: MatDialog,
    private _examStateService: ExamStateService,
  ) {}

  onCreateContent(): void {
    const messagesContentEmbed = this.messagesContentEmbed;

    const dialogRef = this._dialog.open(KpContentFormDialogComponent, {
      data: { app: 'smartzap', messagesContentEmbed },
      autoFocus: 'dialog',
    });

    dialogRef
      .afterClosed()
      .pipe(filter((value) => !!value))
      .subscribe((contentFormData) => this.createContent.emit({ contentFormData, messagesContentEmbed }));
  }

  onEditContent(content: Content): void {
    const { id, name, description } = content;

    const dialogRef = this._dialog.open(EditDialogComponent, {
      data: {
        title: 'COURSE.FORM.DIALOG.EDIT_LESSON_TITLE',
        useMarkdown: true,
        form: { name, description },
      },
      width: '600px',
    });

    if (id) {
      dialogRef
        .afterClosed()
        .pipe(filter((value) => !!value))
        .subscribe((data) => this.editContent.emit({ id, data }));
    }
  }

  onRemoveContent(content: Content): void {
    const { id } = content;
    const dialogRef = this._dialog.open(KpConfirmDialogComponent);

    dialogRef.componentInstance.confirmTitle = 'COURSE.FORM.DIALOG.REMOVE_CONTENT_TITLE';
    dialogRef.componentInstance.confirmMessage = 'COURSE.FORM.DIALOG.REMOVE_CONTENT_MESSAGE';

    if (id) {
      dialogRef
        .afterClosed()
        .pipe(filter((value) => value === true))
        .subscribe(() => this.removeContent.emit({ id }));
    }
  }

  onCreateQuestion({ type_id, learn_content }: Content): void {
    const examId = learn_content;
    const width = window.innerWidth < 599 ? '100%' : '60vw';
    const options = {
      panelClass: 'question-form-dialog',
      data: { action: 'new' },
      width,
      autoFocus: 'dialog',
    };

    let dialogRef: MatDialogRef<EvaluateQuizQuestionDialogComponent | SurveyQuizQuestionDialogComponent>;

    if (type_id === EVALUATIVE_TYPE_ID) {
      dialogRef = this._dialog.open(EvaluateQuizQuestionDialogComponent, options);
    } else {
      dialogRef = this._dialog.open(SurveyQuizQuestionDialogComponent, options);
    }

    dialogRef
      .beforeClosed()
      .pipe(
        filter((question) => !!question),
        switchMap((question: Question) => this._examStateService.createQuestion({ examId, question })),
      )
      .subscribe();
  }

  onDrop(event: CdkDragDrop<Content[]>): void {
    if (event.previousIndex === event.currentIndex) return;
    const reordered = [...this.localContents];
    moveItemInArray(reordered, event.previousIndex, event.currentIndex);
    this.localContents = reordered;
    this.reorderContents.emit(reordered);
  }

  isQuiz(content: Content): boolean {
    return content.type?.name === 'Question' || content.type?.name === 'Survey Question';
  }
}
