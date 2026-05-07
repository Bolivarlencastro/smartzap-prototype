import { Pipe, PipeTransform } from '@angular/core';

const CNPJ_PATTERN = /(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/;

@Pipe({
  name: 'cnpj',
  standalone: true,
})
export class CnpjPipe implements PipeTransform {
  static formatCNPJ(value: string): string {
    return value.replace(CNPJ_PATTERN, (_, b, c, d, e, f) => {
      return `${b}.${c}.${d}/${e}-${f}`;
    });
  }

  transform(value: unknown): string {
    if (!value || typeof value !== 'string') {
      return '';
    }
    const numericValue = value.replace(/\D/g, '');
    if (numericValue.length !== 14) {
      return value;
    }
    return CnpjPipe.formatCNPJ(value);
  }
}
