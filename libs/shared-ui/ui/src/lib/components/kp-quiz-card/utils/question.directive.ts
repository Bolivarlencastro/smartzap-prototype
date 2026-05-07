import { Directive, inject, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[kpQuestionHost]',
})
export class QuestionDirective {
  readonly viewContainerRef = inject(ViewContainerRef);
}
