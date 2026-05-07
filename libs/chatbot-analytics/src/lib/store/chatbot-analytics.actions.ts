import { createAction, props } from '@ngrx/store';
import { ChatMessage } from '../models';
import { AskQuestionDto } from '@keeps-platform-frontend-workspace/kp-keeps';

export const startAgent = createAction('[Chatbot Analytics] Start Agent', props<{ report_id: string }>());
export const startAgentSuccess = createAction(
  '[Chatbot Analytics] Start Agent Success',
  props<{ sessionToken: string }>(),
);

export const messageSuccess = createAction('[Chatbot Analytics] Message Success', props<{ response: ChatMessage }>());
export const messageError = createAction('[Chatbot Analytics] Message Error');

export const sendMessage = createAction('[Chatbot Analytics] Send Message', props<{ text: string }>());

export const generateFollowupQuestions = createAction(
  '[Chatbot Analytics] Generate Followup Questions',
  props<{ answer: AskQuestionDto }>(),
);

export const downloadCSV = createAction('[Chatbot Analytics] Download CSV', props<{ token: string }>());

export const generateTable = createAction('[Chatbot Analytics] Generate Table', props<{ token: string }>());

export const generatePlot = createAction('[Chatbot Analytics] Generate Plot', props<{ token: string }>());

export const resetState = createAction('[Chatbot Analytics] Reset State');
