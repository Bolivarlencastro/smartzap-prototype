import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { AbstractControl, UntypedFormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { QuizOption, QuizQuestion } from './models/quiz.model';
import { TranslocoPipe } from '@jsverse/transloco';
import { MatIcon } from '@angular/material/icon';
import { MatIconButton, MatButton } from '@angular/material/button';
import { MatInput } from '@angular/material/input';
import { MatFormField, MatSuffix } from '@angular/material/form-field';
import { MatCheckbox } from '@angular/material/checkbox';
import { KpScrollToBottomDirective } from '../../directives/kp-scroll-to-bottom/kp-scroll-to-bottom.directive';
import { KpEditorComponent } from '../kp-editor/kp-editor.component';
import { NgClass } from '@angular/common';

@Component({
  selector: 'kp-quiz-form',
  templateUrl: './kp-quiz-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    KpEditorComponent,
    KpScrollToBottomDirective,
    MatCheckbox,
    MatFormField,
    MatInput,
    MatIconButton,
    MatSuffix,
    MatIcon,
    MatButton,
    NgClass,
    TranslocoPipe,
  ],
})
export class KpQuizFormComponent {
  @Input() form: UntypedFormGroup;
  @Input() content: { questions: QuizQuestion[] };
  @Input() isUserAnswering = false;
  @Input() question: QuizQuestion;
  @Input() answer: any;
  @Output() addOption = new EventEmitter<AbstractControl>();
  @Output() selectOption = new EventEmitter<QuizOption>();

  get formValue(): string {
    return this.form?.get('name')?.value;
  }

  onAddOption(control: AbstractControl): void {
    this.addOption.emit(control);
  }

  onDeleteOption(index: number): void {
    const value = this.form.get('options')?.value;
    value.splice(index, 1);
    this.form.get('options')?.setValue(value);
  }

  onSelectOption(option: QuizOption): void {
    if (!this.answer) {
      this.selectOption.emit(option);
    }
  }

  onValueChanged(value: string) {
    this.form.get('name').setValue(value);
  }
}
