import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';
import { QuestionRequest, QuizScoreOutput } from '@keeps-platform-frontend-workspace/kp-keeps';
import { KpQuizCardService, QuizAnswerEntry } from './kp-quiz.service';

const makeAnswer = (exam_has_question: string, is_ok = false): QuizAnswerEntry => ({
  exam_has_question,
  options: ['opt-1'],
  correct_options: ['opt-1'],
  is_ok,
});

describe('KpQuizCardService', () => {
  let service: KpQuizCardService;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [KpQuizCardService] });
    service = TestBed.inject(KpQuizCardService);
  });

  describe('initial state', () => {
    it('selected$ starts as false', async () => {
      expect(await firstValueFrom(service.selected$)).toBe(false);
    });

    it('answered$ starts as false', async () => {
      expect(await firstValueFrom(service.answered$)).toBe(false);
    });

    it('answers$ starts as empty map', async () => {
      expect(await firstValueFrom(service.answers$)).toEqual({});
    });

    it('summary$ starts with zeros', async () => {
      expect(await firstValueFrom(service.summary$)).toEqual({ total: 0, correctAnswers: 0 });
    });

    it('score$ starts as null', async () => {
      expect(await firstValueFrom(service.score$)).toBeNull();
    });

    it('loadingScore$ starts as false', async () => {
      expect(await firstValueFrom(service.loadingScore$)).toBe(false);
    });

    it('showNextContent$ starts as true', async () => {
      expect(await firstValueFrom(service.showNextContent$)).toBe(true);
    });
  });

  describe('nextContent', () => {
    it('should emit on nextContent$', (done) => {
      service.nextContent$.subscribe(() => done());
      service.nextContent();
    });
  });

  describe('goBack', () => {
    it('should emit on goBack$', (done) => {
      service.goBack$.subscribe(() => done());
      service.goBack();
    });
  });

  describe('selectOption', () => {
    it('should emit true on selected$ when options are provided', async () => {
      const option: QuestionRequest = { id: 'q1', options: ['opt-1'] };

      service.selectOption(option);

      expect(await firstValueFrom(service.selected$)).toBe(true);
    });

    it('should store the selection when options are provided', () => {
      const option: QuestionRequest = { id: 'q1', options: ['opt-1'] };

      service.selectOption(option);

      expect(service.getCurrentSelection()).toEqual(option);
    });

    it('should emit false on selected$ when options array is empty', async () => {
      const option: QuestionRequest = { id: 'q1', options: ['opt-1'] };
      service.selectOption(option);

      service.selectOption({ id: 'q1', options: [] });

      expect(await firstValueFrom(service.selected$)).toBe(false);
    });

    it('should clear the selection when options array is empty', () => {
      service.selectOption({ id: 'q1', options: ['opt-1'] });

      service.selectOption({ id: 'q1', options: [] });

      expect(service.getCurrentSelection()).toBeNull();
    });
  });

  describe('clearSelection', () => {
    it('should emit false on selected$', async () => {
      service.selectOption({ id: 'q1', options: ['opt-1'] });

      service.clearSelection();

      expect(await firstValueFrom(service.selected$)).toBe(false);
    });

    it('should set selection to null', () => {
      service.selectOption({ id: 'q1', options: ['opt-1'] });

      service.clearSelection();

      expect(service.getCurrentSelection()).toBeNull();
    });
  });

  describe('getCurrentSelection', () => {
    it('should return null initially', () => {
      expect(service.getCurrentSelection()).toBeNull();
    });

    it('should return the stored selection after selectOption', () => {
      const option: QuestionRequest = { id: 'q1', options: ['opt-1'] };

      service.selectOption(option);

      expect(service.getCurrentSelection()).toEqual(option);
    });
  });

  describe('disableSelection', () => {
    it('should emit false on selected$', async () => {
      service.selectOption({ id: 'q1', options: ['opt-1'] });

      service.disableSelection();

      expect(await firstValueFrom(service.selected$)).toBe(false);
    });
  });

  describe('answered', () => {
    it('should emit false when the question has no answer in the map', async () => {
      service.answered('q1');

      expect(await firstValueFrom(service.answered$)).toBe(false);
    });

    it('should emit true when the question exists in the answers map', async () => {
      service.setAnswers([makeAnswer('q1')]);

      service.answered('q1');

      expect(await firstValueFrom(service.answered$)).toBe(true);
    });

    it('should emit false when the question is not in the answers map', async () => {
      service.setAnswers([makeAnswer('q1')]);

      service.answered('q99');

      expect(await firstValueFrom(service.answered$)).toBe(false);
    });
  });

  describe('setScore', () => {
    it('should emit the given score on score$', async () => {
      const score = { correct: 3, total: 5 } as unknown as QuizScoreOutput;

      service.setScore(score);

      expect(await firstValueFrom(service.score$)).toEqual(score);
    });

    it('should emit null when called with null', async () => {
      service.setScore({ correct: 1, total: 1 } as unknown as QuizScoreOutput);

      service.setScore(null);

      expect(await firstValueFrom(service.score$)).toBeNull();
    });
  });

  describe('setLoadingScore', () => {
    it('should emit true on loadingScore$', async () => {
      service.setLoadingScore(true);

      expect(await firstValueFrom(service.loadingScore$)).toBe(true);
    });

    it('should emit false on loadingScore$', async () => {
      service.setLoadingScore(true);

      service.setLoadingScore(false);

      expect(await firstValueFrom(service.loadingScore$)).toBe(false);
    });
  });

  describe('setShowNextContent', () => {
    it('should emit false on showNextContent$', async () => {
      service.setShowNextContent(false);

      expect(await firstValueFrom(service.showNextContent$)).toBe(false);
    });

    it('should emit true on showNextContent$', async () => {
      service.setShowNextContent(false);

      service.setShowNextContent(true);

      expect(await firstValueFrom(service.showNextContent$)).toBe(true);
    });
  });

  describe('setAnswers', () => {
    it('should emit the answers as a keyed map on answers$', async () => {
      const answers = [makeAnswer('q1'), makeAnswer('q2')];

      service.setAnswers(answers);

      const map = await firstValueFrom(service.answers$);
      expect(map['q1']).toEqual(answers[0]);
      expect(map['q2']).toEqual(answers[1]);
    });

    it('should emit the correct summary with total and correctAnswers', async () => {
      service.setAnswers([makeAnswer('q1', true), makeAnswer('q2', false), makeAnswer('q3', true)]);

      expect(await firstValueFrom(service.summary$)).toEqual({ total: 3, correctAnswers: 2 });
    });

    it('should emit summary with zero correctAnswers when none are correct', async () => {
      service.setAnswers([makeAnswer('q1', false), makeAnswer('q2', false)]);

      expect(await firstValueFrom(service.summary$)).toEqual({ total: 2, correctAnswers: 0 });
    });

    it('should emit true on answered$ for the last selected question when it is in the answers', async () => {
      service.answered('q1');

      service.setAnswers([makeAnswer('q1')]);

      expect(await firstValueFrom(service.answered$)).toBe(true);
    });

    it('should emit false on answered$ for the last selected question when it is not in the answers', async () => {
      service.answered('q99');

      service.setAnswers([makeAnswer('q1')]);

      expect(await firstValueFrom(service.answered$)).toBe(false);
    });

    it('should not update answered$ when no question was previously selected', async () => {
      service.setAnswers([makeAnswer('q1')]);

      expect(await firstValueFrom(service.answered$)).toBe(false);
    });
  });
});
