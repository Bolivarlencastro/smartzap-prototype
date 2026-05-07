import { LearnContentType } from './learn-content';

export interface ContentFormData {
  type: LearnContentType;
  name: string;
  value: any;
  description?: string;
  coverImage?: string;
  time?: number;
}
