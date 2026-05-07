import { CardTagType } from './learn-content-tag-type';

export type LearnContentCardTag = {
  /**
   * The type of the tag, if defined, the label and color options will be ignored.
   */
  type?: CardTagType;
  label?: string;
  dotColor?: string;
};
