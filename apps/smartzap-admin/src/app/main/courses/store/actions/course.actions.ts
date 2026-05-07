import { createAction, props } from '@ngrx/store';
import { Course } from '../../model';

// Publish
export const publish = createAction('[Course] Publish Course', props<{ id: string }>());
export const startPublish = createAction('[Course] Start Publish Course', props<{ id: string }>());
export const publishSuccess = createAction('[Course] Publish Course Success', props<{ status: string }>());
export const publishFailure = createAction('[Course] Start Course Failure', props<{ error: any }>());

// Load
export const loadCourse = createAction('[Course] Load Course', props<{ id: string }>());
export const loadCourseSuccess = createAction(
  '[Course] Load Course Success',
  props<{ course: Course; isOwner: boolean }>(),
);
export const loadCourseFailure = createAction('[Course] Load Course Failure', props<{ error: any }>());

// Create
export const createCourse = createAction('[Course] Save Course', props<{ course: Course }>());
export const createCourseSuccess = createAction('[Course] Create Course Success', props<{ course: Course }>());
export const createCourseFailure = createAction('[Course] Create Course Failure', props<{ error: any }>());

// Update
export const updateCourse = createAction(
  '[Course] Update Course',
  props<{ id: string; course: Course; nextRoute?: any[] }>(),
);
export const updateCourseSuccess = createAction('[Course] Update Course Success', props<{ course: Course }>());
export const updateCourseFailure = createAction('[Course] Update Course Failure', props<{ error: any }>());

export const updateCourseDescription = createAction('[Course] Update Course Description', props<{ summary: string }>());

export const updateCourseDescriptionSuccess = createAction(
  '[Course] Update Course Description Success',
  props<{ summary: string }>(),
);

export const updateCourseDescriptionFailure = createAction('[Course] Update Course Description Failure');

// Delete
export const deleteCourse = createAction('[Course] Delete Course', props<{ id: string }>());
export const deleteCourseSuccess = createAction('[Course] Delete Course Success', props<{ course_id: string }>());
export const deleteCourseFailure = createAction('[Course] Delete Course Failure', props<{ error: any }>());

export const changeCourseImage = createAction(
  '[Course] Change course image',
  props<{ image: string; imageType: 'holder_image' | 'thumb_image' }>(),
);
export const clearSelectedCourse = createAction('[Course] Clear selected course');

export const setOwner = createAction('[Course] Set Owner Course', props<{ isOwner: boolean }>());
