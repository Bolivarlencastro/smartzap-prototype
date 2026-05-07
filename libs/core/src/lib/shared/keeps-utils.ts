import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { SortDirection } from '@angular/material/sort';

export interface SortParams {
  field: string;
  direction: SortDirection;
}

export class KeepsUtils {
  /**
   * Filter array by string
   *
   * @param mainArr
   * @param searchText
   * @returns
   */
  public static filterArrayByString(mainArr: any, searchText: string): any {
    if (searchText === '') {
      return mainArr;
    }

    searchText = searchText.toLowerCase();

    return mainArr.filter((itemObj: any) => this.searchInObj(itemObj, searchText));
  }

  /**
   * Search in object
   *
   * @param itemObj
   * @param searchText
   * @returns
   */
  public static searchInObj(itemObj: any, searchText: string): boolean {
    if (typeof itemObj === 'string') {
      return this.searchInString(itemObj, searchText);
    }

    for (const prop in itemObj) {
      if (!Object.prototype.hasOwnProperty.call(itemObj, prop)) {
        continue;
      }

      const value = itemObj[prop];

      if (typeof value === 'string') {
        if (this.searchInString(value, searchText)) {
          return true;
        }
      } else if (Array.isArray(value)) {
        if (this.searchInArray(value, searchText)) {
          return true;
        }
      }

      if (typeof value === 'object') {
        if (this.searchInObj(value, searchText)) {
          return true;
        }
      }
    }
    return false;
  }

  /**
   * Search in array
   *
   * @param arr
   * @param searchText
   * @returns
   */
  public static searchInArray(arr: any[], searchText: any): boolean {
    for (const value of arr) {
      if (typeof value === 'string') {
        if (this.searchInString(value, searchText)) {
          return true;
        }
      }

      if (typeof value === 'object') {
        if (this.searchInObj(value, searchText)) {
          return true;
        }
      }
    }
    return false;
  }

  /**
   * Search in string
   *
   * @param value
   * @param searchText
   * @returns
   */
  public static searchInString(value: string, searchText: string): any {
    return value.toLowerCase().includes(searchText.toLowerCase());
  }

  /**
   * Generate a unique GUID
   *
   * @returns
   */
  public static generateGUID(): string {
    function S4(): string {
      return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
    }

    return S4() + S4();
  }

  /**
   * Convert an url with querystring to query params
   */
  public static queryToObject(url: string | null): any {
    let next = url;

    if (!next) {
      return null;
    }

    const index = next.indexOf('?') + 1;
    next = next.substring(index, next.length);

    return next.split('&').reduce((acc, cur) => {
      const pairValue = cur.split('=');
      const key = pairValue[0];
      acc[key] = pairValue[1];
      return acc;
    }, {} as any);
  }

  /**
   * Creates the sort param based on MatTable column
   * @param params the field to sort
   * @example
   * KeepsUtils.buildSort({field: 'name', direction: 'asc'}); // name<br/>
   * KeepsUtils.buildSort({field: 'name', direction: 'desc'}); // -name
   */
  public static buildSort(params: SortParams): string {
    return `${params.direction === 'asc' ? '' : '-'}${params.field}`;
  }

  /**
   * Validates a FormControl by checking if its value is an object containing key as a truthy property.
   * @param key The object property to check.
   * @param required Whether the FormControl is required or not.
   */
  public static objectKeyValidator<T>(key: keyof T | string, required?: boolean): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control?.value;

      if (required && !value) {
        return { invalid: true };
      }

      if (value && !value?.[key]) {
        return { invalid: true };
      }

      return null;
    };
  }

  /**
   * Convert's a string in the HH:mm format into it's seconds value
   * @param time The string to be converted.
   */
  public static convertToSeconds(time: string): string {
    const durationTime = time.split(':');
    return ((parseInt(durationTime[0]) || 0) * 60 * 60 + (parseInt(durationTime[1]) || 0) * 60).toString();
  }

  /**
   * Safely opens an url in a new tab.
   * If the provided url doesn't start with https:// or http:// it will be added to the start before opening.
   * @param url The destination url
   */
  public static openUrlInNewTab(url: string) {
    const urlRegex = /^(http|https):\/\/\S+/gm;
    const destinationUrl = urlRegex.test(url) ? url : `https://${url}`;
    window.open(destinationUrl, '_blank');
  }

  public static orderBy<T>(collection: T[], iterates: Array<keyof T>, orders: Exclude<SortDirection, ''>[]): T[] {
    return collection.sort((a, b) => {
      for (let i = 0; i < iterates.length; i++) {
        const iteratee = iterates[i];
        const order = orders[i] === 'desc' ? -1 : 1;

        const valueA = a[iteratee];
        const valueB = b[iteratee];

        if (valueA < valueB) return -order;
        if (valueA > valueB) return order;
      }
      return 0;
    });
  }

  public static isNil(value: any): value is null | undefined {
    return value == null;
  }

  public static areObjectEqual(obj1: object, obj2: object): boolean {
    if (obj1 === obj2) {
      return true;
    }
    if (typeof obj1 !== 'object' || typeof obj2 !== 'object' || obj1 === null || obj2 === null) {
      return false;
    }
    const keys1 = Object.keys(obj1);
    const keys2 = Object.keys(obj2);
    if (keys1.length !== keys2.length) {
      return false;
    }
    for (const key of keys1) {
      if (!Object.hasOwn(obj2, key)) {
        return false;
      }
      if (!KeepsUtils.areObjectEqual((obj1 as any)[key], (obj2 as any)[key])) {
        return false;
      }
    }
    return true;
  }

  /**
   * Removes null and undefined properties from an object
   */
  public static removeNullAndUndefined<T>(original: T): T {
    const clean = {} as T;
    for (const key in original) {
      if (original[key] !== null && original[key] !== undefined) {
        clean[key] = original[key];
      }
    }
    return clean;
  }

  /**
   * Format any number to float with x decimals
   */
  public static fixNumber(performance: number, fractionDigits = 2): number {
    return parseFloat(performance.toFixed(fractionDigits));
  }
}
