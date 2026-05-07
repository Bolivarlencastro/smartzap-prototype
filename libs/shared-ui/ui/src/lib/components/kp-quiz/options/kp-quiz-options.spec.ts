import { TestBed } from '@angular/core/testing';
import { KpQuizOptionsComponent } from './kp-quiz-options.component';
import { EventEmitter } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { KpQuizService } from '../kp-quiz.service';

describe('KpQuizOptionsComponent', () => {
  let component: KpQuizOptionsComponent;
  let mockService: Partial<KpQuizService>;

  beforeEach(() => {
    mockService = {
      answer$: new BehaviorSubject<string>(''),
      answered$: new BehaviorSubject<boolean>(false),
    };

    TestBed.configureTestingModule({
      providers: [KpQuizOptionsComponent, { provide: KpQuizService, useValue: mockService }],
    });

    component = TestBed.inject(KpQuizOptionsComponent);
  });

  it('should add an option to selection when onSelectOption is called with checked true', () => {
    component.onSelectOption('option1', true);
    expect(component.selection()).toEqual(['option1']);
  });

  it('should remove an option from selection when onSelectOption is called with checked false', () => {
    component.selection.set(['option1', 'option2']);
    component.onSelectOption('option1', false);
    expect(component.selection()).toEqual(['option2']);
  });

  it('should emit selected options when onSelectOption is called', (done) => {
    component.selected = new EventEmitter<string[]>();

    component.selected.subscribe((selection) => {
      expect(selection).toEqual(['option1']);
      done();
    });

    component.onSelectOption('option1', true);
  });

  it('should correctly determine if an option has been selected', () => {
    const result = component.hasOptionBeenSelected('a,b,c', 'b');
    expect(result).toBe(true);
  });
});
