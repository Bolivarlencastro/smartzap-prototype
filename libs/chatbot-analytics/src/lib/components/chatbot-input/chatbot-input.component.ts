import { Component, HostListener, input, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { TranslocoModule } from '@jsverse/transloco';

@Component({
  selector: 'kp-chatbot-input',
  template: `
    <div [class.has-message]="!initialState()" class="container">
      @if (initialState()) {
        <div class="text-3xl text-center mb-4">
          {{ 'CHATBOT.INPUT.INITIAL_MESSAGE' | transloco }}
        </div>
      }

      <div class="input-container rounded-full overflow-hidden h-14 pl-5 pr-2 flex items-center shadow-lg gap-2">
        <input
          matInput
          [(ngModel)]="input"
          class="grow h-full"
          placeholder="{{ 'CHATBOT.INPUT.PLACEHOLDER' | transloco }}"
        />
        <button
          mat-icon-button
          class="mat-elevation-z4 bg-primary disabled:bg-[#898989]"
          [disabled]="disabledButton"
          (click)="sendMessage()"
        >
          <mat-icon class="text-white">send</mat-icon>
        </button>
      </div>
    </div>
  `,
  styles: [
    `
      .container {
        position: absolute;
        left: 150px;
        right: 150px;
        bottom: 40%;
        transition:
          bottom 0.3s ease-in-out,
          left 0.3s ease-in-out,
          right 0.3s ease-in-out;
      }

      .container.has-message {
        left: 20px;
        right: 20px;
        bottom: 20px;
      }

      .input-container {
        background-color: #fff;
        border: 1px solid var(--mat-sys-primary);

        input {
          background-color: inherit;
        }
      }

      .has-message .input-container {
        box-shadow: 0 -10px 20px rgba(0, 0, 0, 0.1) !important;
      }
    `,
  ],
  imports: [MatFormFieldModule, MatInputModule, MatIconModule, MatButtonModule, FormsModule, TranslocoModule],
})
export class ChatbotInputComponent {
  initialState = input<boolean>();
  isLoading = input<boolean>();
  send = output<string>();
  input = '';

  get disabledButton(): boolean {
    return !this.input.trim() || this.isLoading();
  }

  @HostListener('document:keyup.enter')
  handleEnterKey() {
    if (!this.disabledButton) {
      this.sendMessage();
    }
  }

  sendMessage() {
    this.send.emit(this.input);
    this.input = '';
  }
}
