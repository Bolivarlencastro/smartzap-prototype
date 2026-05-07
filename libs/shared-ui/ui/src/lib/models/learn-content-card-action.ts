export type LearnContentCardActionId =
  | 'continue'
  | 'start'
  | 'enroll'
  | 'request-new-deadline'
  | 'details'
  | 'share'
  | 'add-bookmark'
  | 'remove-bookmark';

export type LearnContentCardAction = {
  id: LearnContentCardActionId;
  label: string;
  icon?: string;
};
