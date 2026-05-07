import { marker } from '@jsverse/transloco-keys-manager/marker';
import { createFeature, createReducer, createSelector, on } from '@ngrx/store';
import { ChatbotAnalyticsActions } from '.';
import { ChatbotViewModel, ChatMessage } from '../models';

export interface ChatbotAnalyticsFeatureState {
  initialState: boolean;
  initialLoading: boolean;
  chat: ChatMessage[];
  isLoading: boolean;
  sessionToken: string;
  questionToken: string;
}

export const chatbotAnalyticsInitialState: ChatbotAnalyticsFeatureState = {
  initialState: true,
  initialLoading: true,
  chat: [],
  isLoading: false,
  sessionToken: null,
  questionToken: null,
};

export const chatbotAnalyticsReducer = createReducer(
  chatbotAnalyticsInitialState,

  on(
    ChatbotAnalyticsActions.startAgentSuccess,
    (state, { sessionToken }): ChatbotAnalyticsFeatureState => ({
      ...state,
      initialLoading: false,
      sessionToken,
    }),
  ),

  on(
    ChatbotAnalyticsActions.sendMessage,
    (state, { text }): ChatbotAnalyticsFeatureState => ({
      ...state,
      initialState: false,
      isLoading: true,
      chat: [{ text, sender: 'user', time: Date.now(), type: 'text-only' }, ...state.chat],
    }),
  ),

  on(
    ChatbotAnalyticsActions.generateTable,
    ChatbotAnalyticsActions.generatePlot,
    (state): ChatbotAnalyticsFeatureState => ({
      ...state,
      isLoading: true,
    }),
  ),

  on(
    ChatbotAnalyticsActions.messageSuccess,
    (state, { response }): ChatbotAnalyticsFeatureState => ({
      ...state,
      isLoading: false,
      chat: [response, ...state.chat],
    }),
  ),

  on(
    ChatbotAnalyticsActions.messageError,
    (state): ChatbotAnalyticsFeatureState => ({
      ...state,
      isLoading: false,
      chat: [
        { text: marker('CHATBOT.MESSAGES.ERROR'), sender: 'bot', time: Date.now(), type: 'text-only' },
        ...state.chat,
      ],
    }),
  ),

  on(ChatbotAnalyticsActions.resetState, (): ChatbotAnalyticsFeatureState => chatbotAnalyticsInitialState),
);

export const chatbotAnalyticsFeature = createFeature({
  name: 'chatbotAnalytics',
  reducer: chatbotAnalyticsReducer,
  extraSelectors: ({ selectInitialState, selectInitialLoading, selectChat, selectIsLoading }) => ({
    selectViewModel: createSelector(
      selectInitialState,
      selectInitialLoading,
      selectChat,
      selectIsLoading,
      (initialState, initialLoading, chat, isLoading): ChatbotViewModel => ({
        initialState,
        initialLoading,
        chat,
        isLoading,
      }),
    ),
  }),
});
