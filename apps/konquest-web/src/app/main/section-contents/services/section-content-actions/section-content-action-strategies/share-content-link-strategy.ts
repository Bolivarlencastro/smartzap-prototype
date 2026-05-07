import { Injectable } from '@angular/core';
import { SectionContentActionStrategy } from './section-content-action.strategy';
import { SECTION_CONTENT_TYPE } from '../../../models/section-contents-type';
import { LearnContentCardData } from '@keeps-platform-frontend-workspace/ui/kp-learn-content-card';
import { Observable, of } from 'rxjs';
import { Action } from '@ngrx/store';
import { KeepsPathLocationStrategy } from '@keeps-platform-frontend-workspace/kp-keeps';
import { Clipboard } from '@angular/cdk/clipboard';
import { KpMessageService } from '@keeps-platform-frontend-workspace/ui/kp-message-service';
import { environment } from 'environments/environment';
import { MISSIONS_DETAIL_PREFIX, TRAILS_DETAIL_PREFIX } from 'app/shared/services';
import { marker } from '@jsverse/transloco-keys-manager/marker';
import { SectionContentItemActions } from '../../../store/actions';

@Injectable()
export class ShareContentLinkStrategy implements SectionContentActionStrategy {
  constructor(
    private readonly location: KeepsPathLocationStrategy,
    private readonly clipboard: Clipboard,
    private readonly messageService: KpMessageService,
  ) {}

  execute(contentType: SECTION_CONTENT_TYPE, item: LearnContentCardData): Observable<Action> {
    const workspaceHash = this.location.getHashFromUrl();
    const url = this.getShareUrl(item.contentId, workspaceHash, contentType);
    this.clipboard.copy(url);
    this.messageService.success(marker('GENERAL.COPIED_TO_CLIPBOARD'));
    return of(SectionContentItemActions.executeActionNoopResult());
  }

  private getShareUrl(itemId: string, workspaceHash: string, contentType: SECTION_CONTENT_TYPE) {
    const contentPrefix = contentType === SECTION_CONTENT_TYPE.COURSES ? MISSIONS_DETAIL_PREFIX : TRAILS_DETAIL_PREFIX;
    return `${environment.apps.konquest.url}${workspaceHash}${contentPrefix}/${itemId}`;
  }
}
