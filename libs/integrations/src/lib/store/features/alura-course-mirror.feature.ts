import { createEntityAdapter, EntityState } from '@ngrx/entity';
import { createFeature, createReducer, createSelector, on } from '@ngrx/store';
import { MirrorCourseDialogViewModel } from '../../models';
import { AluraCourseMirrorActions } from '../actions';
import { AluraCourse, CoursesListFilter } from '@keeps-platform-frontend-workspace/kp-keeps';

export const ALURA_COURSE_MIRROR_FEATURE_NAME = 'aluraCourseMirror';

export interface AluraCourseMirrorFeatureState extends EntityState<AluraCourse> {
  loading: boolean;
  filter: CoursesListFilter;
  totalItems: number;
  categories: string[];
  isFinished: boolean;
}

export const aluraCourseMirrorAdapter = createEntityAdapter<AluraCourse>();

export const aluraCourseMirrorInitialState: AluraCourseMirrorFeatureState = aluraCourseMirrorAdapter.getInitialState({
  loading: false,
  filter: { page: 1, perPage: 50 },
  totalItems: 0,
  categories: null,
  isFinished: false,
});

export const aluraCourseMirrorReducer = createReducer(
  aluraCourseMirrorInitialState,

  on(
    AluraCourseMirrorActions.loadCoursesList,
    (state): AluraCourseMirrorFeatureState =>
      aluraCourseMirrorAdapter.removeAll({
        ...state,
        loading: true,
      }),
  ),

  on(
    AluraCourseMirrorActions.loadCoursesListSuccess,
    (state, { response }): AluraCourseMirrorFeatureState =>
      aluraCourseMirrorAdapter.setAll(response.items, {
        ...state,
        loading: false,
        totalItems: response.total,
        isFinished: !response.hasNextPage,
      }),
  ),

  on(
    AluraCourseMirrorActions.loadMoreCoursesSuccess,
    (state, { response }): AluraCourseMirrorFeatureState =>
      aluraCourseMirrorAdapter.addMany(response.items, {
        ...state,
        loading: false,
        totalItems: response.total,
        isFinished: !response.hasNextPage,
      }),
  ),

  on(
    AluraCourseMirrorActions.setCategories,
    (state, { categories }): AluraCourseMirrorFeatureState => ({ ...state, categories }),
  ),

  on(AluraCourseMirrorActions.filter, (state, { filter }): AluraCourseMirrorFeatureState => {
    return aluraCourseMirrorAdapter.removeAll({ ...state, filter: { ...filter, page: 1 } });
  }),

  on(AluraCourseMirrorActions.loadMoreCourses, (state): AluraCourseMirrorFeatureState => {
    if (state.isFinished) {
      return state;
    }
    const updatedFilter: CoursesListFilter = structuredClone(state.filter);
    updatedFilter.page++;
    return { ...state, filter: updatedFilter, loading: true };
  }),

  on(
    AluraCourseMirrorActions.search,
    (state, { search }): AluraCourseMirrorFeatureState => ({
      ...state,
      filter: { ...state.filter, name: search },
    }),
  ),

  on(AluraCourseMirrorActions.resetState, (): AluraCourseMirrorFeatureState => aluraCourseMirrorInitialState),
);

export const aluraCourseMirrorFeature = createFeature({
  name: ALURA_COURSE_MIRROR_FEATURE_NAME,
  reducer: aluraCourseMirrorReducer,
  extraSelectors: ({ selectAluraCourseMirrorState, selectLoading, selectCategories }) => ({
    selectViewModel: createSelector(
      aluraCourseMirrorAdapter.getSelectors(selectAluraCourseMirrorState).selectAll,
      selectLoading,
      selectCategories,
      (items, loading, categories): MirrorCourseDialogViewModel => ({
        items,
        loading,
        categories,
      }),
    ),
  }),
});
