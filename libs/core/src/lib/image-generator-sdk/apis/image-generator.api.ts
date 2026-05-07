import { Injectable } from '@angular/core';
import { Frame, GenerateAiImageResponse } from '../models';
import { ImageGeneratorClient } from './image-generator.client';

@Injectable({
  providedIn: 'root',
})
export class ImageGeneratorApi {
  constructor(private http: ImageGeneratorClient) {}

  fetchFrames(aspect_ratio: number) {
    return this.http.get<Frame[]>('/frames', { aspect_ratio });
  }

  generateAiImage(body: FormData) {
    return this.http.postFormData<GenerateAiImageResponse>('/ai-images/generate', body);
  }
}
