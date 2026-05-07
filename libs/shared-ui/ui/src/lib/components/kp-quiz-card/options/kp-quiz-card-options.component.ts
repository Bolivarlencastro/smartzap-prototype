import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  OnInit,
  ViewEncapsulation,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { FormArray, FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { filter, map, tap } from 'rxjs/operators';
import { KpQuizCardService, QuizAnswerEntry } from '../kp-quiz.service';
import { Option, QuestionOption } from '../model';
import { MatRipple } from '@angular/material/core';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'kp-quiz-card-options',
  templateUrl: './kp-quiz-card-options.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule, ReactiveFormsModule, MatRipple, MatIcon],
})
export class KpQuizCardOptionsComponent implements OnInit {
  private readonly _service = inject(KpQuizCardService);
  private readonly _destroyRef = inject(DestroyRef);

  readonly options = input.required<Option[]>();
  readonly question = input.required<string>();
  readonly selected = output<string[]>();

  readonly formArray = new FormArray<FormControl<boolean | null>>([]);
  readonly optionsAnswers = signal<QuestionOption[]>([]);
  readonly answered = signal(false);

  readonly letters = 'ABCDEFGHIJKLMNOP'.split('');

  ngOnInit(): void {
    for (const _item of this.options()) {
      this.formArray.push(new FormControl<boolean | null>(null));
    }
    this.optionsAnswers.set(this.options().map((option) => ({ ...option, correct: false, userSelected: false })));
    this.check();
  }

  optionIconName(option: QuestionOption, index: number): string {
    if (option.correct && option.userSelected) return 'check_circle';
    if (option.correct) return 'check_circle_outline';
    if (this.formArray.controls[index].value) return 'cancel';
    return '';
  }

  onChangeOptions(): void {
    const selectedIds = this.formArray.value
      .map((value, index) => (value ? this.options()[index].id : null))
      .filter((id): id is string => id !== null);
    this.selected.emit(selectedIds);
  }

  private check(): void {
    this._service.answers$
      .pipe(
        takeUntilDestroyed(this._destroyRef),
        map((answers) => answers[this.question()]),
        filter((answer): answer is QuizAnswerEntry => answer !== undefined),
        tap((answer) => {
          this.answered.set(true);
          for (const option of this.options()) {
            const index = this.options().indexOf(option);
            if (answer.options.includes(option.id)) {
              this.formArray.controls[index].setValue(true);
            }
            this.formArray.controls[index].disable();
          }
          this.optionsAnswers.update((opts) =>
            opts.map((opt) => ({
              ...opt,
              correct: answer.correct_options?.includes(opt.id) ?? false,
              userSelected: answer.options?.includes(opt.id) ?? false,
            })),
          );
        }),
      )
      .subscribe();
  }
}
