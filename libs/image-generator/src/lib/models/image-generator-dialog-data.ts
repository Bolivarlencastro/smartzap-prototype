import { ImageUploadType } from './image-upload-type';

export interface ImageGeneratorDialogData {
  uploadType: ImageUploadType;
  rootImage: File | string;
}
