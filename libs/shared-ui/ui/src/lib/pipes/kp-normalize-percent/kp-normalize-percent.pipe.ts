import { Pipe, PipeTransform } from '@angular/core';
import { PercentPipe } from '@angular/common';

@Pipe({
  name: 'kpNormalizePercent',
  standalone: true,
})
export class KpNormalizePercentPipe extends PercentPipe implements PipeTransform {
  override transform(value: number | string): string | null;
  override transform(value: null | undefined): null;
  override transform(value: number | string | null | undefined): string | null {
    const percentNumber = this.parsePercentNumber(value || 0);
    const percentValue = this.normalizePercent(percentNumber);
    return super.transform(percentValue, '1.0-0');
  }

  private parsePercentNumber(value: string | number): number {
    const percentNumber = Number(value.toString());
    if (isNaN(percentNumber)) {
      return 0;
    }
    return percentNumber;
  }

  private normalizePercent(value: number): number {
    return value > 1 ? 1 : value;
  }
}
