import { BaseEntity } from './base-entity.model';

export const HTML_LEARN_CONTENT_ID = 'bda0cca5-ac84-4257-8b83-defac7f96738';
export const HOSTED_HTML_LEARN_CONTENT_ID = 'ee9855a5-3a65-4dcb-81b9-ac9f16e01830';

export interface LearnContent extends BaseEntity {
  name: string;
  description?: string;
  url?: string;
  link?: string;
  blog?: string;
  analyzed?: boolean;
  category?: string;
  content_type?: any;
  duration?: number;
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

export interface ContentFile {
  id: string;
  loading: boolean;
  percentage?: number;
}

export function isHtmlLearnContent(learnContentId: string): boolean {
  return learnContentId === HTML_LEARN_CONTENT_ID || learnContentId === HOSTED_HTML_LEARN_CONTENT_ID;
}
