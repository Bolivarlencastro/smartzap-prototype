import { createSelector } from '@ngrx/store';
import { selectCoursesFeatureState, CoursesState } from '../reducers';
import * as fromLessons from '../reducers/lessons.reducer';
import { Content } from '../../model';

export const selectLessonsState = createSelector(selectCoursesFeatureState, (state: CoursesState) => state.lessons);

export const selectAllLessons = createSelector(selectLessonsState, fromLessons.selectAll);
export const selectLessonsLoaded = createSelector(selectLessonsState, (state) => state.isLoaded);

export const selectLessonsEntity = createSelector(selectLessonsState, fromLessons.selectEntities);

export const selectGetSelectedLesson = createSelector(selectLessonsState, (state) => state.selectedLesson);

export const selectDefaultLesson = createSelector(selectAllLessons, (lessons) => lessons[0] ?? null);

export const selectDefaultLessonId = createSelector(selectDefaultLesson, (lesson) => lesson?.id ?? null);

export const selectDefaultLessonContents = createSelector(selectDefaultLesson, (lesson) => lesson?.contents ?? []);

export const selectIsContentsFormCompleted = createSelector(
  selectDefaultLessonContents,
  (contents) => contents.length > 0,
);

export const selectLessonsContents = createSelector(selectAllLessons, (lessons) =>
  lessons.reduce((acc: Content[], value) => {
    acc.push(...value.contents);
    return acc;
  }, []),
);

export const selectLessonsContentsToObject = createSelector(selectAllLessons, (lessons) =>
  lessons
    .map((lesson) => lesson.contents)
    .reduce((acc, cur) => acc.concat(cur), [])
    .map((content) => content.type?.name)
    .reduce((acc: Record<string, any>, name) => {
      if (name) {
        if (!acc[name]) {
          acc[name] = 1;
          return acc;
        }

        acc[name] = acc[name] + 1;
        return acc;
      }
      return acc;
    }, {}),
);
