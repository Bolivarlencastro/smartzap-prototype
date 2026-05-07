// Re-export the canonical service and types from the shared core library.
// App-level code may import from here or directly from @keeps-platform-frontend-workspace/kp-keeps.
export {
  QuizApiService,
  QuizConsumerOutput,
  QuestionOptionConsumerOutput,
  QuestionAnswerState,
  QuestionConsumerOutput,
  QuizAnswerInput as AnswerInput,
  QuizAnswerOutput as AnswerOutput,
  AnswerPreviewOutput,
  QuizScoreOutput,
} from '@keeps-platform-frontend-workspace/kp-keeps';
