import { FocusMonitor } from '@angular/cdk/a11y';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import {
  Component,
  DoCheck,
  ElementRef,
  EventEmitter,
  HostBinding,
  Input,
  OnDestroy,
  OnInit,
  Optional,
  Output,
  Self,
} from '@angular/core';
import { NgControl, NG_VALIDATORS, FormsModule } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatFormFieldControl } from '@angular/material/form-field';
import { getExampleNumber, parsePhoneNumberFromString } from 'libphonenumber-js';
import { Subject } from 'rxjs';
import { CountryCode, Examples } from './data/country-code';
import { phoneNumberValidator } from './kp-phone-input.validator';
import { Country } from './model/country.model';
import { KpPhoneInputSearchPipe } from '../../pipes/kp-phone-input-search/kp-phone-input-search.pipe';
import { TranslocoPipe } from '@jsverse/transloco';
import { MatDivider } from '@angular/material/divider';
import { MatInput } from '@angular/material/input';
import { NgClass } from '@angular/common';
import { MatMenuTrigger, MatMenu, MatMenuItem } from '@angular/material/menu';
import { MatButton } from '@angular/material/button';

/** Data structure for holding telephone number. */
export class MyTel {
  constructor(
    public area: string,
    public exchange: string,
    public subscriber: string,
  ) {}
}

/** Custom `MatFormFieldControl` for telephone number input. */
@Component({
  selector: 'kp-phone-input',
  templateUrl: './kp-phone-input.component.html',
  styleUrls: ['./kp-phone-input.component.scss'],
  providers: [
    CountryCode,
    { provide: MatFormFieldControl, useExisting: KpPhoneInputComponent },
    {
      provide: NG_VALIDATORS,
      useValue: phoneNumberValidator,
      multi: true,
    },
  ],
  imports: [
    MatButton,
    MatMenuTrigger,
    NgClass,
    MatMenu,
    MatInput,
    FormsModule,
    MatDivider,
    MatMenuItem,
    TranslocoPipe,
    KpPhoneInputSearchPipe,
  ],
})
export class KpPhoneInputComponent implements OnInit, OnDestroy, DoCheck, MatFormFieldControl<any> {
  private static _nextId = 0;

  static get nextId(): number {
    return this._nextId;
  }

  static set nextId(value: number) {
    this._nextId = value;
  }

  @Input() preferredCountries: Array<string> = [];
  @Input() enablePlaceholder = true;
  @Input() inputPlaceholder = '';
  @Input() cssClass: any;
  @Input() name = '';
  @Input() onlyCountries: Array<string> = [];
  @Input() errorStateMatcher: ErrorStateMatcher = new ErrorStateMatcher();
  @Input() enableSearch = false;
  @Input() searchPlaceholder = '';
  // tslint:disable-next-line:variable-name
  private _placeholder = '';
  // tslint:disable-next-line:variable-name
  private _required = false;
  // tslint:disable-next-line:variable-name
  private _disabled = false;
  stateChanges = new Subject<void>();
  focused = false;
  errorState: any = false;
  @HostBinding() id = `ngx-mat-intl-tel-input-${KpPhoneInputComponent.nextId++}`;
  describedBy = '';
  phoneNumber = '';
  allCountries: Array<Country> = [];
  preferredCountriesInDropDown: Array<Country> = [];
  selectedCountry: Country | undefined;
  numberInstance: any;
  value: any;
  searchCriteria = '';
  @Output()
  countryChanged: EventEmitter<Country> = new EventEmitter<Country>();

  static getPhoneNumberPlaceHolder(countryISOCode: any): any {
    try {
      return getExampleNumber(countryISOCode, Examples)?.number?.toString();
    } catch (e) {
      return e;
    }
  }

  private _getFullNumber() {
    const val = this.phoneNumber.trim();
    const dialCode = this.selectedCountry?.dialCode;
    let prefix;
    const numericVal = val.replace(/\D/g, '');
    // normalized means ensure starts with a 1, so we can match against the full dial code
    const normalizedVal = numericVal.startsWith('1') ? numericVal : '1'.concat(numericVal);
    if (!val.startsWith('+')) {
      // when using separateDialCode, it is visible so is effectively part of the typed number
      prefix = '+'.concat(dialCode || '');
    } else if (
      val &&
      !val.startsWith('1') &&
      dialCode &&
      dialCode.startsWith('1') &&
      dialCode.length === 4 &&
      dialCode !== normalizedVal.slice(0, 4)
    ) {
      // ensure national NANP numbers contain the area code
      prefix = dialCode.slice(1);
    } else {
      prefix = '';
    }
    return numericVal ? prefix + numericVal : '';
  }

  onTouched = () => {};

  propagateChange = (_: any) => {};

  constructor(
    private countryCodeData: CountryCode,
    private fm: FocusMonitor,
    private elRef: ElementRef<HTMLElement>,
    @Optional() @Self() public ngControl: NgControl,
  ) {
    fm.monitor(elRef, true).subscribe((origin) => {
      if (this.focused && !origin) {
        this.onTouched();
      }
      this.focused = !!origin;
      this.stateChanges.next();
    });
    this.fetchCountryData();
    if (this.ngControl != null) {
      this.ngControl.valueAccessor = this;
    }
  }

