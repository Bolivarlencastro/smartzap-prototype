import { ImageUploadType } from './image-upload-type';

export const DIMENSIONS_MAP: Record<ImageUploadType, [number, number]> = {
  COURSE_BANNER: [1920, 640],
  COURSE_CARD: [320, 568],
  TRAIL_BANNER: [1920, 640],
  TRAIL_CARD: [1920, 1080],
};
