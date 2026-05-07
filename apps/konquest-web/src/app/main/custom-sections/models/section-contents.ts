import { LearningObjectType } from './custom-sections';

export interface ContentModel {
  id: string;
  name: string;
}

export type ContentTabType = 'category' | 'learning-object';

export interface ContentTab {
  label: string;
  value: ContentTabType;
}

export const CONTENT_FILTER_MAP: Partial<Record<LearningObjectType, any>> = {
  'HIGHLIGHT.LEARNING_TRAIL': { dataType: 'trails' },
  'HIGHLIGHT.COURSE': { dataType: 'courses', mission_model: ['INTERNAL', 'EXTERNAL_PROVIDER', 'SCORM'] },
  'HIGHLIGHT.EVENTS': { dataType: 'courses', mission_model: ['LIVE', 'PRESENTIAL'] },
  COURSE: { dataType: 'courses', mission_model: ['INTERNAL', 'EXTERNAL_PROVIDER', 'SCORM'] },
  LEARNING_TRAIL: { dataType: 'trails' },
};

export const CONTENT_TABS_MAP: Partial<Record<LearningObjectType, ContentTab[]>> = {
  'HIGHLIGHT.LEARNING_TRAIL': [{ label: 'CUSTOM_SECTIONS.CONTENT_TABS.TRAILS', value: 'learning-object' }],
  'HIGHLIGHT.COURSE': [
    { label: 'CUSTOM_SECTIONS.CONTENT_TABS.COURSES', value: 'learning-object' },
    { label: 'CUSTOM_SECTIONS.CONTENT_TABS.CATEGORIES', value: 'category' },
  ],
  'HIGHLIGHT.EVENTS': [
    { label: 'CUSTOM_SECTIONS.CONTENT_TABS.EVENTS', value: 'learning-object' },
    { label: 'CUSTOM_SECTIONS.CONTENT_TABS.CATEGORIES', value: 'category' },
  ],
  COURSE: [
    { label: 'CUSTOM_SECTIONS.CONTENT_TABS.COURSES', value: 'learning-object' },
    { label: 'CUSTOM_SECTIONS.CONTENT_TABS.CATEGORIES', value: 'category' },
  ],
  LEARNING_TRAIL: [{ label: 'CUSTOM_SECTIONS.CONTENT_TABS.TRAILS', value: 'learning-object' }],
};
