import { AnimationEvent } from '@angular/animations';
import { EventEmitter, Type } from '@angular/core';

export class QuizContentItem {
  constructor(
    public component: Type<any>,
    public data: any,
  ) {}
}

export interface QuizContentComponent {
  data: any;
  animationDoneEvent: EventEmitter<void>;
  animationState: string;

  onAnimationDone(event: AnimationEvent): void;

  close(): void;
}
