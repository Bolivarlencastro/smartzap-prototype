import { Pipe, PipeTransform } from '@angular/core';
import { format, isValidNumber, ParsedNumber, parseNumber } from 'libphonenumber-js';

@Pipe({
  name: 'kpPhone',
  standalone: true,
})
export class KpPhonePipe implements PipeTransform {
  static formatInternationalPhone(phone: string): string {
    const parsedPhone = parseNumber(phone) as ParsedNumber;
    if (!isValidNumber(parsedPhone)) {
      return phone;
    }
    return format(parsedPhone, 'INTERNATIONAL');
  }

  static formatBrazilianPhone(phone: string): string {
    const parsedPhone = parseNumber(phone, 'BR') as ParsedNumber;
    if (!isValidNumber(parsedPhone)) {
      return phone;
    }

    return format(parsedPhone, 'NATIONAL');
  }

  static isBrazilianPhone(phone: string): boolean {
    return phone.trim().replace('+', '').startsWith('55');
  }

  transform(value?: string) {
    if (!value?.length) {
      return value;
    }
    if (KpPhonePipe.isBrazilianPhone(value)) {
      return KpPhonePipe.formatBrazilianPhone(value);
    }

    const phone = value.startsWith('+') ? value : `+${value}`;

    return KpPhonePipe.formatInternationalPhone(phone);
  }
}
