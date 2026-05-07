import { ChangeDetectionStrategy, Component, computed, Inject, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CropComponent } from '../../components/cropper/crop.component';
import { ImageUploadComponent } from '../../components/image-upload/image-upload.component';
import { ImageGeneratorDialogData } from '../../models/image-generator-dialog-data';
import { IMAGE_GENERATION_PROVIDERS } from '../../providers';
import { FramesListService } from '../../services/frames-list.service';
import { ImageWizardService } from '../../services/image-wizard.service';
import { AiImageGeneratorComponent } from '../ai-image-generator/ai-image-generator.component';
import { FrameSelectorComponent } from '../frame-selector/frame-selector.component';
import { NavigationMenuComponent } from '../navigation-menu/navigation-menu.component';

@Component({
  selector: 'ig-image-generator',
  providers: IMAGE_GENERATION_PROVIDERS,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    NavigationMenuComponent,
    ImageUploadComponent,
    AiImageGeneratorComponent,
    CropComponent,
    FrameSelectorComponent,
  ],
  template: `
    <div class="wizard-container" [class.hide-side-menu]="!displayNavMenu()">
      @if (displayNavMenu()) {
        <ig-navigation-menu />
      }
      @switch (wizardViewMode()) {
        @case ('FILE_UPLOAD') {
          <ig-image-upload [uploadType]="uploadType()" (goToCrop)="goToCrop($event)" />
        }
        @case ('AI_IMAGE_GEN') {
          <ig-ai-image-generator />
        }
        @case ('IMAGE_CROP') {
          <ig-cropper
            [image]="imageToCrop()"
            [imageUrl]="imageToCropUrl()"
            [aspectRatio]="aspectRatio()"
            (backPressed)="goToImageDefinition()"
            (cropConfirmed)="goToFrameDefinition($event)"
          />
        }
        @case ('FRAME_SELECTION') {
          <ig-frame-selector />
        }
      }
    </div>
  `,
  styles: `
    .wizard-container {
      display: grid;
      min-height: 0;
      grid-template-columns: auto 1fr;
      grid-template-rows: 1fr;
      height: 100%;

      &.hide-side-menu {
        grid-template-columns: 1fr;
      }
    }
  `,
})
export class ImageGeneratorComponent {
  private readonly imageWizard = inject(ImageWizardService);
  private readonly framesListService = inject(FramesListService);
  protected readonly wizardViewMode = this.imageWizard.wizardViewMode;
  protected readonly uploadType = this.imageWizard.wizardUploadType;
  protected readonly imageToCrop = this.imageWizard.imageToCrop;
  protected readonly imageToCropUrl = this.imageWizard.imageToCropUrl;
  protected readonly aspectRatio = this.imageWizard.aspectRatio;
  protected readonly aspectRatioLabel = this.imageWizard.aspectRatioLabel;
  protected readonly displayNavMenu = computed(() => {
    const viewMode = this.wizardViewMode();
    return viewMode !== 'IMAGE_CROP' && viewMode !== 'FRAME_SELECTION';
  });

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: ImageGeneratorDialogData,
    private dialogRef: MatDialogRef<ImageGeneratorComponent>,
  ) {
    this.imageWizard.init(this.data, this.dialogRef);
    this.framesListService.init(this.aspectRatio, this.aspectRatioLabel);
  }

  goToCrop(file: File) {
    this.imageWizard.setImageToCrop(file);
    this.imageWizard.setStep('IMAGE_CROP');
  }

  goToImageDefinition() {
    this.imageWizard.setStep('IMAGE_DEFINITION');
    this.imageWizard.setImageToCrop(null);
    this.imageWizard.setImageToCropFromUrl(null);
  }

  goToFrameDefinition(croppedImage: string) {
    this.imageWizard.setCroppedImage(croppedImage);
    this.imageWizard.setStep('FRAME_SELECTION');
  }
}
