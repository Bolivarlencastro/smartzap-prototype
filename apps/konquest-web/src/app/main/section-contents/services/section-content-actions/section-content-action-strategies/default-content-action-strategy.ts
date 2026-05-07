import { SectionContentActionStrategy } from './section-content-action.strategy';
import { SECTION_CONTENT_TYPE } from 'app/main/section-contents/models/section-contents-type';
import { LearnContentCardData } from '@keeps-platform-frontend-workspace/ui/kp-learn-content-card';
import { Observable, of } from 'rxjs';
import { Action } from '@ngrx/store';
import { SectionContentItemActions } from 'app/main/section-contents/store/actions';

export class DefaultContentActionStrategy implements SectionContentActionStrategy {
  constructor(private readonly action: unknown) {}

  execute(contentType: SECTION_CONTENT_TYPE, item: LearnContentCardData): Observable<Action> {
    console.warn(`No content action found for action ${this.action}. ContentType: ${contentType}, Item: ${item}`);
    return of(SectionContentItemActions.executeActionNoopResult());
  }
}
