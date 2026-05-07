import { Update } from '@ngrx/entity';
import { createAction, props } from '@ngrx/store';
import { Content, Lesson } from '../../model';
import { KPEditDialogFormData } from 'app/shared/kp-components/kp-edit-dialog';
import { ContentFormData } from '@keeps-platform-frontend-workspace/ui/kp-content-dialog';

// Load
export const loadLessons = createAction('[Lessons] Load Lessons', props<{ course_id: string }>());
export const loadLessonsSuccess = createAction('[Lessons] Load Lessons Success', props<{ lessons: Lesson[] }>());
export const loadLessonsFailure = createAction('[Lessons] Load Lessons Failure', props<{ error: any }>());

// Create
export const createLesson = createAction(
  '[Lesson] Create Lesson',
  props<{ course: string; name: string; order: number }>(),
);
export const createLessonSuccess = createAction('[Lesson] Create Lesson Success', props<{ payload: Lesson }>());
export const createLessonFailure = createAction('[Lesson] Create Lesson Failure', props<{ error: any }>());

// Edit
export const editLesson = createAction('[Lesson] Edit Lesson', props<{ id: string; data: KPEditDialogFormData }>());
export const editLessonSuccess = createAction('[Lesson] Edit Lesson Success', props<{ lesson: Update<Lesson> }>());
export const editLessonFailure = createAction('[Lesson] Edit Lesson Failure', props<{ error: any }>());

// Delete
export const deteleLesson = createAction('[Lesson] Delete Lesson', props<{ id: string }>());
export const deteleLessonSuccess = createAction('[Lesson] Delete Lesson Success', props<{ id: string }>());
export const deteleLessonFailure = createAction('[Lesson] Delete Lesson Failure', props<{ error: any }>());

// List
export const setLessons = createAction('[Lesson] Set Lessons List', props<{ payload: Lesson[] }>());

// Create Content
export const createContent = createAction(
  '[Content] Create Content',
  props<{ lesson_id: string; contentFormData: ContentFormData; messagesContentEmbed: boolean }>(),
);
export const createContentFailure = createAction('[Content] Create Content Failure', props<{ error: any }>());

// Delete Content
export const deleteContent = createAction(
  '[Content] Delete Content',
  props<{ lesson_id: string; content_id: string }>(),
);
export const deleteContentFailure = createAction('[Content] Delete Content Failure', props<{ error: any }>());

// Update Content
export const editContent = createAction(
  '[Content] Edit Content',
  props<{ lesson_id: string; content_id: string; data: KPEditDialogFormData }>(),
);
export const editDispatchIn = createAction(
  '[Content] Edit Content Dispatch In',
  props<{ content_id: string; lesson_id: string; dispatch_in: number }>(),
);
export const editDispatchPeriod = createAction(
  '[Content] Edit Content Dispatch Period',
  props<{ content_id: string; lesson_id: string; dispatch_period: string }>(),
);

export const updateLessonContents = createAction(
  '[Content] Update Lesson Contents',
  props<{ payload: Update<Lesson> }>(),
);
export const editContentFailure = createAction('[Content] Edit Content Failure', props<{ error: any }>());

// Reorder Contents
export const reorderContents = createAction(
  '[Content] Reorder Contents',
  props<{ lesson_id: string; contents: Content[] }>(),
);
export const reorderContentsFailure = createAction('[Content] Reorder Contents Failure', props<{ error: any }>());

// Create Exam
export const createExam = createAction('[Exam] Create Exam', props<{ lesson_id: string; data: any }>());

export const clear = createAction('[Lesson] Clear Lessons');
