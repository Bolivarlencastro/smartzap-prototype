import { TestBed } from '@angular/core/testing';
import { QuizFormService } from './quiz-form.service';
import { QuizFormModel, QuestionInput } from '../../models/quiz';

const VALID_QUIZ: QuizFormModel = {
  id: 'mock-id',
  questions: [
    {
      id: 'question-id-1',
      options: [
        {
          correct_answer: true,
          id: 'question-id-1-option-id-1',
          option: 'option 1',
        },
        {
          correct_answer: false,
          id: 'question-id-1-option-id-2',
          option: 'option 2',
        },
      ],
      question_text: 'first question',
      save_to_bank: false,
    },
    {
      id: 'question-id-2',
      options: [
        {
          correct_answer: true,
          id: 'question-id-2-option-id-1',
          option: 'option 1',
        },
        {
          correct_answer: false,
          id: 'question-id-2-option-id-2',
          option: 'option 2',
        },
      ],
      question_text: 'second question',
      save_to_bank: true,
    },
  ],
  questions_to_show: 0,
  randomize_options: false,
  randomize_questions: false,
  title: 'quiz title',
} as const;

describe('QuizFormService', () => {
  let service: QuizFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [QuizFormService] });
    service = TestBed.inject(QuizFormService);
  });

  describe('setQuiz', () => {
    it('should set the provided quiz as the form value', () => {
      service.setQuiz(VALID_QUIZ);

      expect(service.getQuiz()).toEqual(VALID_QUIZ);
    });
  });

  describe('questionCount', () => {
    it('should start at 0', () => {
      expect(service.questionCount()).toBe(0);
    });

    it('should be 1 after one addQuestion()', () => {
      service.addQuestion();

      expect(service.questionCount()).toBe(1);
    });

    it('should be 2 after two addQuestion() calls', () => {
      service.addQuestion();
      service.addQuestion();

      expect(service.questionCount()).toBe(2);
    });
  });

  describe('getQuiz', () => {
    it('should return the quiz value', () => {
      const quiz = service.getQuiz();

      expect(quiz).toEqual({
        title: '',
        questions_to_show: null,
        randomize_questions: false,
        randomize_options: false,
        questions: [],
      });
    });
  });

  describe('questions', () => {
    it('should add a field with the default QuestionInput shape', () => {
      const expectedQuestion: QuestionInput = {
        question_text: '',
        options: [
          { option: '', correct_answer: false },
          { option: '', correct_answer: false },
        ],
        save_to_bank: false,
      };

      service.addQuestion();

      const question = service.getQuiz().questions.at(0);
      expect(question).toEqual(expectedQuestion);
    });

    it('should remove the question at the given index', () => {
      service.addQuestion();
      service.addQuestion();

      service.removeQuestion(0);

      expect(service.getQuiz().questions.length).toBe(1);
    });

    it('should update the text of a question', () => {
      service.setQuiz(VALID_QUIZ);

      service.updateQuestionText(0, 'new question text');

      expect(service.getQuiz().questions[0].question_text).toBe('new question text');
    });
  });

  describe('addQuestionFromBank', () => {
    it('should append the question to the list', () => {
      service.addQuestionFromBank({
        question_text: 'Questão do banco',
        options: [
          { option: 'Opção A', correct_answer: true },
          { option: 'Opção B', correct_answer: false },
        ],
        save_to_bank: false,
      });

      expect(service.questionCount()).toBe(1);
    });

    it('should map question_text and options correctly', () => {
      service.addQuestionFromBank({
        question_text: 'Questão do banco',
        options: [
          { option: 'Opção A', correct_answer: true },
          { option: 'Opção B', correct_answer: false },
        ],
        save_to_bank: false,
      });

      const added = service.getQuiz().questions[0];
      expect(added.question_text).toBe('Questão do banco');
      expect(added.options).toEqual([
        { option: 'Opção A', correct_answer: true },
        { option: 'Opção B', correct_answer: false },
      ]);
    });

    it('should default save_to_bank to false when not provided', () => {
      service.addQuestionFromBank({
        question_text: 'Questão do banco',
        options: [
          { option: 'Opção A', correct_answer: true },
          { option: 'Opção B', correct_answer: false },
        ],
      });

      expect(service.getQuiz().questions[0].save_to_bank).toBe(false);
    });

    it('should add an independent copy and not share references', () => {
      const source = {
        question_text: 'Questão original',
        options: [
          { option: 'Opção A', correct_answer: true },
          { option: 'Opção B', correct_answer: false },
        ],
        save_to_bank: false,
      };

      service.addQuestionFromBank(source);
      source.question_text = 'Modificado após adicionar';

      expect(service.getQuiz().questions[0].question_text).toBe('Questão original');
    });

    it('should append after existing questions', () => {
      service.setQuiz(VALID_QUIZ);

      service.addQuestionFromBank({
        question_text: 'Questão do banco',
        options: [
          { option: 'Opção A', correct_answer: true },
          { option: 'Opção B', correct_answer: false },
        ],
        save_to_bank: false,
      });

      expect(service.questionCount()).toBe(3);
      expect(service.getQuiz().questions[2].question_text).toBe('Questão do banco');
    });
  });

  describe('questionOptions', () => {
    it('should add a question option', () => {
      service.setQuiz(VALID_QUIZ);

      service.addQuestionOption(0);

      expect(service.getQuiz().questions[0].options.length).toBe(3);
    });

    it('should remove a question option', () => {
      service.setQuiz(VALID_QUIZ);

      service.removeQuestionOption(0, 0);

      expect(service.getQuiz().questions[0].options.length).toBe(1);
    });
  });

  describe('isFormValid', () => {
    it('should be false initially', () => {
      expect(service.isFormValid()).toBe(false);
    });

    it('should be valid when a valid quiz is the form value', () => {
      service.setQuiz(VALID_QUIZ);

      expect(service.isFormValid()).toBe(true);
    });

    it('should be invalid when the quiz title is empty', () => {
      service.setQuiz({ ...VALID_QUIZ, title: '' });

      expect(service.isFormValid()).toBe(false);
    });

    it('should be invalid when there are no questions', () => {
      service.setQuiz({ ...VALID_QUIZ, questions: [] });

      expect(service.isFormValid()).toBe(false);
    });

    it('should be invalid when one of the questions text is empty', () => {
      const invalidQuestion = { ...VALID_QUIZ.questions[0], question_text: '' };
      const validQuestion = VALID_QUIZ.questions[1];
      service.setQuiz({ ...VALID_QUIZ, questions: [invalidQuestion, validQuestion] });

      expect(service.isFormValid()).toBe(false);
    });

    it('should be invalid when one of the questions options is empty', () => {
      const invalidQuestion: QuestionInput = {
        options: [
          { correct_answer: true, option: '' },
          { correct_answer: false, option: 'wrong-option' },
        ],
        question_text: 'invalid-question',
        save_to_bank: false,
      };
      const validQuestion = VALID_QUIZ.questions[1];
      service.setQuiz({ ...VALID_QUIZ, questions: [invalidQuestion, validQuestion] });

      expect(service.isFormValid()).toBe(false);
    });

    it('should be invalid when the question does not have at least one correct option', () => {
      const invalidQuestion: QuestionInput = {
        options: [
          { correct_answer: false, option: 'wrong-option-1' },
          { correct_answer: false, option: 'wrong-option-2' },
          { correct_answer: false, option: 'wrong-option-3' },
          { correct_answer: false, option: 'wrong-option-4' },
        ],
        question_text: 'invalid-question',
        save_to_bank: false,
      };
      const validQuestion = VALID_QUIZ.questions[1];
      service.setQuiz({ ...VALID_QUIZ, questions: [invalidQuestion, validQuestion] });

      expect(service.isFormValid()).toBe(false);
    });

    it('should be invalid when the question has more than 5 options', () => {
      const invalidQuestion: QuestionInput = {
        options: [
          { correct_answer: false, option: 'option-1' },
          { correct_answer: false, option: 'option-2' },
          { correct_answer: false, option: 'option-3' },
          { correct_answer: false, option: 'option-4' },
          { correct_answer: false, option: 'option-5' },
          { correct_answer: true, option: 'option-6' },
        ],
        question_text: 'invalid-question',
        save_to_bank: false,
      };
      const validQuestion = VALID_QUIZ.questions[1];
      service.setQuiz({ ...VALID_QUIZ, questions: [invalidQuestion, validQuestion] });

      expect(service.isFormValid()).toBe(false);
    });
  });
});
