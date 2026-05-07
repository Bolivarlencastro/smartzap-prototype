import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { concatLatestFrom } from '@ngrx/operators';
import { Store } from '@ngrx/store';
import { map, tap } from 'rxjs';
import { ClassroomThemeService } from '../../services';
import { ClassroomThemeActions } from '../actions';
import { classroomThemeFeature } from '../features';

@Injectable()
export class ClassroomThemeEffects {
  init$ = createEffect(() => {
    return this.actions.pipe(
      ofType(ClassroomThemeActions.loadTheme),
      map(() => {
        const workspaceTheme = this.classroomThemeService.getTheme();
        return ClassroomThemeActions.setWorkspaceTheme({ workspaceTheme });
      }),
    );
  });

  updateClassroomThemeFromWorkspace$ = createEffect(() => {
    return this.actions.pipe(
      ofType(ClassroomThemeActions.setWorkspaceTheme),
      map(({ workspaceTheme }) => {
        const classroomTheme = this.classroomThemeService.getClassroomTheme() || workspaceTheme;
        return ClassroomThemeActions.setClassroomTheme({ classroomTheme });
      }),
    );
  });

  setClassroomTheme$ = createEffect(
    () => {
      return this.actions.pipe(
        ofType(ClassroomThemeActions.setClassroomTheme),
        tap(({ classroomTheme }) => this.classroomThemeService.setClassroomTheme(classroomTheme)),
      );
    },
    { dispatch: false },
  );

  toggleClassroomTheme$ = createEffect(() => {
    return this.actions.pipe(
      ofType(ClassroomThemeActions.toggleClassroomTheme),
      concatLatestFrom(() => this.store.select(classroomThemeFeature.selectClassroomTheme)),
      map(([_, theme]) => {
        const classroomTheme = this.classroomThemeService.getThemeOnToggle(theme);
        return ClassroomThemeActions.setClassroomTheme({ classroomTheme });
      }),
    );
  });

  resetThemeConfig$ = createEffect(
    () => {
      return this.actions.pipe(
        ofType(ClassroomThemeActions.resetConfig),
        concatLatestFrom(() => this.store.select(classroomThemeFeature.selectWorkspaceTheme)),
        tap(([_, workspaceTheme]) => this.classroomThemeService.setTheme(workspaceTheme)),
      );
    },
    { dispatch: false },
  );

  constructor(
    private actions: Actions,
    private store: Store,
    private classroomThemeService: ClassroomThemeService,
  ) {}
}
