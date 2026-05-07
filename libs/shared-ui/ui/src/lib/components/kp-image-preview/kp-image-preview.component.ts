import { ChangeDetectionStrategy, Component, HostBinding, HostListener, input, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { TranslocoModule } from '@jsverse/transloco';

@Component({
  selector: 'kp-image-preview',
  imports: [MatIconModule, TranslocoModule, MatButtonModule],
  template: `
    @if (image()) {
      <div class="overlay">
        <button matButton="tonal" (click)="onOpenDialog()">
          <mat-icon>edit</mat-icon>
          <span>{{ 'UI.IMAGE_PREVIEW.EDIT_IMAGE_BUTTON' | transloco }}</span>
        </button>

        <button matButton class="flex gap-1.5" (click)="onRemove()">
          <mat-icon>delete</mat-icon>
          <span>{{ 'UI.IMAGE_PREVIEW.REMOVE_IMAGE_BUTTON' | transloco }}</span>
        </button>
      </div>
    } @else {
      <mat-icon class="icon-size">image</mat-icon>
      <span class="text-sm font-bold">{{ 'UI.IMAGE_PREVIEW.TITLE' | transloco }}</span>
      <span class="text-xs">{{ 'UI.IMAGE_PREVIEW.DESCRIPTION' | transloco: { value: aspectRatioStr() } }}</span>
    }
  `,
  styles: [
    `
      :host {
        @apply flex flex-col gap-1 items-center justify-center rounded-lg bg-cover bg-center;

        background-color: var(--mat-sys-surface-container-lowest);
        border: 2px dashed var(--mat-sys-outline-variant);

        .overlay {
          @apply flex items-center justify-center gap-1 h-full w-full;

          opacity: 0;
          background-color: rgb(0 0 0 / 75%);
          transition: opacity 0.3s ease-in-out;
        }
      }

      :host:hover {
        .overlay {
          opacity: 1;
        }
      }

      :host(.cursor-pointer) {
        cursor: pointer;
      }

      .icon-size {
        @apply mb-1 opacity-70;

        font-size: 52px;
        width: 52px;
        height: 52px;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KpImagePreviewComponent {
  image = input<string>();
  aspectRatioStr = input<string>();
  openDialog = output<void>();
  remove = output<void>();

  @HostBinding('class.cursor-pointer')
  get shouldShowCursorPointer(): boolean {
    return !this.image();
  }

  @HostBinding('style.background-image')
  get backgroundImage(): string {
    if (!this.image()) {
      return '';
    }

    return `url(${this.image()})`;
  }

  @HostListener('click')
  onHostClick() {
    if (!this.image()) {
      this.onOpenDialog();
    }
  }

  onOpenDialog() {
    this.openDialog.emit();
  }

  onRemove() {
    this.remove.emit();
  }
}
