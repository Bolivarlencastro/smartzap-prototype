import { Pipe, PipeTransform } from '@angular/core';

const CEP_PATTERN = /(\d{5})(\d{3})/;

@Pipe({
  name: 'zipCode',
  standalone: true,
})
export class ZipCodePipe implements PipeTransform {
  static formatZipCode(value: string): string {
    return value.replace(CEP_PATTERN, (_, b, c) => {
      return `${b}-${c}`;
    });
  }

  transform(value: unknown): unknown {
    if (!value || typeof value !== 'string') {
      return value;
    }
    const numericValue = value.replace(/\D/g, '');
    if (numericValue.length !== 8) {
      return value;
    }
    return ZipCodePipe.formatZipCode(value);
  }
}
