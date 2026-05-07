import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { EvaluationQuestion } from '@core/model/evaluation.model';
import { EvaluationContentComponent } from './evaluation-content.component';
import { getTranslocoTestingModule } from '@core/utils/transloco-testing.module';

describe('EvaluationContentComponent', () => {
  let component: TestHostComponent;
  let fixture: ComponentFixture<TestHostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [TestHostComponent, getTranslocoTestingModule()],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TestHostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should render rate buttons from questions', () => {
    const rateButtons = fixture.debugElement.queryAll(
      By.css("[data-test='evaluation-content.first-step-rate-buttons']"),
    );
    const firstStepTitle = fixture.debugElement.query(
      By.css("[data-test='evaluation-content.first-step-questions']"),
    ).nativeElement;

    fixture.detectChanges();

    expect(firstStepTitle.innerHTML).toContain('COURSE.EVALUATION.FIRST_STEP.' + component.questions[0].i18n);
    expect(rateButtons.length).toBe(5);
  });

  it('should set rating value to 3 on click in the form', () => {
    const rateButton = fixture.debugElement.query(
      By.css("[data-test='evaluation-content.second-step-rate-buttons-2']"),
    );
    rateButton.nativeNode.children[0].click();

    fixture.detectChanges();

    expect(component.form.getRawValue()).toEqual({ comment: '', nps: 1, rating: 3, question_1_rating: 3 });
  });

  afterEach(() => {
    fixture.destroy();
  });
});

@Component({
  template: ` <app-evaluation-content [questions]="questions" [form]="form"></app-evaluation-content>`,
  imports: [EvaluationContentComponent],
})
class TestHostComponent {
  questions: EvaluationQuestion[] = [{ id: 1, title: 'First question', i18n: 'First question' }];
  form = new FormGroup({
    comment: new FormControl<string>(''),
    nps: new FormControl<number>(1, Validators.required),
    rating: new FormControl<number>(1, Validators.required),
    question_1_rating: new FormControl<number>(3, Validators.required),
  });
}
