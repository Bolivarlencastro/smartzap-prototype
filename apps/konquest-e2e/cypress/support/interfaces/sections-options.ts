export interface SectionOptions {
  option: 'course' | 'learning-trail' | 'events' | 'trail-enrolled' | 'course-enrolled' | 'events-enrolled' | 'all';
  temporary?: boolean;
  name: string;
  description: string;
}

export interface SectionCreatedOptions {
  name: string;
  description: string;
  learningObject?: string;
}

export interface SectionContentOptions {
  option?: 'category';
  learningObject: string;
}