  ngOnInit() {
    if (this.preferredCountries.length) {
      this.preferredCountries.forEach((iso2) => {
        const preferredCountry = this.allCountries.filter((c) => {
          return c.iso2 === iso2;
        });
        this.preferredCountriesInDropDown.push(preferredCountry[0]);
      });
    }
    if (this.onlyCountries.length) {
      this.allCountries = this.allCountries.filter((c) => this.onlyCountries.includes(c.iso2));
    }
    if (this.numberInstance?.country) {
      // If an existing number is present, we use it to determine selectedCountry
      this.selectedCountry = this.allCountries.find((c) => c.iso2 === this.numberInstance?.country?.toLowerCase());
    } else if (this.preferredCountriesInDropDown.length) {
      this.selectedCountry = this.preferredCountriesInDropDown[0];
    } else {
      this.selectedCountry = this.allCountries[0];
    }

    this.countryChanged.emit(this.selectedCountry);
  }

  ngDoCheck(): void {
    if (this.ngControl) {
      this.errorState =
        (this.ngControl.invalid && this.ngControl.touched) ||
        (this._required && this.ngControl.touched && this.ngControl.value.length <= 3);
      this.stateChanges.next();
    }
  }

  public onPhoneNumberChange(): void {
    try {
      this.numberInstance = parsePhoneNumberFromString(this._getFullNumber());
      this.value = this.numberInstance.number;
      if (this.numberInstance?.isValid()) {
        this.phoneNumber = this.numberInstance.formatNational();
      }
    } catch (_error) {
      // if no possible numbers are there,
      // then the full number is passed so that validator could be triggered and proper error could be shown
      this.value = this._getFullNumber();
    }
    this.propagateChange(this.value);
  }

  public onCountrySelect(country: Country, el: any): void {
    this.selectedCountry = country;
    this.countryChanged.emit(this.selectedCountry);
    this.onPhoneNumberChange();
    el.focus();
  }

  public onInputKeyPress(event: any): void {
    const pattern = /[0-9+\- ]/;
    if (!pattern.test(event.key)) {
      event.preventDefault();
    }
  }

  protected fetchCountryData(): void {
    this.countryCodeData.allCountries.forEach((c) => {
      const country: Country = {
        name: c[0].toString(),
        iso2: c[1].toString(),
        dialCode: c[2].toString(),
        priority: +c[3] || 0,
        areaCodes: (c[4] as string[]) || undefined,
        flagClass: c[1].toString().toUpperCase(),
        placeHolder: '',
      };

      if (this.enablePlaceholder) {
        country.placeHolder = KpPhoneInputComponent.getPhoneNumberPlaceHolder(country.iso2.toUpperCase());
      }

      this.allCountries.push(country);
    });
  }

  registerOnChange(fn: any): void {
    this.propagateChange = fn;
  }

  registerOnTouched(fn: any) {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  writeValue(value: any): void {
    // when form is reset
    if (value === null) {
      this.reset();
    }
    if (value) {
      this.numberInstance = parsePhoneNumberFromString(value);
      if (this.numberInstance) {
        const countryCode = this.numberInstance.country;
        this.phoneNumber = this.numberInstance.formatNational();
        if (!countryCode) {
          return;
        }
        setTimeout(() => {
          this.selectedCountry = this.allCountries.find((c) => c.iso2 === countryCode.toLowerCase());
          this.stateChanges.next();
          this.countryChanged.emit(this.selectedCountry);
        }, 1);
      }
    }
  }

  get empty() {
    return !this.phoneNumber;
  }

  @HostBinding('class.ngx-floating')
  get shouldLabelFloat() {
    return this.focused || !this.empty;
  }

  @Input()
  get placeholder(): string {
    return this._placeholder;
  }

  set placeholder(value: string) {
    this._placeholder = value;
    this.stateChanges.next();
  }

  @Input()
  get required(): boolean {
    return this._required;
  }

  set required(value: boolean) {
    this._required = coerceBooleanProperty(value);
    this.stateChanges.next();
  }

  @Input()
  get disabled(): boolean {
    return this._disabled;
  }

  set disabled(value: boolean) {
    this._disabled = coerceBooleanProperty(value);
    this.stateChanges.next();
  }

  setDescribedByIds(ids: string[]) {
    this.describedBy = ids.join(' ');
  }

  onContainerClick(event: MouseEvent) {
    if ((event.target as Element).tagName.toLowerCase() !== 'input') {
      this.elRef.nativeElement.querySelector('input')?.focus();
    }
  }

  reset() {
    this.phoneNumber = '';
    this.propagateChange(null);
  }

  ngOnDestroy() {
    this.stateChanges.complete();
    this.fm.stopMonitoring(this.elRef);
  }
}
