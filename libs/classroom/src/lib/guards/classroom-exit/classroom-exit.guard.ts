import { CanDeactivateFn } from '@angular/router';
import { ClassroomFacade } from '../../facades';
import { inject } from '@angular/core';

/**
 * Guard used to clear the classroom state and restore the workspace theme
 * It's needed because in the layout component (from the Fuse Library), when changing into
 * the `empty` layout, the content is destroyed, triggering the onDestroy lifecycle hook in the
 * classroom component right after the course was loaded.
 */
export const classroomExitGuard: CanDeactivateFn<unknown> = () => {
  const classroomFacade = inject<ClassroomFacade>(ClassroomFacade);
  classroomFacade.clearCourse();
  classroomFacade.restoreWorkspaceTheme();
  return true;
};
