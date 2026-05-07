import { Provider } from '@angular/core';
import { SectionContentActionsService } from './section-content-actions.service';
import { AccessCourseContentStrategy } from './section-content-action-strategies/access-course-content-strategy';
import { EditContentStrategy } from './section-content-action-strategies/edit-content-strategy';
import { EnrollToCourseContentStrategy } from './section-content-action-strategies/enroll-to-course-content-strategy';
import { OpenContentDetailsStrategy } from './section-content-action-strategies/open-content-details-strategy';
import { ShareContentLinkStrategy } from './section-content-action-strategies/share-content-link-strategy';
import { ToggleBookmarkStrategy } from './section-content-action-strategies/toggle-bookmark-strategy';
import { ViewAsUserStrategy } from './section-content-action-strategies/view-as-user-strategy';
import { RequestNewDeadlineStrategy } from './section-content-action-strategies/request-new-deadline-strategy';

export const SECTION_CONTENT_ACTIONS_PROVIDERS: Provider[] = [
  SectionContentActionsService,

  AccessCourseContentStrategy,
  EditContentStrategy,
  EnrollToCourseContentStrategy,
  OpenContentDetailsStrategy,
  ShareContentLinkStrategy,
  ToggleBookmarkStrategy,
  ViewAsUserStrategy,
  RequestNewDeadlineStrategy,

  { provide: 'continue', useExisting: AccessCourseContentStrategy },
  { provide: 'start', useExisting: AccessCourseContentStrategy },
  { provide: 'edit', useExisting: EditContentStrategy },
  { provide: 'enroll', useExisting: EnrollToCourseContentStrategy },
  { provide: 'details', useExisting: OpenContentDetailsStrategy },
  { provide: 'share', useExisting: ShareContentLinkStrategy },
  { provide: 'add-bookmark', useExisting: ToggleBookmarkStrategy },
  { provide: 'remove-bookmark', useExisting: ToggleBookmarkStrategy },
  { provide: 'view-as-user', useExisting: ViewAsUserStrategy },
  { provide: 'request-new-deadline', useExisting: RequestNewDeadlineStrategy },
];
