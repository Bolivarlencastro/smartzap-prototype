import { Pipe, PipeTransform } from '@angular/core';
import { CardTagType } from '../../models/learn-content-tag-type';

@Pipe({
  name: 'kpTrailStatusTagType',
})
export class KpTrailStatusTagTypePipe implements PipeTransform {
  transform(isActive: boolean): CardTagType {
    return isActive ? 'development-published' : 'development-inactive';
  }
}
