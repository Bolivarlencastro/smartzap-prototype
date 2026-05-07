import { animate, style, transition, trigger } from '@angular/animations';
import { DatePipe, NgClass, NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, ElementRef, HostListener, input, output, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { TranslocoModule } from '@jsverse/transloco';
import { UserProfileService } from '@keeps-platform-frontend-workspace/kp-keeps';
import { constants } from '@keeps-platform-frontend-workspace/ui/constants';
import PlotlyJS from 'plotly.js-dist-min';
import { PlotlyModule } from 'angular-plotly.js';
import { ChatMessage } from '../../models';
import { DeepCopyPlotlyDataPipe } from '../../pipes/deep-copy-plotly-data.pipe';
import { MarkdownRendererComponent } from '../markdown-renderer/markdown-renderer.component';

PlotlyModule.plotlyjs = PlotlyJS;

@Component({
  selector: 'kp-chatbot-messages',
  imports: [
    NgClass,
    DatePipe,
    NgTemplateOutlet,
    MatProgressSpinnerModule,
    TranslocoModule,
    MatButtonModule,
    MatIcon,
    PlotlyModule,
    DeepCopyPlotlyDataPipe,
    MarkdownRendererComponent,
  ],
  template: `
    @if (displayScrollButton()) {
      <button mat-mini-fab [@fadeAnimation] class="scroll-btn" color="primary" (click)="scrollToBottom()">
        <mat-icon>arrow_downward</mat-icon>
      </button>
    }

    @if (isLoading()) {
      <div class="message-container bot">
        <ng-container *ngTemplateOutlet="avatar; context: { $implicit: botAvatar }"></ng-container>
        <mat-spinner class="h-6 w-6"></mat-spinner>
      </div>
    }

    <!-- MESSAGES -->
    @for (message of chat(); track message.time) {
      <div class="message-container" [ngClass]="{ user: message.sender === 'user', bot: message.sender === 'bot' }">
        @if (message.sender === 'bot') {
          <ng-container *ngTemplateOutlet="avatar; context: { $implicit: botAvatar }"></ng-container>
        }

        <div class="message-bubble">
          @switch (message.type) {
            @case ('text-only') {
              <kp-markdown-renderer [markdown]="message.text | transloco"></kp-markdown-renderer>
            }
            @case ('table') {
              <div class="chat-table" [innerHTML]="message.data"></div>
            }
            @case ('plot') {
              <div class="chat-plotly">
                <plotly-plot
                  [data]="message.data.data | deepCopyPlotlyData"
                  [layout]="message.data.layout | deepCopyPlotlyData"
                ></plotly-plot>
              </div>
            }
            @case ('interactive') {
              <div class="flex flex-col gap-4">
                <kp-markdown-renderer [markdown]="message.text"></kp-markdown-renderer>

                <div class="flex flex-wrap gap-2 px-2">
                  <button
                    mat-flat-button
                    color="primary"
                    [disabled]="isLoading()"
                    (click)="onGenerateTable(message.questionToken)"
                  >
                    {{ 'CHATBOT.MESSAGES.GENERATE_TABLE' | transloco }}
                  </button>
                  <button
                    mat-flat-button
                    color="primary"
                    [disabled]="isLoading()"
                    (click)="onGeneratePlot(message.questionToken)"
                  >
                    {{ 'CHATBOT.MESSAGES.GENERATE_PLOT' | transloco }}
                  </button>
                  <button
                    mat-flat-button
                    color="primary"
                    [disabled]="isLoading()"
                    (click)="onDownloadCSV(message.questionToken)"
                  >
                    {{ 'CHATBOT.MESSAGES.DOWNLOAD_CSV' | transloco }}
                  </button>
                </div>

                <div class="flex flex-col justify-center gap-2 px-2 pb-2">
                  @for (question of message.followupQuestions; track question) {
                    <a
                      class="text-primary cursor-pointer text-sm w-fit underline underline-offset-2 hover:no-underline"
                      [ngClass]="{ 'opacity-50 pointer-events-none': isLoading() }"
                      (click)="onSendSuggestedMessage(question)"
                    >
                      {{ question }}
                    </a>
                  }
                </div>
              </div>
            }
          }
          <span class="time">{{ message.time | date: 'HH:mm' }}</span>
        </div>

        @if (message.sender === 'user') {
          <ng-container *ngTemplateOutlet="avatar; context: { $implicit: userAvatar }"></ng-container>
        }
      </div>
    }

    <ng-template #avatar let-url>
      <div
        [style.background]="url"
        class="avatar h-11 w-11 min-w-content bg-cover bg-center rounded-full shrink-0"
      ></div>
    </ng-template>
  `,
  styles: [
    `
      :host {
        margin: 12px 0 56px;
        padding-bottom: 12px;
        display: flex;
        flex-direction: column-reverse;
        overflow-y: auto;
        height: 0;
        scrollbar-width: none;
        position: relative;
      }

      .message-container {
        display: flex;
        max-width: calc(100% - 55px);
        margin-bottom: 14px;
        gap: 12px;
      }

      .user {
        align-self: flex-end;
      }

      .message-bubble {
        padding: 4px;
        max-width: calc(100% - 55px);
        display: flex;
        flex-direction: column;
        gap: 6px;
        font-size: 15px;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
      }

      .user .message-bubble {
        background-color: #f1f5f9;
        border-radius: 6px 0px 6px 6px;
        color: #1e293b;
        border: 1px solid #e2e8f0;
      }

      .bot .message-bubble {
        background-color: #ffffff;
        border-radius: 6px 0px 6px 6px;
        color: #334155;
        border: 1px solid #e2e8f0;
      }

      .time {
        font-size: 10px;
        color: #94a3b8;
        align-self: flex-end;
        margin: 0 8px 6px 0;
      }

      .avatar {
        margin-top: -24px;
      }

      .scroll-btn {
        position: sticky;
        bottom: 0.5rem;
        margin-top: -48px;
        margin-left: auto;
        margin-right: auto;
        z-index: 10;
      }

      .chat-table {
        overflow: auto;
        max-height: 500px;
      }

      .chat-plotly {
        overflow: auto;
        display: flex;
      }
    `,
  ],
  animations: [
    trigger('fadeAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(10px)' }),
        animate('200ms ease-out', style({ opacity: 1, transform: 'translateY(0)' })),
      ]),
      transition(':leave', [animate('200ms ease-in', style({ opacity: 0, transform: 'translateY(10px)' }))]),
    ]),
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChatbotMessagesComponent {
  chat = input<ChatMessage[]>();
  isLoading = input<boolean>();
  generateTable = output<string>();
  generatePlot = output<string>();
  downloadCSV = output<string>();
  sendSuggestedMessage = output<string>();

  displayScrollButton = signal(false);
  hostEl: HTMLElement;

  protected botAvatar = 'url(https://23523710.fs1.hubspotusercontent-na1.net/hubfs/23523710/agoravai.png)';
  protected userAvatar: string;
  private readonly defaultUserAvatar = constants.defaultUserAvatar;

  constructor(
    private readonly userProfileService: UserProfileService,
    private readonly elementRef: ElementRef,
  ) {
    this.userAvatar = `url(${userProfileService.getProfile()?.avatar || this.defaultUserAvatar})`;
    this.hostEl = this.elementRef.nativeElement;
  }

  @HostListener('scroll', ['$event.target'])
  onScroll(hostEl: HTMLElement) {
    this.displayScrollButton.set(hostEl.scrollTop < -200);
  }

  scrollToBottom() {
    this.hostEl.scrollTo({
      top: this.hostEl.scrollHeight,
      behavior: 'smooth',
    });
  }

  onGenerateTable(token: string) {
    this.generateTable.emit(token);
  }

  onGeneratePlot(token: string) {
    this.generatePlot.emit(token);
  }

  onDownloadCSV(token: string) {
    this.downloadCSV.emit(token);
  }

  onSendSuggestedMessage(question: string) {
    this.sendSuggestedMessage.emit(question);
  }
}
