import { AsyncPipe, NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output, signal } from '@angular/core';
import { MatRipple } from '@angular/material/core';
import { Observable } from 'rxjs';
import { filter, tap } from 'rxjs/operators';
import { KpQuizCharcodePipe } from '../../../pipes/kp-quiz-charcode/kp-quiz-charcode.pipe';
import { KpQuizService } from '../kp-quiz.service';

@Component({
  selector: 'kp-quiz-options',
  templateUrl: './kp-quiz-options.component.html',
  styleUrls: ['./kp-quiz-options.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgClass, AsyncPipe, KpQuizCharcodePipe, MatRipple],
})
export class KpQuizOptionsComponent implements OnInit {
  @Input() options: any[];
  @Input() isSurveyQuiz: boolean;
  @Output() selected = new EventEmitter<string[]>();

  answer$: Observable<string>;
  isAnswered$: Observable<boolean>;

  selection = signal<string[]>([]);
  disabled = signal<boolean>(false);

  constructor(private _service: KpQuizService) {}

  ngOnInit(): void {
    this.isAnswered$ = this._service.answered$;
    this.answer$ = this._service.answer$.pipe(
      filter((answer) => !!answer),
      tap((answer) => {
        this.selection.set(answer.split(','));
        this.disabled.set(true);
      }),
    );
  }

  onSelectOption(id: string, checked: boolean): void {
    if (checked) {
      this.selection().push(id);
    } else {
      this.selection.set(this.selection().filter((selectedId) => selectedId !== id));
    }

    this.selected.emit(this.selection());
  }

  hasOptionBeenSelected(answer: string, optionId: string) {
    return answer?.includes(optionId);
  }
}
