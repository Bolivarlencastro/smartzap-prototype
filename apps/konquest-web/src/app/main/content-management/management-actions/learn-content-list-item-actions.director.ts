import { LearnContentListItemActionsBuilder } from './learn-content-list-item-actions.builder';
import { LearnContentListItem } from '../models/learn-content-list-item';

export interface LearnContentListItemActionsDirector {
  construct(builder: LearnContentListItemActionsBuilder, content: LearnContentListItem): void;
}
