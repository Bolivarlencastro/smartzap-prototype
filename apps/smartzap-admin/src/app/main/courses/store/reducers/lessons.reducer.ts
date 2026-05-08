import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { createReducer, on } from '@ngrx/store';
import { Lesson } from '../../model';
import { LessonsActions } from '../actions';

export const featureKey = 'lessons';

export interface State extends EntityState<Lesson> {
  selectedLesson: number;
  isLoaded: boolean;
  isLoading: boolean;
}

export const adapter: EntityAdapter<Lesson> = createEntityAdapter<Lesson>();

export const initialState: State = adapter.getInitialState({
  selectedLesson: 0,
  isLoaded: false,
  isLoading: false,
});

export const reducer = createReducer(
  initialState,

  on(LessonsActions.clear, (): State => {
    return { ...initialState };
  }),

  on(LessonsActions.loadLessons, (state): State => ({ ...state, isLoading: true, isLoaded: false })),
  on(LessonsActions.setLessons, (state, { payload }): State => adapter.setAll(payload, state)),
  on(
    LessonsActions.loadLessonsSuccess,
    (state, { lessons }): State => adapter.setAll(lessons, { ...state, isLoading: false, isLoaded: true }),
  ),
  on(LessonsActions.loadLessonsFailure, (state): State => ({ ...state, isLoading: false, isLoaded: true })),

  on(
    LessonsActions.createLessonSuccess,
    (state, { payload }): State =>
      adapter.addOne(payload, { ...state, selectedLesson: state.ids.length, isLoaded: true }),
  ),

  on(LessonsActions.deteleLessonSuccess, (state, { id }): State => adapter.removeOne(id, state)),

  on(LessonsActions.editLessonSuccess, (state, { lesson }): State => adapter.updateOne(lesson, state)),

  on(LessonsActions.updateLessonContents, (state, { payload }): State => adapter.updateOne(payload, state)),
);

// get the selectors
export const { selectIds, selectEntities, selectAll, selectTotal } = adapter.getSelectors();
