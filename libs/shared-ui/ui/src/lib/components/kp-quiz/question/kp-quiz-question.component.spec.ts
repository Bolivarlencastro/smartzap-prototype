import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { EMPTY, of } from 'rxjs';
import { KpQuizService } from '../kp-quiz.service';
import { KpQuizQuestionComponent } from './kp-quiz-question.component';

describe('KpQuizQuestionComponent', () => {
  let component: KpQuizQuestionComponent;
  let fixture: ComponentFixture<KpQuizQuestionComponent>;
  let mockKpQuizService: jest.Mocked<KpQuizService>;

  beforeEach(async () => {
    mockKpQuizService = {
      answer$: of(EMPTY),
      answered$: of(EMPTY),
      answered: jest.fn(),
      selectOption: jest.fn(),
    } as unknown as jest.Mocked<KpQuizService>;

    await TestBed.configureTestingModule({
      imports: [KpQuizQuestionComponent, NoopAnimationsModule],
      providers: [{ provide: KpQuizService, useValue: mockKpQuizService }],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(KpQuizQuestionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('onAnimationDone', () => {
    it('should emit animationDoneEvent when toState is hidden', () => {
      const emitSpy = jest.spyOn(component.animationDoneEvent, 'emit');
      const event = { toState: 'hidden' } as any;

      component.onAnimationDone(event);

      expect(emitSpy).toHaveBeenCalledWith(true);
    });

    it('should not emit animationDoneEvent when toState is not hidden', () => {
      const emitSpy = jest.spyOn(component.animationDoneEvent, 'emit');
      const event = { toState: 'visible' } as any;

      component.onAnimationDone(event);

      expect(emitSpy).not.toHaveBeenCalled();
    });
  });

  describe('close', () => {
    it('should set animationState to hidden', () => {
      expect(component.animationState).toBe('visible');

      component.close();

      expect(component.animationState).toBe('hidden');
    });
  });

  describe('onSelectOption', () => {
    it('should call service selectOption with selection', () => {
      const selection = ['option1', 'option2'];

      component.onSelectOption(selection);

      expect(mockKpQuizService.selectOption).toHaveBeenCalledWith(selection);
    });

    it('should handle null selection', () => {
      component.onSelectOption(null);

      expect(mockKpQuizService.selectOption).toHaveBeenCalledWith(null);
    });
  });

  describe('inputText signal', () => {
    it('should update inputText signal', () => {
      component.inputText.set('New text');

      expect(component.inputText()).toBe('New text');
    });
  });
});
