import { Injectable } from '@angular/core';
import { MissionServiceV2 } from 'app/main/mission/services/mission.service';
import { SectionContentActionStrategy } from './section-content-action.strategy';
import { SECTION_CONTENT_TYPE } from '@app/main/section-contents/models/section-contents-type';
import { LearnContentCardData } from '@keeps-platform-frontend-workspace/ui/kp-learn-content-card';
import { Action } from '@ngrx/store';
import { catchError, map, Observable, of } from 'rxjs';
import { SectionContentItemActions } from 'app/main/section-contents/store/actions';
import { KpMessageService } from '@keeps-platform-frontend-workspace/ui/kp-message-service';
import { tap } from 'rxjs/operators';
import { marker } from '@jsverse/transloco-keys-manager/marker';

@Injectable()
export class ToggleBookmarkStrategy implements SectionContentActionStrategy {
  constructor(
    private missionService: MissionServiceV2,
    private messageService: KpMessageService,
  ) {}

  execute(contentType: SECTION_CONTENT_TYPE, item: LearnContentCardData): Observable<Action> {
    if (contentType !== SECTION_CONTENT_TYPE.COURSES && contentType !== SECTION_CONTENT_TYPE.EVENTS) {
      console.warn(`It is not possible to toggle bookmark for ${contentType}.`);
      return of(SectionContentItemActions.executeActionNoopResult());
    }

    if (item.bookmarkId) {
      return this.removeBookmark(item);
    }

    return this.addBookmark(item);
  }

  private addBookmark(item: LearnContentCardData) {
    return this.missionService.bookmark(item.contentId).pipe(
      tap({
        next: () => this.messageService.success(marker('MISSION.BOOKMARK_ADDED')),
        error: () => this.messageService.error(marker('MISSION.THIS_ACTION_COULD_NOT_BE_PERFORMED')),
      }),
      map(({ id }) => this.createResultingAction(item.contentId, id)),
      catchError((error) => of(SectionContentItemActions.executeActionErrorResult({ error }))),
    );
  }

  private removeBookmark(item: LearnContentCardData) {
    return this.missionService.removeBookmark(item.bookmarkId).pipe(
      tap({
        next: () => this.messageService.success(marker('MISSION.BOOKMARK_REMOVED')),
        error: () => this.messageService.error(marker(marker('MISSION.BOOKMARK_REMOVED_ERROR'))),
      }),
      map(() => this.createResultingAction(item.contentId, undefined)),
      catchError((error) => of(SectionContentItemActions.executeActionErrorResult({ error }))),
    );
  }

  private createResultingAction(itemId: string, newBookmarkId: string) {
    return SectionContentItemActions.updateItemActionResult({
      update: { id: itemId, changes: { bookmarkId: newBookmarkId } },
    });
  }
}
