import { ChangeDetectionStrategy, Component, ElementRef, computed, model, output, viewChild } from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenu, MatMenuContent, MatMenuTrigger } from '@angular/material/menu';
import 'emoji-picker-element';
import { initEmojiPicker } from '../../utils/emoji-picker.util';

@Component({
  selector: 'app-comment-edit-inline',
  imports: [MatIconButton, MatIconModule, MatMenu, MatMenuContent, MatMenuTrigger],
  template: `
    <div class="edit-inline">
      <textarea class="edit-input" [value]="text()" (input)="text.set($any($event.target).value)"></textarea>
      <div class="edit-actions">
        <span class="char-counter" [class.over-limit]="isOverLimit()">{{ charCount() }}/{{ maxChars }}</span>
        <button mat-icon-button type="button" [matMenuTriggerFor]="editEmojiMenu">
          <mat-icon>sentiment_satisfied</mat-icon>
        </button>
        <button mat-icon-button (click)="editCancel.emit()">
          <mat-icon>close</mat-icon>
        </button>
        <button mat-icon-button [disabled]="isOverLimit()" (click)="confirm.emit()">
          <mat-icon>check</mat-icon>
        </button>
      </div>
    </div>

    <mat-menu #editEmojiMenu="matMenu" class="max-w-96">
      <ng-template matMenuContent>
        <div #editEmojiPickerContainer (click)="$event.stopPropagation()"></div>
      </ng-template>
    </mat-menu>
  `,
  styles: `
    .edit-inline {
      @apply flex flex-col gap-1 mt-0.5;
    }

    .edit-input {
      @apply w-full text-sm resize-none leading-snug py-0.5 min-h-12;

      background: transparent;
      color: var(--mat-sys-on-surface);
      field-sizing: content;

      &:focus {
        outline: none;
        border-bottom-color: var(--mat-sys-primary);
      }
    }

    .edit-actions {
      @apply flex items-center justify-end gap-0.5 h-10;

      button mat-icon {
        font-size: 18px;
        width: 18px;
        height: 18px;
      }
    }

    .char-counter {
      @apply text-xs opacity-60 select-none mr-1;

      color: var(--mat-sys-on-surface-variant);

      &.over-limit {
        @apply opacity-100;

        color: var(--mat-sys-error);
      }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CommentEditInlineComponent {
  text = model<string>('');
  editCancel = output<void>();
  confirm = output<void>();

  readonly maxChars = 500;
  readonly charCount = computed(() => this.text().length);
  readonly isOverLimit = computed(() => this.charCount() > this.maxChars);

  private readonly editEmojiPickerContainer = viewChild<ElementRef<HTMLDivElement>>('editEmojiPickerContainer');

  constructor() {
    initEmojiPicker(this.editEmojiPickerContainer, (emoji) => {
      if (this.charCount() < this.maxChars) {
        this.text.update((t) => t + emoji);
      }
    });
  }
}
