import { animate, AnimationEvent, state, style, transition, trigger } from '@angular/animations';
import { Component, effect, EventEmitter, Input, OnInit, Output, Signal, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { MatFormField, MatInput } from '@angular/material/input';
import { KpQuizService } from '../kp-quiz.service';
import { QuizContentComponent } from '../model';
import { KpQuizOptionsComponent } from '../options/kp-quiz-options.component';

@Component({
  selector: 'kp-quiz-question',
  template: `
    <div class="kp-quiz-question" [@state]="animationState" (@state.done)="onAnimationDone($event)">
      <p class="kp-quiz-question-title">{{ data?.question?.title }}</p>
      @if (isTextInputType) {
        <mat-form-field appearance="outline" class="form" subscriptSizing="dynamic">
          <textarea matInput rows="6" [(ngModel)]="inputText" [disabled]="isAnswered()"></textarea>
        </mat-form-field>
      } @else {
        <kp-quiz-options
          [options]="data?.question?.options"
          [isSurveyQuiz]="isSurveyQuiz"
          (selected)="onSelectOption($event)"
        ></kp-quiz-options>
      }
    </div>
  `,
  styles: [
    `
      .kp-quiz-question-title {
        font-weight: 500;
        font-size: 0.9em;
      }

      .form {
        width: 100%;
      }
    `,
  ],
  animations: [
    trigger('state', [
      state('void', style({ transform: 'translateX(-110%)', opacity: 0 })),
      state('hidden', style({ transform: 'translateX(110%)', opacity: 0 })),
      state('visible', style({ transform: 'translateX(0)', opacity: 1 })),
      transition('* => visible', animate('0.3s 50ms ease-in')),
      transition('* => hidden', animate('0.3s 50ms ease-out')),
    ]),
  ],
  imports: [KpQuizOptionsComponent, FormsModule, MatFormField, MatInput],
})
export class KpQuizQuestionComponent implements QuizContentComponent, OnInit {
  @Input() data: any;
  @Output() animationDoneEvent = new EventEmitter();

  isSurveyQuiz: boolean;
  isTextInputType: boolean;
  inputText = signal<string>(null);

  answer: Signal<string>;
  isAnswered: Signal<boolean>;

  animationState = 'visible';

  constructor(private readonly _service: KpQuizService) {
    this.initInputTextListener();

    this.answer = toSignal(this._service.answer$);
    this.isAnswered = toSignal(this._service.answered$);
  }

  ngOnInit() {
    this.isSurveyQuiz = this.data?.isSurveyQuiz;
    this._service.answered(this.data?.question.id);
    this.isTextInputType = this.data?.question?.question_input_type === 'TEXT';

    this.setTextInputInitialValue();
  }

  onAnimationDone(event: AnimationEvent): void {
    if (event.toState !== 'hidden') {
      return;
    }
    this.animationDoneEvent.emit(true);
  }

  close() {
    this.animationState = 'hidden';
  }

  onSelectOption(selection: string[]): void {
    this._service.selectOption(selection);
  }

  private initInputTextListener() {
    effect(() => {
      const input = this.inputText();
      const result = input ? [input] : null;
      this.onSelectOption(result);
    });
  }

  private setTextInputInitialValue() {
    if (this.isAnswered()) {
      this.inputText.set(this.answer());
      return;
    }

    this.inputText.set(null);
  }
}
