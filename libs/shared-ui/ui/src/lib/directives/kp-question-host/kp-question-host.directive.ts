import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[kpQuestionHost]',
  standalone: true,
})
export class KpQuestionHostDirective {
  constructor(public viewContainerRef: ViewContainerRef) {}
}
