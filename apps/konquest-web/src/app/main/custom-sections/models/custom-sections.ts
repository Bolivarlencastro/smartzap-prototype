export interface CustomSectionsViewModel {
  loading: boolean;
  pageType: PageType;
  activeFeatures: CustomSectionsFeature[];
  sectionFilter: LearningObjectTypeModel[];
  sections: CustomSectionModel[];
  emptyListMessage: EmptyListMessageModel;
}

export interface CustomSectionsFeature {
  id: PageType;
  icon: string;
  label: string;
}

export interface LearningObjectTypeModel {
  id: LearningObjectType;
  icon: string;
  label: string;
}

export interface CustomSectionModel {
  id?: string;
  title?: string;
  description?: string;
  filters?: any;
  learning_object_type?: LearningObjectType;
  start_date?: string;
  end_date?: string;
  order?: number;
  icon?: string;
  formattedDate?: string;
  contents?: CustomSectionContentsModel[];
  filters_representations?: FiltersRepresentationsModel[];
}

export interface CustomSectionContentsModel {
  filter_key: string;
  id: string;
  name: string;
  icon: string;
}

export interface FiltersRepresentationsModel {
  filter_key: string;
  filter_value: string;
  value: string;
}

export interface EmptyListMessageModel {
  title: string;
  description: string;
}

export interface DeleteContentModel {
  section: CustomSectionModel;
  content: CustomSectionContentsModel;
}

export type PageType = 'highlights' | 'learning-trails' | 'courses';

export type LearningObjectType =
  | 'HIGHLIGHT.LEARNING_TRAIL'
  | 'HIGHLIGHT.LEARNING_TRAIL.ENROLLED'
  | 'HIGHLIGHT.COURSE'
  | 'HIGHLIGHT.COURSE.ENROLLED'
  | 'HIGHLIGHT.EVENTS'
  | 'HIGHLIGHT.EVENTS.ENROLLED'
  | 'COURSE'
  | 'COURSE.ENROLLED'
  | 'COURSE.ALL'
  | 'LEARNING_TRAIL'
  | 'LEARNING_TRAIL.ENROLLED'
  | 'LEARNING_TRAIL.ALL';

export const SECTION_TYPES_MAP: Record<PageType, LearningObjectTypeModel[]> = {
  highlights: [
    { id: 'HIGHLIGHT.LEARNING_TRAIL', icon: 'route', label: 'CUSTOM_SECTIONS.LIST.FILTER_LABELS.LEARNING_TRAILS' },
    { id: 'HIGHLIGHT.COURSE', icon: 'rocket_launch', label: 'CUSTOM_SECTIONS.LIST.FILTER_LABELS.COURSES' },
    { id: 'HIGHLIGHT.EVENTS', icon: 'event', label: 'CUSTOM_SECTIONS.LIST.FILTER_LABELS.EVENTS' },
    {
      id: 'HIGHLIGHT.LEARNING_TRAIL.ENROLLED',
      icon: 'school',
      label: 'CUSTOM_SECTIONS.LIST.FILTER_LABELS.LEARNING_TRAIL_ENROLLMENTS',
    },
    { id: 'HIGHLIGHT.COURSE.ENROLLED', icon: 'school', label: 'CUSTOM_SECTIONS.LIST.FILTER_LABELS.COURSE_ENROLLMENTS' },
    { id: 'HIGHLIGHT.EVENTS.ENROLLED', icon: 'school', label: 'CUSTOM_SECTIONS.LIST.FILTER_LABELS.EVENT_ENROLLMENTS' },
  ],
  'learning-trails': [
    { id: 'LEARNING_TRAIL', icon: 'route', label: 'CUSTOM_SECTIONS.LIST.FILTER_LABELS.LEARNING_TRAILS' },
    { id: 'LEARNING_TRAIL.ENROLLED', icon: 'school', label: 'CUSTOM_SECTIONS.LIST.FILTER_LABELS.ENROLLMENTS' },
    { id: 'LEARNING_TRAIL.ALL', icon: 'select_all', label: 'CUSTOM_SECTIONS.LIST.FILTER_LABELS.ALL' },
  ],
  courses: [
    { id: 'COURSE', icon: 'rocket_launch', label: 'CUSTOM_SECTIONS.LIST.FILTER_LABELS.COURSES' },
    { id: 'COURSE.ENROLLED', icon: 'school', label: 'CUSTOM_SECTIONS.LIST.FILTER_LABELS.ENROLLMENTS' },
    { id: 'COURSE.ALL', icon: 'select_all', label: 'CUSTOM_SECTIONS.LIST.FILTER_LABELS.ALL' },
  ],
};

export const EMPTY_LIST_MESSAGE_MAP: Record<PageType, EmptyListMessageModel> = {
  highlights: {
    title: 'CUSTOM_SECTIONS.LIST.EMPTY_HIGHLIGHT_LIST_MESSAGE.TITLE',
    description: 'CUSTOM_SECTIONS.LIST.EMPTY_HIGHLIGHT_LIST_MESSAGE.DESCRIPTION',
  },
  'learning-trails': {
    title: 'CUSTOM_SECTIONS.LIST.EMPTY_TRAIL_LIST_MESSAGE.TITLE',
    description: 'CUSTOM_SECTIONS.LIST.EMPTY_TRAIL_LIST_MESSAGE.DESCRIPTION',
  },
  courses: {
    title: 'CUSTOM_SECTIONS.LIST.EMPTY_COURSE_LIST_MESSAGE.TITLE',
    description: 'CUSTOM_SECTIONS.LIST.EMPTY_COURSE_LIST_MESSAGE.DESCRIPTION',
  },
};

export const SECTION_ICON_MAP: Record<LearningObjectType, string> = {
  'HIGHLIGHT.LEARNING_TRAIL': 'route',
  'HIGHLIGHT.LEARNING_TRAIL.ENROLLED': 'school',
  'HIGHLIGHT.COURSE': 'rocket_launch',
  'HIGHLIGHT.COURSE.ENROLLED': 'school',
  'HIGHLIGHT.EVENTS': 'event',
  'HIGHLIGHT.EVENTS.ENROLLED': 'school',
  COURSE: 'rocket_launch',
  'COURSE.ENROLLED': 'school',
  'COURSE.ALL': 'select_all',
  LEARNING_TRAIL: 'route',
  'LEARNING_TRAIL.ENROLLED': 'school',
  'LEARNING_TRAIL.ALL': 'select_all',
};
