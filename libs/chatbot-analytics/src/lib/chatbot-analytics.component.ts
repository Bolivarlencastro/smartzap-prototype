import { animate, style, transition, trigger } from '@angular/animations';
import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, Inject, OnDestroy } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { ChatbotHeaderComponent } from './components/chatbot-header/chatbot-header.component';
import { ChatbotInputComponent } from './components/chatbot-input/chatbot-input.component';
import { ChatbotMessagesComponent } from './components/chatbot-messages/chatbot-messages.component';
import { ChatbotViewModel } from './models';
import { ChatbotAnalyticsActions, chatbotAnalyticsFeature } from './store';
import { ChatbotAnalyticsStoreModule } from './store.module';
import { getTranslocoScope } from './util';
import { ChatbotDialogData } from '@keeps-platform-frontend-workspace/kp-keeps';
import { ChatbotLoadingComponent } from './components/chatbot-loading/chatbot-loading.component';

@Component({
  selector: 'kp-chatbot-analytics',
  imports: [
    ChatbotAnalyticsStoreModule,
    ChatbotHeaderComponent,
    ChatbotMessagesComponent,
    ChatbotInputComponent,
    AsyncPipe,
    ChatbotLoadingComponent,
  ],
  providers: [getTranslocoScope()],
  template: `
    @if (vm$ | async; as vm) {
      <div class="container flex flex-col h-full p-5">
        <kp-chatbot-header [name]="data.name"></kp-chatbot-header>
        @if (vm.initialLoading) {
          <kp-chatbot-loading @fadeOut class="absolute inset-0 z-50 bg-white"></kp-chatbot-loading>
        } @else {
          <kp-chatbot-messages
            class="grow"
            [chat]="vm.chat"
            [isLoading]="vm.isLoading"
            (generateTable)="generateTable($event)"
            (generatePlot)="generatePlot($event)"
            (downloadCSV)="downloadCSV($event)"
            (sendSuggestedMessage)="sendMessage($event)"
          ></kp-chatbot-messages>
          <kp-chatbot-input
            @fadeIn
            [initialState]="vm.initialState"
            [isLoading]="vm.isLoading"
            (send)="sendMessage($event)"
          ></kp-chatbot-input>
        }
      </div>
    }
  `,
  styles: [
    `
      :host {
        height: 100%;
        display: flex;
        flex-direction: column;
        overflow: hidden;
      }

      .container {
        position: relative;
        background-color: #fafafa;
      }
    `,
  ],
  animations: [
    trigger('fadeOut', [
      transition(':leave', [style({ opacity: 1 }), animate('0.3s ease-in-out', style({ opacity: 0 }))]),
    ]),
    trigger('fadeIn', [
      transition(':enter', [style({ opacity: 0 }), animate('0.3s ease-in-out', style({ opacity: 1 }))]),
    ]),
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChatbotAnalyticsComponent implements OnDestroy {
  protected readonly vm$: Observable<ChatbotViewModel>;

  constructor(
    @Inject(MAT_DIALOG_DATA) protected data: ChatbotDialogData,
    private readonly store: Store,
  ) {
    this.vm$ = store.select(chatbotAnalyticsFeature.selectViewModel);
    store.dispatch(ChatbotAnalyticsActions.startAgent({ report_id: data.report_id }));
  }

  ngOnDestroy() {
    this.store.dispatch(ChatbotAnalyticsActions.resetState());
  }

  sendMessage(text: string) {
    this.store.dispatch(ChatbotAnalyticsActions.sendMessage({ text }));
  }

  generateTable(token: string) {
    this.store.dispatch(ChatbotAnalyticsActions.generateTable({ token }));
  }

  generatePlot(token: string) {
    this.store.dispatch(ChatbotAnalyticsActions.generatePlot({ token }));
  }

  downloadCSV(token: string) {
    this.store.dispatch(ChatbotAnalyticsActions.downloadCSV({ token }));
  }
}
