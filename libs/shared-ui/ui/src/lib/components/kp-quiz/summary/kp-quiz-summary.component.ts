import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { QuizContentComponent } from '../model';
import { animate, AnimationEvent, state, style, transition, trigger } from '@angular/animations';
import { KpQuizService } from '../kp-quiz.service';
import { Observable } from 'rxjs';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'kp-quiz-summary',
  templateUrl: './kp-quiz-summary.component.html',
  styleUrls: ['./kp-quiz-summary.component.scss'],
  animations: [
    trigger('state', [
      state('void', style({ transform: 'translateX(-110%)', opacity: 0 })),
      state('hidden', style({ transform: 'translateX(110%)', opacity: 0 })),
      state('visible', style({ transform: 'translateX(0)', opacity: 1 })),
      transition('* => visible', animate('0.3s 50ms ease-in')),
      transition('* => hidden', animate('0.3s 50ms ease-out')),
    ]),
  ],
  imports: [AsyncPipe],
})
export class KpQuizSummaryComponent implements QuizContentComponent, OnInit {
  @Input() data: any;
  @Output() animationDoneEvent = new EventEmitter();

  isSurveyQuiz: boolean;
  workspaceIconUrl: string;

  animationState = 'visible';
  summary$: Observable<any>;

  constructor(private _service: KpQuizService) {}

  ngOnInit(): void {
    this.summary$ = this._service.summary$;
    this.isSurveyQuiz = this.data.isSurveyQuiz;
    this.workspaceIconUrl = this.data.workspaceIconUrl;
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
}
