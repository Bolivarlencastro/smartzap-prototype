import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { ChatbotAnalyticsService } from './services/chatbot-analytics.service';
import { ChatbotAnalyticsEffects } from './store/chatbot-analytics.effects';
import { chatbotAnalyticsFeature } from './store/chatbot-analytics.feature';

@NgModule({
  imports: [StoreModule.forFeature(chatbotAnalyticsFeature), EffectsModule.forFeature([ChatbotAnalyticsEffects])],
  providers: [ChatbotAnalyticsService],
})
export class ChatbotAnalyticsStoreModule {}
