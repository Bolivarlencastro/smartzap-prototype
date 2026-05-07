import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { TranslocoModule } from '@jsverse/transloco';
import { ImageCroppedEvent, ImageCropperComponent } from 'ngx-image-cropper';
import { ImageCropperModel } from './models';

@Component({
  selector: 'kp-image-cropper',
  imports: [
    TranslocoModule,
    ImageCropperComponent,
    MatIconModule,
    MatButtonModule,
    MatDialogModule,
    MatProgressBarModule,
    TranslocoModule,
  ],
  template: `
    <div class="max-w-md">
      <span class="text-xl" mat-dialog-title>{{ 'UI.IMAGE_CROPPER_DIALOG.TITLE' | transloco }}</span>
      <span class="text-lg" mat-dialog-content>{{ 'UI.IMAGE_CROPPER_DIALOG.SUBTITLE' | transloco }}</span>
    </div>
    <div class="max-w-md overflow-y-auto m-3 border relative">
      <image-cropper
        class="object-contain"
        [imageChangedEvent]="imageChangedEvent"
        [aspectRatio]="aspectRatio"
        [maintainAspectRatio]="true"
        [resizeToWidth]="resizeToWidth"
        [resizeToHeight]="resizeToHeight"
        [checkImageType]="false"
        format="png"
        (imageCropped)="imageCropped($event)"
        (cropperReady)="cropperReady()"
      ></image-cropper>

      @if (loading) {
        <mat-progress-bar class="absolute top-0" color="primary" mode="indeterminate"></mat-progress-bar>
      }
    </div>

    <div class="mt-auto flex justify-end items-center p-3 gap-1">
      <button mat-button mat-dialog-close>{{ 'GENERAL.CANCEL' | transloco }}</button>
      <button mat-flat-button color="primary" (click)="saveCroppedImage()">{{ 'GENERAL.SAVE' | transloco }}</button>
    </div>
  `,
  styles: [
    `
      :host {
        display: flex;
        flex-direction: column;
        max-height: 95vh;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KpImageCropperComponent {
  aspectRatio: number;
  imageChangedEvent: Event;
  croppedImage: string;
  loading: boolean;
  resizeToWidth: number;
  resizeToHeight: number;

  constructor(
    private dialogRef: MatDialogRef<KpImageCropperComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ImageCropperModel,
  ) {
    this.init(data);
  }

  init(data: ImageCropperModel): void {
    this.loading = true;
    this.aspectRatio = data.aspectRatio;
    this.imageChangedEvent = data.fileEvent;
    this.resizeToWidth = data.resizeToWidth || 0;
    this.resizeToHeight = data.resizeToHeight || 0;
  }

  imageCropped(event: ImageCroppedEvent): void {
    const objectUrl = event.objectUrl;
    if (this.isValidUrl(objectUrl)) {
      this.croppedImage = objectUrl;
    }
  }

  cropperReady(): void {
    this.loading = false;
  }

  saveCroppedImage(): void {
    this.convertToBlob(this.croppedImage).then((file) => {
      this.dialogRef.close(file);
    });
  }

  private async convertToBlob(url: string): Promise<File> {
    const response = await fetch(url);
    const blob = await response.blob();
    return new File([blob], 'croppedImage.png', { type: 'image/png' });
  }

  private isValidUrl(url: string | null | undefined): boolean {
    return !!url && url.startsWith('blob:');
  }
}
