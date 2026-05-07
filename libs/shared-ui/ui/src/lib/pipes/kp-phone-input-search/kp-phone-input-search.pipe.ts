import { Pipe, PipeTransform } from '@angular/core';
import { Country } from '../../components/kp-phone-input/model/country.model';

@Pipe({
  name: 'phoneInputSearch',
  standalone: true,
})
export class KpPhoneInputSearchPipe implements PipeTransform {
  transform(country: Country, searchCriteria?: string): boolean {
    if (!searchCriteria || searchCriteria === '') {
      return true;
    }

    return `${country.name}+${country.dialCode}`.toLowerCase().includes(searchCriteria.toLowerCase());
  }
}
