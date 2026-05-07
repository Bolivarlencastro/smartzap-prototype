import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Subject } from 'rxjs';
import { KpQuizCardService } from '../kp-quiz.service';
import { Option } from '../model';
import { KpQuizCardOptionsComponent } from './kp-quiz-card-options.component';

describe('KpQuizCardOptionsComponent', () => {
  let component: TestHostComponent;
  let fixture: ComponentFixture<TestHostComponent>;
  let service: any;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TestHostComponent],
      imports: [KpQuizCardOptionsComponent],
      providers: [
        {
          provide: KpQuizCardService,
          useValue: {
            answers$: new Subject(),
          },
        },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    service = TestBed.inject(KpQuizCardService);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TestHostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create and init', () => {
    const optionsList = fixture.debugElement.queryAll(By.css("[type='checkbox']"));
    const optionsSelected = optionsList.map((option) => option.nativeElement.checked);

    expect(component).toBeTruthy();
    expect(optionsList.length).toBe(3);
    expect(optionsSelected.every((check) => !check)).toBe(true);
  });

  it('should have 1 green option and 2 red', () => {
    const optionsList = fixture.debugElement.queryAll(By.css('.quiz-question-option-label'));

    service.answers$.next({
      question_1: {
        correct_options: ['1'],
        options: ['1', '2', '3'],
      },
      question_2: {
        correct_options: ['2'],
        options: ['4', '5', '6'],
      },
    });
    fixture.detectChanges();

    const greenList = optionsList.filter((option) =>
      option.nativeElement.classList.contains('quiz-question-option-label--success'),
    );
    const redList = optionsList.filter((option) =>
      option.nativeElement.classList.contains('quiz-question-option-label--error'),
    );
    expect(greenList.length).toEqual(1);
    expect(redList.length).toEqual(2);
  });

  it('should have 1 green option only', () => {
    const optionsList = fixture.debugElement.queryAll(By.css('.quiz-question-option-label'));

    service.answers$.next({
      question_1: {
        correct_options: ['1'],
        options: ['1'],
      },
      question_2: {
        correct_options: ['2'],
        options: ['4', '5', '6'],
      },
    });
    fixture.detectChanges();

    const greenList = optionsList.filter((option) =>
      option.nativeElement.classList.contains('quiz-question-option-label--success'),
    );
    const redList = optionsList.filter((option) =>
      option.nativeElement.classList.contains('quiz-question-option-label--error'),
    );
    expect(greenList.length).toEqual(1);
    expect(redList.length).toEqual(0);
  });

  it('should have one correct option and one not selected', () => {
    const optionsList = fixture.debugElement.queryAll(By.css('.quiz-question-option-label'));

    service.answers$.next({
      question_1: {
        correct_options: ['1'],
        options: ['1'],
      },
      question_2: {
        correct_options: ['2', '5'],
        options: ['4', '5', '6'],
      },
    });
    fixture.detectChanges();

    const greenList = optionsList.filter((option) =>
      option.nativeElement.classList.contains('quiz-question-option-label--success'),
    );
    const notSelected = optionsList.filter((option) =>
      option.nativeElement.classList.contains('quiz-question-option-label--not-selected'),
    );

    expect(greenList.length).toEqual(1);
    expect(notSelected.length).toEqual(1);
  });
});

@Component({
  template: ` <kp-quiz-card-options [options]="options" [question]="question"></kp-quiz-card-options>`,
  standalone: false,
})
class TestHostComponent {
  options: Option[] = [
    {
      id: '1',
      option: 'option 1',
      questionId: 'question_1',
    },
    {
      id: '2',
      option: 'option 2',
      questionId: 'question_1',
    },
    {
      id: '3',
      option: 'option 3',
      questionId: 'question_1',
    },
  ];

  question = 'question_1';
}
