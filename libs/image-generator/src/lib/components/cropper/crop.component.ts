import { ChangeDetectionStrategy, Component, input, output, signal, viewChild } from '@angular/core';
import { ImageCroppedEvent, ImageCropperComponent } from 'ngx-image-cropper';
import { MatDialogClose } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { MatButton, MatIconButton } from '@angular/material/button';
import { TranslocoPipe } from '@jsverse/transloco';
import { MatProgressSpinner } from '@angular/material/progress-spinner';

@Component({
  selector: 'ig-cropper',
  imports: [
    ImageCropperComponent,
    MatDialogClose,
    MatIcon,
    MatIconButton,
    TranslocoPipe,
    MatButton,
    MatProgressSpinner,
  ],
  template: `
    @let displayImage = imageReady();
    <div class="h-16 w-full border-b border-default flex items-center justify-between p-4">
      <span>{{ 'IMAGE_WIZARD.IMAGE_CROPPER.TITLE' | transloco }}</span>
      <button matIconButton mat-dialog-close>
        <mat-icon>close</mat-icon>
      </button>
    </div>

    <div class="p-6 cropper-container grid place-content-center">
      <image-cropper
        [imageFile]="image()"
        [imageURL]="imageUrl()"
        [aspectRatio]="aspectRatio()"
        [maintainAspectRatio]="true"
        [autoCrop]="false"
        [hidden]="!displayImage"
        (imageLoaded)="imageLoaded()"
        (imageCropped)="onImageCropped($event)"
        #cropper
      >
      </image-cropper>
      @if (!displayImage) {
        <mat-spinner class="mx-auto"></mat-spinner>
      }
    </div>

    <div class="flex gap-2 w-full p-2 border-t border-default">
      <button matButton (click)="onBackPressed()">{{ 'IMAGE_WIZARD.BACK' | transloco }}</button>
      <button matButton class="ml-auto" matDialogClose>{{ 'IMAGE_WIZARD.CANCEL' | transloco }}</button>
      <button matButton="filled" [disabled]="!displayImage" (click)="cropImage()">
        {{ 'IMAGE_WIZARD.IMAGE_CROPPER.CROP_IMAGE' | transloco }}
      </button>
    </div>
  `,
  styles: `
    :host {
      display: grid;
      grid-template-columns: 1fr;
      grid-template-rows: auto 1fr auto;
      max-height: 100%;
    }

    .cropper-container {
      max-height: calc(80vh - 121px);
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CropComponent {
  readonly image = input.required<File>();
  readonly imageUrl = input.required<string>();
  readonly imageReady = signal(false);
  readonly aspectRatio = input.required<number>();
  readonly backPressed = output<void>();
  readonly cropConfirmed = output<string>();
  private readonly cropper = viewChild<ImageCropperComponent>('cropper');

  onBackPressed() {
    this.backPressed.emit();
  }

  imageLoaded() {
    this.imageReady.set(true);
  }

  cropImage() {
    this.cropper()?.crop();
  }

  onImageCropped(event: ImageCroppedEvent) {
    if (!event) {
      return;
    }

    this.cropConfirmed.emit(event.objectUrl);
  }
}
