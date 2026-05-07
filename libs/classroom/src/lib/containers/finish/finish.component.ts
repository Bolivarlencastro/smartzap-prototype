import { Component } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { TranslocoPipe } from '@jsverse/transloco';

import { getTranslocoScope } from '../../transloco-scope.factory';
import { AsyncPipe } from '@angular/common';
import { Observable } from 'rxjs';
import { ClassroomStep } from '../../models';
import { ClassroomFacade } from '../../facades';

@Component({
  selector: 'kp-finish',
  templateUrl: './finish.component.html',
  styles: [
    `
      :host {
        height: var(--classroom-fixed-height);
        display: grid;
        grid-template-columns: 1fr;
        grid-template-rows: 1fr;
        place-items: center;
        padding: 2rem;
      }

      .subject-description {
        max-width: 64ch;
        text-wrap: balance;
      }
    `,
  ],
  imports: [MatButton, TranslocoPipe, AsyncPipe],
  providers: [getTranslocoScope()],
})
export class ClassFinishComponent {
  currentStep$: Observable<ClassroomStep>;

  constructor(private classroomFacade: ClassroomFacade) {
    this.currentStep$ = this.classroomFacade.currentStep$;
  }

  finishCourse() {
    this.classroomFacade.finishCourse();
  }
}
