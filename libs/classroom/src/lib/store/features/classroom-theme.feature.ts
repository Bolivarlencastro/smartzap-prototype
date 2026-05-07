import { createFeature, createReducer, createSelector, on } from '@ngrx/store';
import { ThemeType } from '../../models/classroom-theme';
import { ClassroomThemeActions } from '../actions';

export const classroomThemeFeatureKey = 'classroomTheme';

export interface ClassroomThemeFeatureState {
  workspaceTheme: ThemeType;
  classroomTheme: ThemeType;
}

export const classroomThemeInitialState: ClassroomThemeFeatureState = {
  workspaceTheme: null,
  classroomTheme: null,
};

export const classroomThemeReducer = createReducer(
  classroomThemeInitialState,

  on(
    ClassroomThemeActions.setWorkspaceTheme,
    (state, { workspaceTheme }): ClassroomThemeFeatureState => ({ ...state, workspaceTheme }),
  ),

  on(
    ClassroomThemeActions.setClassroomTheme,
    (state, { classroomTheme }): ClassroomThemeFeatureState => ({ ...state, classroomTheme }),
  ),
);

export const classroomThemeFeature = createFeature({
  name: classroomThemeFeatureKey,
  reducer: classroomThemeReducer,
  extraSelectors: ({ selectClassroomTheme }) => ({
    selectThemeIcon: createSelector(selectClassroomTheme, (classroomTheme) =>
      classroomTheme === 'light' ? 'dark_mode' : 'light_mode',
    ),
  }),
});
