import { computed, Injectable, ResourceRef, Signal } from '@angular/core';
import { Frame, ImageGeneratorApi } from '@keeps-platform-frontend-workspace/kp-keeps';
import { rxResource } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';

@Injectable()
export class FramesListService {
  private aspectRatio: Signal<number>;
  private framesResource: ResourceRef<Frame[]>;

  get isLoading() {
    return this.framesResource?.isLoading;
  }

  get isError() {
    return computed(() => {
      const error = this.framesResource.error();
      return !!error;
    });
  }

  get frames() {
    return this.framesResource?.value?.asReadonly();
  }

  constructor(private readonly imageGeneratorApi: ImageGeneratorApi) {}

  init(aspectRatio: Signal<number>, aspectRatioLabel: Signal<string>) {
    this.aspectRatio = aspectRatio;
    this.initFramesResource(this.aspectRatio, aspectRatioLabel);
  }

  private initFramesResource(aspectRatio: Signal<number>, aspectRatioLabel: Signal<string>) {
    this.framesResource = rxResource({
      params: () => ({ aspect_ratio: aspectRatio(), aspectRatioLabel: aspectRatioLabel() }),
      stream: ({ params }) =>
        this.imageGeneratorApi
          .fetchFrames(params.aspect_ratio)
          .pipe(map((frames) => frames?.filter((frame) => frame.aspect_ratio === params.aspectRatioLabel))),
    });
  }
}
