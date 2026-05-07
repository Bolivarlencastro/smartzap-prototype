import { Component, Inject, QueryList, ViewChildren } from '@angular/core';
import {
  FormsModule,
  ReactiveFormsModule,
  UntypedFormArray,
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatCheckbox } from '@angular/material/checkbox';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatFormField, MatLabel, MatSuffix } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { EMPTY_OPTION, EMPTY_QUESTION, Option, Question } from 'app/main/courses/model';

import { MatDivider } from '@angular/material/divider';
import { TranslocoPipe } from '@jsverse/transloco';

@Component({
  selector: 'app-evaluate-quiz-question-dialog',
  templateUrl: './evaluate-quiz-question-dialog.component.html',
  styleUrls: ['./evaluate-quiz-question-dialog.component.scss'],
  imports: [
    MatDialogTitle,
    MatIconButton,
    MatIcon,
    MatDialogContent,
    FormsModule,
    ReactiveFormsModule,
    MatFormField,
    MatLabel,
    MatInput,
    MatCheckbox,
    MatSuffix,
    MatDialogActions,
    MatButton,
    TranslocoPipe,
    MatDivider,
  ],
})
export class EvaluateQuizQuestionDialogComponent {
  question: Question;
  isNew: boolean;
  questionForm: UntypedFormGroup;
  isAnswerSelected: boolean;

  @ViewChildren(MatCheckbox) correctAnswers!: QueryList<MatCheckbox>;

  constructor(
    private _formBuilder: UntypedFormBuilder,
    @Inject(MAT_DIALOG_DATA) public _data: any,
    public dialogRef: MatDialogRef<EvaluateQuizQuestionDialogComponent>,
  ) {
    this.isNew = _data.action === 'new';
    this.question = this.isNew ? { ...EMPTY_QUESTION } : _data.question;
    this.isAnswerSelected = !this.isNew;
    this.questionForm = this.createQuestionForm();
  }

  get dialogTitle(): string {
    if (this.isNew) return 'COURSE.FORM.QUIZ.QUESTION.DIALOG.TITLE_NEW';
    return 'COURSE.FORM.QUIZ.QUESTION.DIALOG.TITLE_EDIT';
  }

  get options(): UntypedFormArray {
    return this.questionForm.get('options') as UntypedFormArray;
  }

  get isInvalidForm(): boolean {
    return this.questionForm.invalid || !this.isAnswerSelected || this.questionForm.pristine;
  }

  get isAddOptionDisabled(): boolean {
    return this.options.length > 4;
  }

  get isDeleteOptionDisabled(): boolean {
    return !this.isNew || this.options.length < 3;
  }

  addOption(): void {
    const option = this.createOptionForm({ ...EMPTY_OPTION });
    this.options.push(option);
  }

  deleteOption(index: number): void {
    this.options.removeAt(index);
  }

  onSave(): void {
    const formData: Question = this.questionForm.getRawValue();
    this.dialogRef.close(formData);
  }

  onSelectAnswer(): void {
    this.isAnswerSelected = !!this.correctAnswers.filter((answer) => answer.checked).length;
  }

  /**
   * Create question form
   *
   * @returns
   */
  createQuestionForm(): UntypedFormGroup {
    return this._formBuilder.group({
      id: [this.question.id],
      title: [this.question.title, Validators.required],
      question_type: [this.question.question_type],
      order: [this.question.order],
      options: this.createOptionFormArray(this.question.options),
    });
  }

  /**
   * Create options form
   *
   * @returns
   */
  private createOptionFormArray(options: Option[]): UntypedFormArray {
    const controls = [];

    for (const opt of options) {
      controls.push(this.createOptionForm(opt));
    }

    return this._formBuilder.array(controls, [Validators.required, Validators.minLength(2), Validators.maxLength(5)]);
  }

  /**
   * Create option form
   *
   * @returns
   */
  private createOptionForm(option: Partial<Option>): UntypedFormGroup {
    return this._formBuilder.group({
      id: option.id,
      correct_answer: option.correct_answer,
      option: [option.option, Validators.required],
    });
  }
}
