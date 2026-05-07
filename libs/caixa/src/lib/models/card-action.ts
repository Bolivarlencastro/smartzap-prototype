export type CardActionId = 'enroll' | 'details' | 'share';

export interface CardAction {
  actionId: CardActionId;
  courseId: string;
}
