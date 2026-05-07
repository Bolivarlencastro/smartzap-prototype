import { getTranslocoScope } from './transloco-scope.factory';
import { ImageWizardService } from './services/image-wizard.service';
import { AiImageUploadService } from './services/ai-image-upload.service';
import { FramesListService } from './services/frames-list.service';

export const IMAGE_GENERATION_PROVIDERS = [
  getTranslocoScope(),
  ImageWizardService,
  AiImageUploadService,
  FramesListService,
];
