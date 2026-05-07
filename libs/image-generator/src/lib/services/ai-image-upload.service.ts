import { Injectable, signal } from '@angular/core';
import { AiImageModel, ImageGeneratorApi } from '@keeps-platform-frontend-workspace/kp-keeps';
import { finalize, map } from 'rxjs';
import { ImageWizardService } from './image-wizard.service';

@Injectable()
export class AiImageUploadService {
  readonly #data = signal<AiImageModel>(null);
  readonly #loading = signal<boolean>(false);
  readonly #referenceImage = signal<File>(null);

  readonly data = this.#data.asReadonly();
  readonly loading = this.#loading.asReadonly();
  readonly referenceImage = this.#referenceImage.asReadonly();

  constructor(
    private readonly imageGeneratorApi: ImageGeneratorApi,
    private readonly imageWizardService: ImageWizardService,
  ) {}

  sendMessage(prompt: string) {
    this.#loading.set(true);
    const body = this.buildBody(prompt);

    this.imageGeneratorApi
      .generateAiImage(body)
      .pipe(
        finalize(() => this.#loading.set(false)),
        map((res) => res?.images?.[0]),
      )
      .subscribe((image) => this.#data.set(image));
  }

  addReferenceImage(file: File) {
    this.#referenceImage.set(file);
  }

  removeReferenceImage() {
    this.#referenceImage.set(null);
  }

  private buildBody(prompt: string): FormData {
    const aspectRatio = this.imageWizardService.wizardUploadType() === 'COURSE_CARD' ? '9:16' : '21:9';
    const referenceImage = this.referenceImage();

    const formData = new FormData();

    formData.append('prompt', prompt);
    formData.append('num_images', '1');
    formData.append('save_images', 'true');
    formData.append('enhance_prompt', 'true');
    formData.append('aspect_ratio', aspectRatio);

    if (referenceImage) {
      formData.append('reference_image', referenceImage);
    }

    return formData;
  }
}
