import { createReducer, on } from '@ngrx/store';
import { Course } from '../../model';
import { CourseActions } from '../actions';
import { CourseReports, Report } from 'app/shared/model';

export const featureKey = 'course';

export interface State {
  course: Course;
  isLoading: boolean;
  isLoaded: boolean;
  isOwner: boolean;
  reportButtons: Report[];
}

export const initialState: State = {
  course: {
    name: '',
    description: '',
    lang: '',
    category_id: '',
    is_active: true,
    content_performance_weight: 5,
    quiz_performance_weight: 5,
    disable_send_certificate: false,
  },
  isLoading: false,
  isLoaded: false,
  isOwner: false,
  reportButtons: CourseReports,
};

export const reducer = createReducer(
  initialState,

  on(CourseActions.clearSelectedCourse, (): State => {
    return { ...initialState };
  }),

  on(CourseActions.setOwner, (state, { isOwner }): State => {
    return { ...state, isOwner };
  }),

  on(CourseActions.changeCourseImage, (state, { image, imageType }): State => {
    const course = { ...state.course, [imageType]: image };
    return { ...state, course };
  }),

  on(CourseActions.createCourse, (state): State => ({ ...state, isLoading: true })),

  on(CourseActions.createCourseSuccess, (state, { course }): State => {
    return { ...state, isLoading: false, course };
  }),

  on(CourseActions.updateCourse, (state, { course }): State => {
    return { ...state, isLoading: true, course };
  }),

  on(CourseActions.updateCourseSuccess, (state, { course }): State => {
    return { ...state, isLoading: false, course };
  }),

  on(CourseActions.updateCourseDescriptionSuccess, (state, { summary }): State => {
    let { course } = state;
    course = { ...course, description: summary };
    return { ...state, course };
  }),

  on(CourseActions.publishSuccess, (state, { status }): State => {
    let { course } = state;
    course = { ...course, status };
    return { ...state, course };
  }),

  on(CourseActions.loadCourse, (state): State => {
    return { ...state, isLoading: true };
  }),

  on(CourseActions.loadCourseSuccess, (state, { course }): State => {
    return { ...state, isLoading: false, isLoaded: true, course };
  }),
  on(CourseActions.loadCourseFailure, (state): State => {
    return { ...state, isLoading: false };
  }),
);
