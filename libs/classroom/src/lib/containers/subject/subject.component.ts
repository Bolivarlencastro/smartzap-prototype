import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { ClassroomStep } from '../../models';
import { ClassroomFacade } from '../../facades';

@Component({
  templateUrl: 'subject.component.html',
  styleUrls: ['subject.component.scss'],
  imports: [AsyncPipe],
})
export class ClassSubjectComponent {
  currentStep$: Observable<ClassroomStep>;

  constructor(private classroomFacade: ClassroomFacade) {
    this.currentStep$ = this.classroomFacade.currentStep$;
  }
}
