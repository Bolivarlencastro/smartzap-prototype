import { ChangeDetectionStrategy, Component, computed, input, output, signal } from '@angular/core';
import { FieldTree, FormField } from '@angular/forms/signals';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatChipsModule } from '@angular/material/chips';
import { KpEditorComponent } from '@keeps-platform-frontend-workspace/ui/kp-editor';
import { TranslocoPipe } from '@jsverse/transloco';

import { QuestionInput } from '../../models/quiz';

export interface QuizOptionData {
  text: string;
  correct: boolean;
}

export interface QuizQuestionFormValue {
  title: string;
  options: QuizOptionData[];
  addToBank: boolean;
  tags: string[];
}

@Component({
  selector: 'qz-quiz-question-form',
  templateUrl: './quiz-question-form.component.html',
  styleUrl: './quiz-question-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatExpansionModule,
    MatButtonModule,
    MatIconModule,
    MatCheckbox,
    MatFormFieldModule,
    MatInputModule,
    MatSlideToggleModule,
    MatChipsModule,
    KpEditorComponent,
    TranslocoPipe,
    FormField,
  ],
})
export class QuizQuestionFormComponent {
  questionForm = input.required<FieldTree<QuestionInput>>();

  index = input.required<number>();
  isEditing = input<boolean>(false);
  canDelete = input<boolean>(false);
  question = input<QuestionInput>();

  deleted = output<void>();
  addOption = output<void>();
  removeOption = output<number>();
  titleChange = output<string>();

  protected readonly expanded = signal(true);

  protected readonly canAddOption = computed(() => !this.isEditing() && this.questionForm().options.length < 5);
  protected readonly canDeleteOption = computed(() => !this.isEditing() && this.questionForm().options.length > 2);

  protected onDeleteQuestion(event: MouseEvent): void {
    event.stopPropagation();
    this.deleted.emit();
  }

  protected onTitleChange(title: string): void {
    this.titleChange.emit(title);
  }

  onAddOption() {
    this.addOption.emit();
  }

  onDeleteOption(index: number) {
    this.removeOption.emit(index);
  }
}
