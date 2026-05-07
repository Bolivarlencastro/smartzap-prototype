import { Component, ComponentRef, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { KpQuestionHostDirective } from '../../directives';
import { KpQuizService } from './kp-quiz.service';
import { QuizContentItem } from './model';
import { KpQuizQuestionComponent } from './question/kp-quiz-question.component';
import { KpQuizSummaryComponent } from './summary/kp-quiz-summary.component';
import { MatIcon } from '@angular/material/icon';
import { MatButton } from '@angular/material/button';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'kp-quiz',
  templateUrl: './kp-quiz.component.html',
  styleUrls: ['./kp-quiz.component.scss'],
  imports: [KpQuestionHostDirective, MatButton, MatIcon, AsyncPipe],
})
export class KpQuizComponent implements OnInit, OnDestroy {
  @Input() questions: any[] = [];
  @Input() isSurveyQuiz: boolean;
  @Input() workspaceIconUrl: string;

  @Input() set answers(answers: any[]) {
    if (answers) {
      this._service.setAnswers(answers);
    }
  }

  @Output() answererEvent = new EventEmitter<any>();

  @ViewChild(KpQuestionHostDirective, { static: true }) questionHost: KpQuestionHostDirective;
  componentRef: ComponentRef<any>;

  currentIndex: number;
  isSelected$: Observable<boolean>;
  isAnswered$: Observable<boolean>;
  items: QuizContentItem[];

  constructor(private _service: KpQuizService) {}

  ngOnInit() {
    this.isSelected$ = this._service.selected$;
    this.isAnswered$ = this._service.answered$;

    this.items = this.questions.map(
      (question) => new QuizContentItem(KpQuizQuestionComponent, { question, isSurveyQuiz: this.isSurveyQuiz }),
    );

    this.items.push(
      new QuizContentItem(KpQuizSummaryComponent, {
        isSurveyQuiz: this.isSurveyQuiz,
        workspaceIconUrl: this.workspaceIconUrl,
      }),
    );

    this.loadQuestionComponent(0);
  }

  ngOnDestroy(): void {
    this.clear();
  }

  /**
   * Load a question component given an index
   */
  loadQuestionComponent(index: number) {
    this.currentIndex = index;
    const contentItem = this.getContentFromIndex(index);

    if (!this.componentRef) {
      this.create(contentItem);
    }

    this.componentRef.instance.animationDoneEvent.subscribe(() => {
      this.create(contentItem);
    });

    this.componentRef.instance.close();
  }

  /**
   * Create a KpQuizQuestionComponent dynamically
   */
  create(contentItem: QuizContentItem) {
    this.clear();
    this.componentRef = this.questionHost.viewContainerRef.createComponent(contentItem.component);
    this.componentRef.instance.data = contentItem.data;
  }

  /**
   * Load the next question
   */
  next(): void {
    this.loadQuestionComponent(++this.currentIndex);
  }

  /**
   * Load the previous question
   */
  prev(): void {
    this.loadQuestionComponent(--this.currentIndex);
  }

  /**
   * Get a question given its index
   */
  getContentFromIndex(index: number): QuizContentItem {
    return this.items[index];
  }

  onAnswerer(): void {
    const optionId = this._service.getCurrentSelection();
    const content = this.getContentFromIndex(this.currentIndex);
    const isTextInputType = content.data.question.question_input_type === 'TEXT';
    const questionId = content.data.question.id;
    this.answererEvent.emit({ optionId, questionId, isTextInputType });
  }

  /**
   * Remove the component reference and clear the container.
   */
  private clear(): void {
    if (!this.componentRef) {
      return;
    }

    this.componentRef.destroy();
    this.questionHost.viewContainerRef.clear();
  }
}
