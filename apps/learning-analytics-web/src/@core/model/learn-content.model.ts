import { BaseEntity } from './base-entity.model';

export declare type LearnContentType = 'LINK' | 'BLOG' | 'FILE' | 'QUIZ';

export interface LearnContentFormData {
  name: string;
  value: any;
  description: string;
}

export interface LearnContent extends BaseEntity {
  name: string;
  description?: string;
  url?: string;
  link?: string;
  blog?: string;
  analyzed?: boolean;
  category?: string;
  content_type?: string;
}

export interface ContentType extends BaseEntity {
  name: string;
  description: string;
  image: string;
  image_cover: string;
  extensions: string;
}

export enum EmbedContentType {
  Podcast = 'Podcast',
  Video = 'Video',
  Image = 'Image',
  PDF = 'PDF',
  Text = 'Text',
  Presentation = 'Presentation',
  Spreadsheet = 'Spreadsheet',
  Blog = 'Blog',
  Question = 'Question',
}
