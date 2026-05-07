import { LEARN_CONTENT_LIST_ITEM_ACTION } from './learn-content-list-item-action';
import { LearnContentListItem } from './learn-content-list-item';
import { LearnContentManagementType } from './learn-content-list-filter';

export type LearnContentListItemEvent = {
  action: LEARN_CONTENT_LIST_ITEM_ACTION;
  item: LearnContentListItem;
  contentType: LearnContentManagementType;
  remainingSeats?: number;
};
