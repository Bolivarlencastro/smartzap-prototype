import { LearnContentCardData } from '../components/kp-learn-content-card';
import { LearnContentCardActionId } from './learn-content-card-action';

export type LearnContentActionContentType = 'mission' | 'trail';

export type LearnContentActionData = {
  learnContent: LearnContentCardData;
  contentType: LearnContentActionContentType;
  action: LearnContentCardActionId;
};
