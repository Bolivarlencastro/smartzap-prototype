import { Injectable } from '@angular/core';
import { LearnContentsApi } from '@keeps-platform-frontend-workspace/kp-keeps';

@Injectable({
  providedIn: 'root',
})
export class LearnContentsService {
  constructor(private learnContentApi: LearnContentsApi) {}

  getCoverUrl(image: File, width: number, height: number) {
    return this.learnContentApi.saveCoverWithSize(image, width, height);
  }
}
