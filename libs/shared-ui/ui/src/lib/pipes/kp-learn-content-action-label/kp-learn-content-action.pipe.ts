import { Pipe, PipeTransform } from '@angular/core';
import { LearnContentCardActionId, LEARN_CONTENT_ACTION_MAP } from '../../models';

@Pipe({
  name: 'kpLearnContentActionLabel',
  standalone: true,
})
export class KpLearnContentActionLabelPipe implements PipeTransform {
  transform(actionId: LearnContentCardActionId): string {
    return LEARN_CONTENT_ACTION_MAP[actionId]?.label || actionId;
  }
}
