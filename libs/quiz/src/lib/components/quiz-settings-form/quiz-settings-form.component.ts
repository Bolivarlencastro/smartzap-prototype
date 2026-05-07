import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { FieldTree, FormField } from '@angular/forms/signals';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { TranslocoPipe } from '@jsverse/transloco';
import { QuizFormModel } from '../../models/quiz';

@Component({
  selector: 'qz-quiz-settings-form',
  templateUrl: './quiz-settings-form.component.html',
  styleUrl: './quiz-settings-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormField, MatFormFieldModule, MatInputModule, MatSlideToggleModule, TranslocoPipe],
})
export class QuizSettingsFormComponent {
  quizForm = input.required<FieldTree<QuizFormModel>>();

  protected readonly questionCount = computed(() => this.quizForm().questions.length);
  protected readonly isRandomizeEnabled = computed(() => this.quizForm().randomize_questions().value());
  protected readonly questionsToShowMaxValueError = computed(() =>
    this.quizForm()
      .questions_to_show()
      .errors()
      .find((error) => error.kind === 'questions-to-show-limit'),
  );
}
