import { computed, Injectable, signal } from '@angular/core';
import { ImageWizardType } from '../models/image-wizard-type';
import { ImageWizardStep } from '../models/image-wizard-step';
import { ImageWizardViewMode } from '../models/image-wizard-view-mode';
import { ImageUploadType } from '../models/image-upload-type';
import { MatDialogRef } from '@angular/material/dialog';
import { ImageGeneratorComponent } from '../containers/image-generator/image-generator.component';
import { ImageGeneratorDialogData } from '../models/image-generator-dialog-data';

@Injectable()
export class ImageWizardService {
  private dialogRef: MatDialogRef<ImageGeneratorComponent>;

  readonly #wizardType = signal<ImageWizardType>('FILE_UPLOAD');
  readonly #wizardStep = signal<ImageWizardStep>('IMAGE_DEFINITION');
  readonly #imageToCrop = signal<File | null>(null);
  readonly #imageToCropUrl = signal<string | null>(null);
  readonly #croppedImage = signal<string | null>(null);
  readonly #wizardUploadType = signal<ImageUploadType>(null);

  readonly wizardType = this.#wizardType.asReadonly();
  readonly wizardStep = this.#wizardStep.asReadonly();
  readonly imageToCrop = this.#imageToCrop.asReadonly();
  readonly imageToCropUrl = this.#imageToCropUrl.asReadonly();
  readonly wizardUploadType = this.#wizardUploadType.asReadonly();
  readonly croppedImage = this.#croppedImage.asReadonly();
  readonly wizardViewMode = computed<ImageWizardViewMode>(() => {
    const wizardType = this.#wizardType();
    const wizardStep = this.#wizardStep();

    if (wizardStep === 'IMAGE_DEFINITION') {
      return wizardType;
    }

    return wizardStep;
  });

  readonly aspectRatio = computed(() => {
    const uploadType = this.#wizardUploadType();
    switch (uploadType) {
      case 'COURSE_CARD':
        return +(9 / 16).toFixed(3);
      case 'TRAIL_CARD':
        return +(16 / 9).toFixed(3);
      case 'COURSE_BANNER':
      case 'TRAIL_BANNER':
        return 3;
      default:
        return 1;
    }
  });

  readonly aspectRatioLabel = computed(() => {
    const uploadType = this.#wizardUploadType();
    switch (uploadType) {
      case 'COURSE_CARD':
        return '9:16';
      case 'COURSE_BANNER':
      case 'TRAIL_BANNER':
      case 'TRAIL_CARD':
        return '3:1';
      default:
        return '1:1';
    }
  });

  setType(newWizardType: ImageWizardType) {
    this.#wizardType.set(newWizardType);
  }

  setStep(newWizardStep: ImageWizardStep) {
    this.#wizardStep.set(newWizardStep);
  }

  init(data: ImageGeneratorDialogData, dialogRef: MatDialogRef<ImageGeneratorComponent>) {
    this.#wizardUploadType.set(data.uploadType);
    this.dialogRef = dialogRef;

    this.verifyReuseGeneratedImage(data.rootImage);
  }

  setImageToCrop(image: File | null) {
    this.#imageToCropUrl.set(null);
    this.#imageToCrop.set(image);
  }

  setImageToCropFromUrl(imageUrl: string) {
    this.#imageToCrop.set(null);
    this.#imageToCropUrl.set(imageUrl);
  }

  setCroppedImage(croppedImage: string | null) {
    this.#croppedImage.set(croppedImage);
  }

  imageDone(file: File) {
    const rootImage = this.imageToCrop() || this.imageToCropUrl();
    this.dialogRef.close({ file, rootImage });
  }

  private verifyReuseGeneratedImage(image: File | string) {
    if (!image) {
      return;
    }

    this.setStep('IMAGE_CROP');

    if (image instanceof File) {
      this.setImageToCrop(image);
      return;
    }

    this.setImageToCropFromUrl(image);
  }
}
