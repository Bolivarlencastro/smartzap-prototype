import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideAnimations } from '@angular/platform-browser/animations';
import { QuizScoreOutput } from '@keeps-platform-frontend-workspace/kp-keeps';
import { BehaviorSubject, firstValueFrom } from 'rxjs';
import { getTranslocoTestingModule } from '../../../transloco-testing.module';
import { KpQuizCardService, QuizSummary } from '../kp-quiz.service';
import { KpQuizSummaryComponent } from './kp-quiz-summary.component';

describe('KpQuizSummaryComponent', () => {
  let component: KpQuizSummaryComponent;
  let fixture: ComponentFixture<KpQuizSummaryComponent>;
  let summary$: BehaviorSubject<QuizSummary>;
  let score$: BehaviorSubject<QuizScoreOutput | null>;
  let loadingScore$: BehaviorSubject<boolean>;
  let showNextContent$: BehaviorSubject<boolean>;
  let mockService: { nextContent: jest.Mock; goBack: jest.Mock } & Record<string, unknown>;

  beforeEach(async () => {
    summary$ = new BehaviorSubject<QuizSummary>({ total: 5, correctAnswers: 3 });
    score$ = new BehaviorSubject<QuizScoreOutput | null>(null);
    loadingScore$ = new BehaviorSubject(false);
    showNextContent$ = new BehaviorSubject(true);

    mockService = {
      summary$: summary$.asObservable(),
      score$: score$.asObservable(),
      loadingScore$: loadingScore$.asObservable(),
      showNextContent$: showNextContent$.asObservable(),
      nextContent: jest.fn(),
      goBack: jest.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [KpQuizSummaryComponent, getTranslocoTestingModule()],
      providers: [provideAnimations(), { provide: KpQuizCardService, useValue: mockService }],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(KpQuizSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => jest.clearAllMocks());

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('nextContent', () => {
    it('should call service nextContent', () => {
      component.nextContent();

      expect(mockService.nextContent).toHaveBeenCalled();
    });
  });

  describe('goBack', () => {
    it('should call service goBack', () => {
      component.goBack();

      expect(mockService.goBack).toHaveBeenCalled();
    });
  });

  describe('vm$', () => {
    it('should emit scorePercentage as 0 when score is null', async () => {
      score$.next(null);

      const vm = await firstValueFrom(component.vm$);

      expect(vm.scorePercentage).toBe(0);
    });

    it('should emit scorePercentage as 0 when quiz_available_score is 0', async () => {
      score$.next({ quiz_awarded_score: 5, quiz_available_score: 0 } as unknown as QuizScoreOutput);

      const vm = await firstValueFrom(component.vm$);

      expect(vm.scorePercentage).toBe(0);
    });

    it('should compute scorePercentage correctly', async () => {
      score$.next({ quiz_awarded_score: 7, quiz_available_score: 10 } as unknown as QuizScoreOutput);

      const vm = await firstValueFrom(component.vm$);

      expect(vm.scorePercentage).toBe(70);
    });

    it('should round scorePercentage', async () => {
      score$.next({ quiz_awarded_score: 1, quiz_available_score: 3 } as unknown as QuizScoreOutput);

      const vm = await firstValueFrom(component.vm$);

      expect(vm.scorePercentage).toBe(33);
    });

    it('should include summary, score, loadingScore and showNextContent in the emitted value', async () => {
      const score = { quiz_awarded_score: 8, quiz_available_score: 10 } as unknown as QuizScoreOutput;
      score$.next(score);
      loadingScore$.next(true);
      showNextContent$.next(false);

      const vm = await firstValueFrom(component.vm$);

      expect(vm.summary).toEqual({ total: 5, correctAnswers: 3 });
      expect(vm.score).toEqual(score);
      expect(vm.loadingScore).toBe(true);
      expect(vm.showNextContent).toBe(false);
    });
  });
});
