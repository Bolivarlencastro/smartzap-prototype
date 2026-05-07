import { TestBed } from '@angular/core/testing';
import { KontentAPI } from '@core/api';
import { Question } from 'app/main/courses/model';
import { of } from 'rxjs';
import { ExamService } from './exam.service';

class KontentAPIMock {
  get(_url: string, _options: any) {
    return of({});
  }

  post(_url: string, _data: any) {
    return of({});
  }

  patch(_url: string, _data: any) {
    return of({});
  }

  delete(_url: string) {
    return of({});
  }
}

describe('ExamService', () => {
  let examService: ExamService;
  let kontentApiService: KontentAPI;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{ provide: KontentAPI, useClass: KontentAPIMock }],
    });
    examService = TestBed.inject(ExamService);
    kontentApiService = TestBed.inject(KontentAPI);
  });

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  describe('createExam', () => {
    it('should request to create an exam', (done) => {
      const exam = { title: 'Exam name' };

      jest.spyOn(kontentApiService, 'post').mockReturnValue(of({}));

      examService.createExam(exam).subscribe(() => {
        expect(kontentApiService.post).toHaveBeenCalledWith('/assessments/exams', exam);
        done();
      });
    });
  });

  describe('fetchExamQuestions', () => {
    it('should request to fetch questions by exam id', (done) => {
      const examId = '1';
      const options = { perPage: 20 };
      const questions: Question[] = [
        {
          id: '',
          workspace_id: '',
          user_creator_id: '',
          question_type: 'correct_choices',
          title: '',
          points: 5,
          options: [],
          created_date: '',
          updated_date: '',
        },
      ];
      const mockedResponse = { results: questions };

      jest.spyOn(kontentApiService, 'get').mockReturnValue(of(mockedResponse));

      examService.fetchExamQuestions(examId, options).subscribe((response) => {
        expect(response).toEqual(questions);
        expect(kontentApiService.get).toHaveBeenCalledWith(`/assessments/exams/${examId}/questions`, {
          per_page: options.perPage,
        });
        done();
      });
    });

    it('should request to fetch questions by exam id with default options', (done) => {
      const examId = '1';
      const questions: Question[] = [
        {
          id: '',
          workspace_id: '',
          user_creator_id: '',
          question_type: 'correct_choices',
          title: '',
          points: 5,
          options: [],
          created_date: '',
          updated_date: '',
        },
      ];
      const mockedResponse = { results: questions };

      jest.spyOn(kontentApiService, 'get').mockReturnValue(of(mockedResponse));

      examService.fetchExamQuestions(examId).subscribe((response) => {
        expect(response).toEqual(questions);
        expect(kontentApiService.get).toHaveBeenCalledWith(`/assessments/exams/${examId}/questions`, {
          per_page: 999,
        });
        done();
      });
    });
  });

  describe('createExamQuestion', () => {
    it('should request to create a question', (done) => {
      const examId = '1';
      const question: Partial<Question> = {
        question_type: 'correct_choices',
        title: 'Question title',
        points: 5,
        options: [],
      };

      jest.spyOn(kontentApiService, 'post').mockReturnValue(of({}));

      examService.createExamQuestion({ examId, question }).subscribe(() => {
        expect(kontentApiService.post).toHaveBeenCalledWith(`/assessments/exams/${examId}/questions`, question);
        done();
      });
    });
  });

  describe('updateExamQuestion', () => {
    it('should request to update a question', (done) => {
      const question: Partial<Question> = {
        id: '1',
        question_type: 'correct_choices',
        title: 'Question title',
        points: 5,
        options: [],
      };

      jest.spyOn(kontentApiService, 'patch').mockReturnValue(of({}));

      examService.updateExamQuestion({ question }).subscribe(() => {
        expect(kontentApiService.patch).toHaveBeenCalledWith(`/assessments/questions/${question.id}`, question);
        done();
      });
    });
  });

  describe('removeExamQuestion', () => {
    it('should request to remove a question', (done) => {
      const questionId = '1';

      jest.spyOn(kontentApiService, 'delete').mockReturnValue(of({}));

      examService.removeExamQuestion({ questionId }).subscribe(() => {
        expect(kontentApiService.delete).toHaveBeenCalledWith(`/assessments/questions/${questionId}`);
        done();
      });
    });
  });
});
