import { KpQuizService } from './kp-quiz.service';

describe('KpQuizService', () => {
  let service: KpQuizService;

  beforeEach(() => {
    service = new KpQuizService();
  });

  describe('selectOption', () => {
    it('should update selection and mark as selected if options are provided', () => {
      const options = ['option1', 'option2'];
      service.selected$.subscribe((selected) => {
        expect(selected).toBeTruthy();
      });
      service.selectOption(options);
      expect(service.getCurrentSelection()).toEqual(options);
    });

    it('should mark as not selected when no options are provided', () => {
      service.selected$.subscribe((selected) => {
        expect(selected).toBeFalsy();
      });
      service.selectOption([]);
      expect(service.getCurrentSelection()).toEqual([]);
    });
  });

  describe('clearSelection', () => {
    it('should clear the selection and set selected to false', () => {
      service.selectOption(['option1']);
      service.clearSelection();
      expect(service.getCurrentSelection()).toEqual([]);
      service.selected$.subscribe((selected) => {
        expect(selected).toBeFalsy();
      });
    });
  });

  describe('setAnswers', () => {
    it('should set answers, update summary, and call answered if last selected question exists', () => {
      const answers = [
        { question: 'question1', options: 'answer1', is_ok: true },
        { question: 'question2', options: 'answer2', is_ok: false },
      ];
      service['answered']('question1');
      service.setAnswers(answers);
      service.answeres$.subscribe((answersMap) => {
        expect(answersMap).toEqual({
          question1: 'answer1',
          question2: 'answer2',
        });
      });
      service.summary$.subscribe((summary) => {
        expect(summary).toEqual({ total: 2, correctAnswers: 1 });
      });
    });

    it('should update summary even if last selected question does not exist', () => {
      const answers = [{ question: 'question3', options: 'answer3', is_ok: true }];
      service.setAnswers(answers);
      service.summary$.subscribe((summary) => {
        expect(summary).toEqual({ total: 1, correctAnswers: 1 });
      });
    });
  });

  describe('convertAnswersToMap', () => {
    it('should correctly convert answers array to a map', () => {
      const answers = [
        { question: 'question1', options: 'answer1' },
        { question: 'question2', options: null, text_response: 'Something like an answer' },
        { question: 'question3', options: 'answer3' },
      ];
      const result = service.convertAnswersToMap(answers);
      expect(result).toEqual({
        question1: 'answer1',
        question2: 'Something like an answer',
        question3: 'answer3',
      });
    });
  });

  describe('buildSummary', () => {
    it('should correctly calculate total and correct answers', () => {
      const answers = [
        { question: 'question1', is_ok: true },
        { question: 'question2', is_ok: false },
      ];
      const result = service.buildSummary(answers);
      expect(result).toEqual({ total: 2, correctAnswers: 1 });
    });
  });
});
