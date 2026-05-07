import { Injectable } from '@angular/core';
import { PulseRequest } from '@core/model/pulse.model';

const CORRECT_CHOICES = 'correct_choices';
const EXAM_QUESTION_NAME = 'name';
const EXAM_QUESTION_OPTIONS = 'options';
const EXAM_QUESTION_ID = 'id';

@Injectable()
export class PulseQuizService {
  buildPulseQuiz(quiz: any): PulseRequest {
    return {
      name: quiz.title,
      exam: {
        title: quiz.title,
        questions: quiz.questions.map((question: any) => ({
          id: question.get(EXAM_QUESTION_ID).value,
          exam_question: question.get(EXAM_QUESTION_NAME).value,
          points: 5,
          question_type: CORRECT_CHOICES,
          options: question.get(EXAM_QUESTION_OPTIONS).value.map((option: any) => ({
            id: option.id,
            option: option.text,
            correct_answer: option.correct,
          })),
        })),
      },
    };
  }
}
