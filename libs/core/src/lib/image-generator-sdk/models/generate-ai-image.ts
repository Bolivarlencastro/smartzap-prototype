export interface GenerateAiImageBody {
  prompt?: string;
  reference_image?: unknown;
  reference_image_format?: string;
  aspect_ratio?: string;
  num_images?: number;
  save_images?: boolean;
  enhance_prompt?: boolean;
}

export interface GenerateAiImageResponse {
  images: AiImageModel[];
  total_generated: number;
}

export interface AiImageModel {
  id: string;
  url: string;
}
