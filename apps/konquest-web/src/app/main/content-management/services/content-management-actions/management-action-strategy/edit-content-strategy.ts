import { Injectable } from '@angular/core';
import { ManagementActionStrategy } from './management-action.strategy';
import { LearnContentManagementType } from '../../../models/learn-content-list-filter';
import { LearnContentListItem } from '../../../models/learn-content-list-item';
import { Router } from '@angular/router';
import { ContentManagementListActions } from 'app/main/content-management/store/actions';
import { of } from 'rxjs';

@Injectable()
export class EditContentStrategy implements ManagementActionStrategy {
  constructor(private readonly router: Router) {}

  execute(contentType: LearnContentManagementType, item: LearnContentListItem) {
    switch (contentType) {
      case 'events':
        this.redirectToEventsEdition(item.id);
        break;
      case 'courses':
        this.redirectToCourseEdition(item.id);
        break;
      case 'trails':
        this.redirectToTrailEdition(item.id);
        break;
      case 'channels':
        this.redirectToChannelEdition(item.id);
        break;
      default:
        console.warn(`It is not possible to edit ${contentType}.`);
    }

    return of(ContentManagementListActions.executeActionNoopResult());
  }

  private redirectToCourseEdition(courseId: string) {
    this.router.navigate(['/missions/create', courseId]).then();
  }

  private redirectToEventsEdition(eventId: string) {
    this.router.navigate(['/events/create', eventId]).then();
  }

  private redirectToTrailEdition(trailId: string) {
    this.router.navigate(['/learning-trails/create', trailId]).then();
  }

  private redirectToChannelEdition(channelId: string) {
    this.router.navigate(['/', 'channels', 'edit', channelId]).then();
  }
}
