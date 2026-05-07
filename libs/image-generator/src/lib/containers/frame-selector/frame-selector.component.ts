import { NgClass } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  inject,
  Signal,
  signal,
  viewChild,
} from '@angular/core';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatDialogClose } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { TranslocoPipe } from '@jsverse/transloco';
import { Frame } from '@keeps-platform-frontend-workspace/kp-keeps';
import { FrameOptionsComponent } from '../../components/frame-options/frame-options.component';
import { DIMENSIONS_MAP } from '../../models/image-proportion';
import { ImageUploadType } from '../../models/image-upload-type';
import { FramesListService } from '../../services/frames-list.service';
import { ImageWizardService } from '../../services/image-wizard.service';

@Component({
  selector: 'ig-frame-selector',
  imports: [
    MatDialogClose,
    MatIcon,
    MatIconButton,
    TranslocoPipe,
    MatButton,
    NgClass,
    FrameOptionsComponent,
    MatProgressSpinner,
  ],
  template: `
    <div class="h-16 w-full border-b border-default flex items-center justify-between p-4 col-span-2">
      <span>{{ 'IMAGE_WIZARD.FRAME_SELECTOR.TITLE' | transloco }}</span>
      <button matIconButton mat-dialog-close>
        <mat-icon>close</mat-icon>
      </button>
    </div>

    @if (isError() || isLoading()) {
      <div class="grid h-full w-full place-content-center">
        <mat-spinner></mat-spinner>
      </div>
    } @else {
      <ig-frame-options
        class="overflow-y-auto"
        [frameOptions]="frames()"
        (frameSelected)="frameSelected($event)"
      ></ig-frame-options>
    }

    <div class="flex flex-1 p-6 min-h-0 items-center justify-center">
      <div
        class="relative shadow-lg rounded-md overflow-hidden"
        [ngClass]="imageContainerClass()"
        [style.aspect-ratio]="aspectRatio()"
      >
        <img class="object-cover w-full h-full" [src]="croppedImage()" alt="Preview" />
        @let frameSrc = selectedFrame();
        @if (frameSrc) {
          <div class="absolute inset-0 pointer-events-none">
            <img class="w-full h-full" [src]="frameSrc" alt="Frame" />
          </div>
        }
        <canvas hidden #frameCanvas></canvas>
      </div>
    </div>

    <div class="flex gap-2 w-full p-2 border-t border-default col-span-2">
      <button matButton (click)="onBackPressed()">{{ 'IMAGE_WIZARD.BACK' | transloco }}</button>
      <button matButton class="ml-auto" matDialogClose>{{ 'IMAGE_WIZARD.CANCEL' | transloco }}</button>
      <button matButton="filled" (click)="applyFrame()" [disabled]="isGeneratingImage()">
        {{ 'IMAGE_WIZARD.FRAME_SELECTOR.APPLY' | transloco }}
      </button>
    </div>
  `,
  styles: `
    :host {
      display: grid;
      max-height: 80vh;
      grid-template-columns: 240px 1fr;
      grid-template-rows: auto 1fr auto;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FrameSelectorComponent {
  private readonly imageWizard = inject(ImageWizardService);
  private readonly framesService = inject(FramesListService);
  readonly isGeneratingImage = signal(false);

  readonly croppedImage: Signal<string>;
  readonly aspectRatio: Signal<number>;
  readonly uploadType: Signal<ImageUploadType>;
  readonly frames: Signal<Frame[]>;
  readonly isLoading: Signal<boolean>;
  readonly isError: Signal<boolean>;
  readonly selectedFrame = signal<string>('');

  constructor() {
    this.croppedImage = this.imageWizard.croppedImage;
    this.aspectRatio = this.imageWizard.aspectRatio;
    this.uploadType = this.imageWizard.wizardUploadType;
    this.frames = this.framesService.frames;
    this.isLoading = this.framesService.isLoading;
    this.isError = this.framesService.isError;
  }

  private readonly canvas = viewChild<ElementRef<HTMLCanvasElement>>('frameCanvas');
  protected readonly imageContainerClass = computed(() => {
    const aspectRatio = this.aspectRatio();
    if (aspectRatio > 1) {
      return 'h-auto w-full';
    }

    return 'h-full w-auto';
  });

  onBackPressed() {
    this.imageWizard.setStep('IMAGE_CROP');
  }

  async applyFrame(): Promise<void> {
    const canvas = this.canvas()?.nativeElement;
    const ctx = canvas?.getContext('2d');

    if (!ctx) {
      return;
    }

    this.isGeneratingImage.set(true);
    const background = new Image();
    const frame = new Image();
    background.crossOrigin = 'anonymous';
    frame.crossOrigin = 'anonymous';

    background.src = this.croppedImage();
    const hasFrame = !!this.selectedFrame();
    if (hasFrame) {
      frame.src = this.selectedFrame();
    }

    const imagePromises = [new Promise((res) => (background.onload = res))];
    if (hasFrame) {
      imagePromises.push(new Promise((res) => (frame.onload = res)));
    }

    // Wait for both images to load
    await Promise.all(imagePromises);

    // Image final dimensions
    const [width, height] = DIMENSIONS_MAP[this.uploadType()];
    canvas.width = width;
    canvas.height = height;

    ctx.drawImage(background, 0, 0, width, height);
    if (hasFrame) {
      ctx.drawImage(frame, 0, 0, width, height);
    }

    canvas?.toBlob(
      (blob) => {
        if (!blob) {
          return;
        }

        const file = new File([blob], 'image.jpg', { type: 'image/jpeg' });
        this.fileDone(file);
      },
      'image/jpeg',
      0.9,
    );
  }

  frameSelected(frameSrc: string) {
    this.selectedFrame.set(frameSrc);
  }

  private fileDone(file: File) {
    this.imageWizard.imageDone(file);
  }
}
