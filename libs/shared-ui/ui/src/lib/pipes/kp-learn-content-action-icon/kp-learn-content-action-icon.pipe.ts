import { Pipe, PipeTransform } from '@angular/core';
import { LEARN_CONTENT_ACTION_MAP, LearnContentCardActionId } from '../../models';

@Pipe({
  name: 'kpLearnContentActionIcon',
  standalone: true,
})
export class KpLearnContentActionIconPipe implements PipeTransform {
  transform(actionId: LearnContentCardActionId): string {
    return LEARN_CONTENT_ACTION_MAP[actionId]?.icon || actionId;
  }
}
