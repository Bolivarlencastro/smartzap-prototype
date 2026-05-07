import { LearningObjectType } from '@app/main/custom-sections/models/custom-sections';
import { SECTION_CONTENT_TYPE } from '@app/main/section-contents/models/section-contents-type';
import { LearnContentCardData } from '@keeps-platform-frontend-workspace/ui/kp-learn-content-card';
import { environment } from 'environments/environment';

export interface ContentType {
  id: HomePageType;
  icon: string;
  label: string;
}

export interface HomeViewModel {
  activateFeatures: ContentType[];
  sections: any[];
  loading: boolean;
}

export interface HomeSection {
  id: string;
  title: string;
  description: string;
  learning_object_type: LearningObjectType;
  contents: LearnContentCardData[];
  sectionContentType: SECTION_CONTENT_TYPE;
}

export interface HomeSectionEmptyState {
  icon: string;
  title: string;
  description: string;
}

export const HIGHLIGHTS_SERVICE_ID = environment.apps.konquest.services.dashboard.id;
export const TRAILS_SERVICE_ID = environment.apps.konquest.services.learning_trail.id;
export const COURSES_SERVICE_ID = environment.apps.konquest.services.mission.id;
export const EVENTS_SERVICE_ID = environment.apps.konquest.services.event.id;

export type HomePageType = 'highlights' | 'learning-trails' | 'courses' | 'events';

export type CardType = 'learning-trails' | 'courses';

export const HOME_SECTIONS_PAYLOAD: Partial<Record<HomePageType, LearningObjectType[]>> = {
  highlights: [
    'HIGHLIGHT.LEARNING_TRAIL',
    'HIGHLIGHT.COURSE',
    'HIGHLIGHT.EVENTS',
    'HIGHLIGHT.LEARNING_TRAIL.ENROLLED',
    'HIGHLIGHT.COURSE.ENROLLED',
    'HIGHLIGHT.EVENTS.ENROLLED',
  ],
  'learning-trails': ['LEARNING_TRAIL', 'LEARNING_TRAIL.ENROLLED', 'LEARNING_TRAIL.ALL'],
  courses: ['COURSE', 'COURSE.ENROLLED', 'COURSE.ALL'],
};

export const RETURN_ROUTE_MAP: Record<LearningObjectType, any> = {
  'HIGHLIGHT.LEARNING_TRAIL': { filter: 'highlights' },
  'HIGHLIGHT.LEARNING_TRAIL.ENROLLED': { filter: 'highlights' },
  'HIGHLIGHT.COURSE': { filter: 'highlights' },
  'HIGHLIGHT.COURSE.ENROLLED': { filter: 'highlights' },
  'HIGHLIGHT.EVENTS': { filter: 'highlights' },
  'HIGHLIGHT.EVENTS.ENROLLED': { filter: 'highlights' },
  COURSE: { filter: 'courses' },
  'COURSE.ENROLLED': { filter: 'courses' },
  'COURSE.ALL': { filter: 'courses' },
  LEARNING_TRAIL: { filter: 'learning-trails' },
  'LEARNING_TRAIL.ENROLLED': { filter: 'learning-trails' },
  'LEARNING_TRAIL.ALL': { filter: 'learning-trails' },
};

export const SECTION_EMPTY_STATE: Record<LearningObjectType, HomeSectionEmptyState> = {
  'HIGHLIGHT.LEARNING_TRAIL': {
    icon: 'route',
    title: 'HOME.EMPTY_STATE.SECTION.LEARNING_TRAIL.TITLE',
    description: 'HOME.EMPTY_STATE.SECTION.LEARNING_TRAIL.DESCRIPTION',
  },
  'HIGHLIGHT.LEARNING_TRAIL.ENROLLED': {
    icon: 'school',
    title: 'HOME.EMPTY_STATE.SECTION.LEARNING_TRAIL_ENROLLED.TITLE',
    description: 'HOME.EMPTY_STATE.SECTION.LEARNING_TRAIL_ENROLLED.DESCRIPTION',
  },
  'HIGHLIGHT.COURSE': {
    icon: 'rocket_launch',
    title: 'HOME.EMPTY_STATE.SECTION.COURSE.TITLE',
    description: 'HOME.EMPTY_STATE.SECTION.COURSE.DESCRIPTION',
  },
  'HIGHLIGHT.COURSE.ENROLLED': {
    icon: 'school',
    title: 'HOME.EMPTY_STATE.SECTION.COURSE_ENROLLED.TITLE',
    description: 'HOME.EMPTY_STATE.SECTION.COURSE_ENROLLED.DESCRIPTION',
  },
  'HIGHLIGHT.EVENTS': {
    icon: 'event',
    title: 'HOME.EMPTY_STATE.SECTION.EVENTS.TITLE',
    description: 'HOME.EMPTY_STATE.SECTION.EVENTS.DESCRIPTION',
  },
  'HIGHLIGHT.EVENTS.ENROLLED': {
    icon: 'school',
    title: 'HOME.EMPTY_STATE.SECTION.EVENTS_ENROLLED.TITLE',
    description: 'HOME.EMPTY_STATE.SECTION.EVENTS_ENROLLED.DESCRIPTION',
  },

  COURSE: {
    icon: 'rocket_launch',
    title: 'HOME.EMPTY_STATE.SECTION.COURSE.TITLE',
    description: 'HOME.EMPTY_STATE.SECTION.COURSE.DESCRIPTION',
  },
  'COURSE.ENROLLED': {
    icon: 'school',
    title: 'HOME.EMPTY_STATE.SECTION.COURSE_ENROLLED.TITLE',
    description: 'HOME.EMPTY_STATE.SECTION.COURSE_ENROLLED.DESCRIPTION',
  },
  'COURSE.ALL': {
    icon: 'rocket_launch',
    title: 'HOME.EMPTY_STATE.SECTION.COURSE_ALL.TITLE',
    description: 'HOME.EMPTY_STATE.SECTION.COURSE_ALL.DESCRIPTION',
  },

  LEARNING_TRAIL: {
    icon: 'route',
    title: 'HOME.EMPTY_STATE.SECTION.LEARNING_TRAIL.TITLE',
    description: 'HOME.EMPTY_STATE.SECTION.LEARNING_TRAIL.DESCRIPTION',
  },
  'LEARNING_TRAIL.ENROLLED': {
    icon: 'school',
    title: 'HOME.EMPTY_STATE.SECTION.LEARNING_TRAIL_ENROLLED.TITLE',
    description: 'HOME.EMPTY_STATE.SECTION.LEARNING_TRAIL_ENROLLED.DESCRIPTION',
  },
  'LEARNING_TRAIL.ALL': {
    icon: 'route',
    title: 'HOME.EMPTY_STATE.SECTION.LEARNING_TRAIL_ALL.TITLE',
    description: 'HOME.EMPTY_STATE.SECTION.LEARNING_TRAIL_ALL.DESCRIPTION',
  },
};
