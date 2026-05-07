import { Observable } from 'rxjs';
import { Action } from '@ngrx/store';
import { SECTION_CONTENT_TYPE } from '../../../models/section-contents-type';
import { LearnContentCardData } from '@keeps-platform-frontend-workspace/ui/kp-learn-content-card';

export interface SectionContentActionStrategy {
  execute(contentType: SECTION_CONTENT_TYPE, item: LearnContentCardData): Observable<Action>;
}
