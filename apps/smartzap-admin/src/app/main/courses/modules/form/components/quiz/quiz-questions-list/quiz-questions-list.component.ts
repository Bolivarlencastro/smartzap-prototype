import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { filter, switchMap } from 'rxjs/operators';
import { Content, Question } from 'app/main/courses/model';
import { ExamStateService } from '../../../services';
import {
  EvaluateQuizQuestionDialogComponent,
  SurveyQuizQuestionDialogComponent,
} from 'app/main/courses/modules/form/components';
import { KpConfirmDialogComponent } from '@keeps-platform-frontend-workspace/ui/kp-confirm-dialog';
import { AsyncPipe } from '@angular/common';
import { MatIconButton } from '@angular/material/button';
import { MatTooltip } from '@angular/material/tooltip';
import { MatIcon } from '@angular/material/icon';
import { TranslocoPipe } from '@jsverse/transloco';

@Component({
  selector: 'app-quiz-questions-list',
  templateUrl: './quiz-questions-list.component.html',
  styleUrls: ['./quiz-questions-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatIconButton, MatTooltip, MatIcon, AsyncPipe, TranslocoPipe],
})
export class QuizQuestionsListComponent implements OnInit {
  @Input() content!: Content;
  questions$!: Observable<Question[]>;

  constructor(
    public _dialog: MatDialog,
    private _examStateService: ExamStateService,
  ) {}

  ngOnInit(): void {
    const examId = this.content.learn_content;
    this.questions$ = this._examStateService.fetchQuestions(examId);
  }

  onEditQuestion(question: Question): void {
    const examId = this.content.learn_content;
    const width = window.innerWidth < 599 ? '100%' : '60vw';
    const options = {
      panelClass: 'question-form-dialog',
      data: { status: 'edit', question },
      width,
      autoFocus: 'dialog',
    };
    const isEvaluativeQuiz = question?.question_type === 'correct_choices';

    let dialogRef: MatDialogRef<EvaluateQuizQuestionDialogComponent | SurveyQuizQuestionDialogComponent>;

    if (isEvaluativeQuiz) {
      dialogRef = this._dialog.open(EvaluateQuizQuestionDialogComponent, options);
    } else {
      dialogRef = this._dialog.open(SurveyQuizQuestionDialogComponent, options);
    }

    dialogRef
      .beforeClosed()
      .pipe(
        filter((data) => !!data),
        switchMap((data) => this._examStateService.updateQuestion({ examId, question: data })),
      )
      .subscribe();
  }

  onRemoveQuestion(question: Question): void {
    const examId = this.content.learn_content;
    const dialogRef = this._dialog.open(KpConfirmDialogComponent, { maxWidth: '350px' });

    dialogRef.componentInstance.confirmTitle = 'COURSE.FORM.QUIZ.QUESTION.DELETE_NOTICE';
    dialogRef.componentInstance.confirmMessage = 'COURSE.FORM.QUIZ.QUESTION.DELETE_QUESTION';
    dialogRef.componentInstance.positiveButtonLabel = 'GENERAL.DELETE';

    dialogRef
      .afterClosed()
      .pipe(
        filter((value) => value === true),
        switchMap(() => this._examStateService.removeQuestion({ examId, questionId: question.id })),
      )
      .subscribe();
  }
}
