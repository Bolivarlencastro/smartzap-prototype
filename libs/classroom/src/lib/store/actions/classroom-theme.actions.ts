import { createAction, props } from '@ngrx/store';
import { ThemeType } from '../../models';

export const loadTheme = createAction('[Classroom Theme] Load Classroom Theme');

export const setWorkspaceTheme = createAction(
  '[Classroom Theme] Set Workspace Theme',
  props<{ workspaceTheme: ThemeType }>(),
);

export const setClassroomTheme = createAction(
  '[Classroom Theme] Set Classroom Theme',
  props<{ classroomTheme: ThemeType }>(),
);

export const toggleClassroomTheme = createAction('[Classroom Theme] Toggle Classroom Theme');

export const resetConfig = createAction('[Classroom Theme] Reset Config');
