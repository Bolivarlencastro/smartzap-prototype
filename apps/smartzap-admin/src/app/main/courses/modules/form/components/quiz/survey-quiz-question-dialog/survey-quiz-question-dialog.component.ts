import { ChangeDetectionStrategy, Component, Inject, signal } from '@angular/core';
import {
  FormsModule,
  ReactiveFormsModule,
  UntypedFormArray,
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { MatButton, MatIconButton } from '@angular/material/button';
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
import { EMPTY_OPTION, EMPTY_QUESTION, Option, Question, QuestionInputType } from 'app/main/courses/model';

import { NgClass } from '@angular/common';
import { MatDivider } from '@angular/material/divider';
import { TranslocoPipe } from '@jsverse/transloco';

@Component({
  selector: 'app-survey-quiz-question-dialog',
  templateUrl: './survey-quiz-question-dialog.component.html',
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
    MatSuffix,
    MatDialogActions,
    MatButton,
    TranslocoPipe,
    MatDivider,
    NgClass,
  ],
  styles: [
    `
      .question-form-dialog {
        .dialog-content-wrapper {
          max-height: 85vh;
          display: flex;
          flex-direction: column;
        }
      }

      .mat-background {
        background-color: var(--mat-sys-surface);
      }

      .question-input-type {
        @apply h-20 w-40 p-4 flex flex-col items-center gap-2 border border-default rounded-lg cursor-pointer;
      }

      .question-input-type.selected {
        color: var(--mat-sys-primary);
        border-color: var(--mat-sys-primary);
        background-color: var(--mat-sys-inverse-on-surface);
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SurveyQuizQuestionDialogComponent {
  question: Question;
  questionInputType = signal<QuestionInputType>('CHOICE');
  isNew: boolean;

  textTypeInput = signal<string>(null);
  choiceTypeForm: UntypedFormGroup;

  get dialogTitle(): string {
    if (this.isNew) return 'COURSE.FORM.QUIZ.QUESTION.DIALOG.TITLE_NEW';
    return 'COURSE.FORM.QUIZ.QUESTION.DIALOG.TITLE_EDIT';
  }

  get isChoiceType() {
    return this.questionInputType() === 'CHOICE';
  }

  get isTextType() {
    return this.questionInputType() === 'TEXT';
  }

  get isInvalid(): boolean {
    if (this.isTextType) {
      return !this.textTypeInput()?.length;
    }

    return this.choiceTypeForm?.invalid || this.choiceTypeForm?.pristine;
  }

  get options(): UntypedFormArray {
    return this.choiceTypeForm.get('options') as UntypedFormArray;
  }

  get isAddOptionDisabled(): boolean {
    return this.options.length > 4;
  }

  get isDeleteOptionDisabled(): boolean {
    return !this.isNew || this.options.length < 3;
  }

  constructor(
    private readonly _formBuilder: UntypedFormBuilder,
    @Inject(MAT_DIALOG_DATA) public _data: any,
    public dialogRef: MatDialogRef<SurveyQuizQuestionDialogComponent>,
  ) {
    this.initialConfig();
  }

  setQuestionInputType(type: QuestionInputType) {
    this.questionInputType.set(type);
  }

  close() {
    this.dialogRef.close();
  }

  addOption() {
    const option = this.createOptionForm({ ...EMPTY_OPTION });
    this.options.push(option);
  }

  deleteOption(index: number) {
    this.options.removeAt(index);
  }

  onSave() {
    if (this.isTextType) {
      const result = {
        id: this.question.id,
        order: this.question.order,
        title: this.textTypeInput(),
        question_type: 'survey_text',
        question_input_type: 'TEXT',
      };
      this.dialogRef.close(result);
    } else {
      const formData: Question = this.choiceTypeForm.getRawValue();
      this.dialogRef.close({
        ...formData,
        question_input_type: 'CHOICE',
      });
    }
  }

  private initialConfig() {
    const isNew = this._data.action === 'new';
    this.isNew = isNew;
    this.question = isNew ? { ...EMPTY_QUESTION } : this._data.question;

    if (!isNew) {
      this.questionInputType.set(this.question.question_input_type);
      this.textTypeInput.set(this.question.title);
    }

    this.choiceTypeForm = this.buildChoiceTypeForm();
  }

  private buildChoiceTypeForm(): UntypedFormGroup {
    return this._formBuilder.group({
      id: [this.question.id],
      title: [this.question.title, Validators.required],
      question_type: ['survey_choices'],
      order: [this.question.order],
      options: this.createOptionFormArray(this.question.options),
    });
  }

  private createOptionFormArray(options: Option[]): UntypedFormArray {
    const controls = [];

    for (const opt of options) {
      controls.push(this.createOptionForm(opt));
    }

    return this._formBuilder.array(controls, [Validators.required, Validators.minLength(2), Validators.maxLength(5)]);
  }

  private createOptionForm(option: Partial<Option>): UntypedFormGroup {
    return this._formBuilder.group({
      id: option.id,
      option: [option.option, Validators.required],
    });
  }
}
