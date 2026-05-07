import { NgClass } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  HostListener,
  inject,
  signal,
  ViewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ReferenceImagePreviewComponent } from '../../components/reference-image-preview/reference-image-preview.component';
import { AiImageUploadService } from '../../services/ai-image-upload.service';
import { ImageWizardService } from '../../services/image-wizard.service';
import { TranslocoPipe } from '@jsverse/transloco';

@Component({
  selector: 'ig-ai-image-generator',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    FormsModule,
    MatInputModule,
    MatMenuModule,
    MatProgressSpinnerModule,
    NgClass,
    MatChipsModule,
    TranslocoPipe,
  ],
  templateUrl: './ai-image-generator.component.html',
  styles: [
    `
      @use '@angular/material' as mat;

      :host {
        @apply flex flex-col h-full w-full;
      }

      .send-message-button {
        background-color: var(--mat-sys-primary);
        color: var(--mat-sys-on-primary);

        &.disabled {
          opacity: 75%;
        }
      }

      .icon-size {
        @apply mb-4 opacity-70;

        font-size: 52px;
        width: 52px;
        height: 52px;
      }

      .spinner {
        @include mat.progress-spinner-overrides(
          (
            active-indicator-color: var(--mat-sys-on-primary),
          )
        );
      }

      .animate-pulse-opacity {
        animation: pulseOpacity 1.5s ease-in-out infinite;
      }

      @keyframes pulseOpacity {
        0% {
          opacity: 0.6;
        }
        50% {
          opacity: 1;
        }
        100% {
          opacity: 0.6;
        }
      }

      .blocked-cursor {
        cursor: no-drop !important;
      }

      .image-container {
        @apply relative h-full w-full flex justify-center items-center;

        .ai-image {
          @apply h-full w-full bg-contain bg-center bg-no-repeat;
          background-color: var(--mat-sys-surface-dim);

          transition: all 0.2s ease-in-out;
        }

        .touch-icon {
          opacity: 0;

          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          color: white;
        }
      }

      .image-container:hover {
        cursor: pointer;

        .ai-image {
          filter: brightness(0.7);
        }

        .touch-icon {
          opacity: 1;
        }
      }
    `,
  ],
})
export class AiImageGeneratorComponent {
  private readonly aiImageService = inject(AiImageUploadService);
  private readonly imageWizard = inject(ImageWizardService);
  protected readonly data = this.aiImageService.data;
  protected readonly loading = this.aiImageService.loading;
  protected readonly referenceImage = this.aiImageService.referenceImage;

  protected readonly referenceImageSrc = signal<string>(null);
  protected readonly message = signal<string>('');
  protected readonly dataUrl = computed(() => `url('${this.data()?.url}')`);

  @ViewChild('fileInput') fileInput: ElementRef<HTMLInputElement>;

  private readonly reader = new FileReader();

  get sendButtonDisabled(): boolean {
    return this.loading() || !this.message().length;
  }

  constructor(private readonly dialog: MatDialog) {
    this.registerReaderLoadListener();
  }

  sendMessage() {
    if (this.sendButtonDisabled) {
      return;
    }

    this.aiImageService.sendMessage(this.message());
  }

  addReferenceImage() {
    this.fileInput.nativeElement.click();
  }

  removeReferenceImage() {
    this.aiImageService.removeReferenceImage();
  }

  fileInputChange() {
    const file = this.fileInput.nativeElement.files?.item(0);
    this.reader.readAsDataURL(file);
    this.aiImageService.addReferenceImage(file);
    this.fileInput.nativeElement.value = null;
  }

  openReferenceImage() {
    if (!this.referenceImageSrc()) {
      return;
    }

    this.dialog.open(ReferenceImagePreviewComponent, {
      data: this.referenceImageSrc(),
      autoFocus: 'dialog',
    });
  }

  imageSelected() {
    this.imageWizard.setImageToCropFromUrl(this.data().url);
    this.imageWizard.setStep('IMAGE_CROP');
  }

  @HostListener('document:keyup.enter')
  handleEnterKey() {
    this.sendMessage();
  }

  private registerReaderLoadListener() {
    this.reader.addEventListener('load', (event) => this.onFileLoad(event));
  }

  private onFileLoad(event: ProgressEvent<FileReader>) {
    this.referenceImageSrc.set(event.target.result as string);
  }
}
