import { Provider } from '@angular/core';
import { DeleteContentStrategy } from './management-action-strategy/delete-content-strategy';
import { DuplicateContentStrategy } from './management-action-strategy/duplicate-content-strategy';
import { EditContentStrategy } from './management-action-strategy/edit-content-strategy';
import { EditContributorsStrategy } from './management-action-strategy/edit-contributors-strategy';
import { EnrollUsersStrategy } from './management-action-strategy/enroll-users-strategy';
import { FinishEventStrategy } from './management-action-strategy/finish-event-strategy';
import { ShareContentStrategy } from './management-action-strategy/share-content-strategy';
import { TransferContentStrategy } from './management-action-strategy/transfer-content-strategy';
import { ViewAsUserStrategy } from './management-action-strategy/view-as-user-strategy';
import { ViewEvaluationsStrategy } from './management-action-strategy/view-evaluations-strategy';
import { ViewStatisticsStrategy } from './management-action-strategy/view-statistics-strategy';
import { VinculateToGroupStrategy } from './management-action-strategy/vinculate-to-group-strategy';
import { ContentManagementActionsService } from './content-management-actions.service';
import { LEARN_CONTENT_LIST_ITEM_ACTION } from 'app/main/content-management/models/learn-content-list-item-action';
import { PublishContentStrategy } from './management-action-strategy/publish-content-strategy';
import { ViewDetailsStrategy } from './management-action-strategy/view-details-strategy';
import { ManageEnrollmentsStrategy } from './management-action-strategy/manage-enrollments-strategy';
import { ManagePulsesStrategy } from './management-action-strategy/manage-pulses-strategy';

export const MANAGEMENT_ACTIONS_PROVIDERS: Provider[] = [
  ContentManagementActionsService,

  DeleteContentStrategy,
  DuplicateContentStrategy,
  EditContentStrategy,
  EditContributorsStrategy,
  EnrollUsersStrategy,
  FinishEventStrategy,
  ShareContentStrategy,
  TransferContentStrategy,
  ViewAsUserStrategy,
  ViewEvaluationsStrategy,
  ViewStatisticsStrategy,
  VinculateToGroupStrategy,
  PublishContentStrategy,
  ViewDetailsStrategy,
  ManageEnrollmentsStrategy,
  ManagePulsesStrategy,

  { provide: LEARN_CONTENT_LIST_ITEM_ACTION.DELETE, useExisting: DeleteContentStrategy },
  { provide: LEARN_CONTENT_LIST_ITEM_ACTION.DUPLICATE, useExisting: DuplicateContentStrategy },
  { provide: LEARN_CONTENT_LIST_ITEM_ACTION.EDIT, useExisting: EditContentStrategy },
  { provide: LEARN_CONTENT_LIST_ITEM_ACTION.EDIT_CONTRIBUTORS, useExisting: EditContributorsStrategy },
  { provide: LEARN_CONTENT_LIST_ITEM_ACTION.ENROLL_USERS, useExisting: EnrollUsersStrategy },
  { provide: LEARN_CONTENT_LIST_ITEM_ACTION.FINISH_EVENT, useExisting: FinishEventStrategy },
  { provide: LEARN_CONTENT_LIST_ITEM_ACTION.SHARE, useExisting: ShareContentStrategy },
  { provide: LEARN_CONTENT_LIST_ITEM_ACTION.TRANSFER, useExisting: TransferContentStrategy },
  { provide: LEARN_CONTENT_LIST_ITEM_ACTION.VIEW_AS_USER, useExisting: ViewAsUserStrategy },
  { provide: LEARN_CONTENT_LIST_ITEM_ACTION.VIEW_EVALUATIONS, useExisting: ViewEvaluationsStrategy },
  { provide: LEARN_CONTENT_LIST_ITEM_ACTION.VIEW_STATISTICS, useExisting: ViewStatisticsStrategy },
  { provide: LEARN_CONTENT_LIST_ITEM_ACTION.VINCULATE_TO_GROUP, useExisting: VinculateToGroupStrategy },
  { provide: LEARN_CONTENT_LIST_ITEM_ACTION.PUBLISH, useExisting: PublishContentStrategy },
  { provide: LEARN_CONTENT_LIST_ITEM_ACTION.DETAILS, useExisting: ViewDetailsStrategy },
  { provide: LEARN_CONTENT_LIST_ITEM_ACTION.MANAGE_ENROLLMENTS, useExisting: ManageEnrollmentsStrategy },
  { provide: LEARN_CONTENT_LIST_ITEM_ACTION.MANAGE_PULSES, useExisting: ManagePulsesStrategy },
];
