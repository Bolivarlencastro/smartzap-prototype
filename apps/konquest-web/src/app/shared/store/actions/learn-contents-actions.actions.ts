import { createAction, props } from '@ngrx/store';
import { Enrollment } from '@core/model/enrollment.model';
import { LearnContentActionData } from '@keeps-platform-frontend-workspace/ui/models';
import { LearnContentCardData } from '@keeps-platform-frontend-workspace/ui/kp-learn-content-card';

export const learnContentAction = createAction(
  '[LEARN CONTENT] On Card Action',
  props<{ learnContentAction: LearnContentActionData }>(),
);

export const showDetails = createAction(
  '[LEARN CONTENT] Show Details',
  props<{
    learnContentAction: LearnContentActionData;
  }>(),
);

export const addBookmark = createAction(
  '[LEARN CONTENT] Add Bookmark',
  props<{ learnContentAction: LearnContentActionData }>(),
);

export const addBookmarkSuccess = createAction(
  '[LEARN CONTENT] Add Bookmark Success',
  props<{ learnContent: LearnContentCardData; bookmarkId: string }>(),
);

export const removeBookmark = createAction(
  '[LEARN CONTENT] Remove Bookmark',
  props<{ learnContentAction: LearnContentActionData }>(),
);

export const removeBookmarkSuccess = createAction(
  '[LEARN CONTENT] Remove Bookmark Success',
  props<{ learnContent: LearnContentCardData }>(),
);

export const toggleBookmarkFailure = createAction('[LEARN CONTENT] Toggle Bookmark Failure');

export const share = createAction('[LEARN CONTENT] Share', props<{ learnContentAction: LearnContentActionData }>());

export const requestNewDeadline = createAction(
  '[LEARN CONTENT] Request New Deadline',
  props<{ learnContentAction: LearnContentActionData }>(),
);

export const requestNewDeadlineSuccess = createAction(
  '[LEARN CONTENT] Request New Deadline Success',
  props<{ learnContentAction: LearnContentActionData }>(),
);

export const requestNewDeadlineFailure = createAction('[LEARN CONTENT] Request New Deadline Failure');

export const enroll = createAction('[LEARN CONTENT] Enroll', props<{ learnContentAction: LearnContentActionData }>());

export const enrollSuccess = createAction(
  '[LEARN CONTENT] Enroll Successfully',
  props<{
    learnContentAction: LearnContentActionData;
    enrollment: Enrollment;
  }>(),
);

export const redirectTo = createAction(
  '[LEARN CONTENT] Redirect To',
  props<{
    learnContentAction: LearnContentActionData;
  }>(),
);
