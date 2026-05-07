import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'deepCopyPlotlyData',
})
export class DeepCopyPlotlyDataPipe implements PipeTransform {
  transform(value: any): any {
    if (!value) {
      return null;
    }

    return JSON.parse(JSON.stringify(value));
  }
}
