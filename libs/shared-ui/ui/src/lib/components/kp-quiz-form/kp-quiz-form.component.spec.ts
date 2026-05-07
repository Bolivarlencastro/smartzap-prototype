import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AbstractControl, FormControl, FormGroup } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { UserProfileService } from '@keeps-platform-frontend-workspace/kp-keeps';
import { getTranslocoTestingModule } from '../../transloco-testing.module';
import { KpQuizFormComponent } from './kp-quiz-form.component';
import { QuizQuestion } from './models/quiz.model';

const questions = [
  {
    title: 'Question 1',
    name: 'The first question',
    options: [
      {
        correct: true,
        text: 'Option 1 1',
      },
      {
        correct: false,
        text: 'Option 1 2',
      },
    ],
  },
  {
    title: 'Question 2',
    name: 'The second question',
    options: [
      {
        correct: false,
        text: 'Option 2 1',
      },
      {
        correct: true,
        text: 'Option 2 2',
      },
    ],
  },
] as QuizQuestion[];

const content = {};

const userProfileServiceMock: jest.Mocked<UserProfileService> = {
  getUserLocale: jest.fn(() => 'pt-BR'),
} as unknown as jest.Mocked<UserProfileService>;

describe('KpQuizFormComponent', () => {
  let component: KpQuizFormComponent;
  let fixture: ComponentFixture<KpQuizFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [getTranslocoTestingModule(), KpQuizFormComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [{ provide: UserProfileService, useValue: userProfileServiceMock }],
    }).compileComponents();

    fixture = TestBed.createComponent(KpQuizFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should emit the addOption with the control', () => {
    const spyAddOption = jest.spyOn(component.addOption, 'emit');
    const expectedControl = {} as AbstractControl;

    component.onAddOption(expectedControl);

    expect(spyAddOption).toHaveBeenCalledWith(expectedControl);
  });

  it('should delete the option with index 0', () => {
    component.form = new FormGroup({ options: new FormControl([]) });
    component.form.get('options').setValue([{}, {}]);
    fixture.detectChanges();

    component.onDeleteOption(0);

    expect(component.form.get('options').value.length).toBe(1);
  });
});

describe('KpQuizForm TestHostComponent', () => {
  let component: TestHostComponent;
  let fixture: ComponentFixture<TestHostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TestHostComponent],
      imports: [getTranslocoTestingModule(), KpQuizFormComponent],
      providers: [{ provide: UserProfileService, useValue: userProfileServiceMock }],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TestHostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create and init with VIEW mode', () => {
    const viewModeTemplateElement = fixture.debugElement.query(
      By.css('[data-test="kp-quiz-form.view_mode_template_container"]'),
    );
    const questionNameElement = fixture.debugElement.query(By.css('[data-test="kp-quiz-form.question_name"]'));
    const optionsElement = fixture.debugElement.queryAll(By.css('[data-test="kp-quiz-form.question_option"]'));
    const firstOptionCorrectIconsElement = optionsElement[0].query(By.css('[data-test="kp-quiz-form.correct_icon"]'));
    const firstOptionTextElement = optionsElement[0].query(By.css('[data-test="kp-quiz-form.option_text"]'));
    const secondOptionCorrectIconsElement = optionsElement[1].query(By.css('[data-test="kp-quiz-form.correct_icon"]'));
    const secondOptionTextElement = optionsElement[1].query(By.css('[data-test="kp-quiz-form.option_text"]'));

    expect(viewModeTemplateElement).toBeTruthy();
    expect(questionNameElement.nativeElement.innerHTML).toContain(questions[0].name);

    expect(firstOptionCorrectIconsElement.nativeElement.classList).not.toContain('invisible');
    expect(secondOptionCorrectIconsElement.nativeElement.classList).toContain('invisible');

    expect(firstOptionTextElement.nativeElement.innerHTML).toContain(questions[0].options[0].text);
    expect(secondOptionTextElement.nativeElement.innerHTML).toContain(questions[0].options[1].text);
  });

  it('should create and init with EDIT mode', () => {
    component.question = undefined;
    fixture.detectChanges();

    const viewModeTemplateElement = fixture.debugElement.query(
      By.css('[data-test="kp-quiz-form.view_mode_template_container"]'),
    );

    expect(viewModeTemplateElement).toBeFalsy();
  });
});

@Component({
  template: ` <kp-quiz-form [form]="form" [content]="content" [question]="question"></kp-quiz-form>`,
  standalone: false,
})
class TestHostComponent {
  form = new FormGroup({
    name: new FormControl(''),
    options: new FormControl([]),
  });
  content = content as any;
  question = questions[0];
}
