import { Pipe, PipeTransform } from '@angular/core';
import { LEARNING_OBJECT_TYPE_ID } from '@keeps-platform-frontend-workspace/kp-keeps';

const LEARNING_OBJECT_TYPE_ICON_MAP = new Map<LEARNING_OBJECT_TYPE_ID, string>([
  [LEARNING_OBJECT_TYPE_ID.TRAIL, 'conversion_path'],
  [LEARNING_OBJECT_TYPE_ID.MISSION, 'rocket_launch'],
]);

@Pipe({ name: 'cycleIcon' })
export class CycleIconPipe implements PipeTransform {
  transform(learningObjectTypeId?: LEARNING_OBJECT_TYPE_ID): string {
    if (!learningObjectTypeId) {
      return '';
    }

    return LEARNING_OBJECT_TYPE_ICON_MAP.get(learningObjectTypeId) || '';
  }
}
