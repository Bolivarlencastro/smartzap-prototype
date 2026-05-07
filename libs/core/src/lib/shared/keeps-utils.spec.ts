import { KeepsUtils, SortParams } from './keeps-utils';
import { UntypedFormControl } from '@angular/forms';

describe('KeepsUtils', () => {
  describe('convertToSeconds', () => {
    it('should convert a time string into seconds', () => {
      const fiveMinutes = KeepsUtils.convertToSeconds('00:05');
      const elevenHours = KeepsUtils.convertToSeconds('11:25');

      expect(fiveMinutes).toBe('300');
      expect(elevenHours).toBe('41100');
    });
  });

  describe('filterArrayByString', () => {
    it('should return the main array when search text is empty', () => {
      const mainArr = [{ name: 'John' }, { name: 'Doe' }];
      const searchText = '';

      const result = KeepsUtils.filterArrayByString(mainArr, searchText);

      expect(result).toEqual(mainArr);
    });

    it('should filter the array by string', () => {
      const mainArr = [{ name: 'John' }, { name: 'Doe' }];
      const searchText = 'John';

      const result = KeepsUtils.filterArrayByString(mainArr, searchText);

      expect(result).toEqual([{ name: 'John' }]);
    });
  });

  describe('searchInObj', () => {
    it('should return false for empty object', () => {
      const itemObj = {};
      const searchText = 'John';

      const result = KeepsUtils.searchInObj(itemObj, searchText);

      expect(result).toBe(false);
    });

    it('should return true if search text is a property of object', () => {
      const itemObj = { name: 'John', age: 25 };
      const searchText = 'John';

      const result = KeepsUtils.searchInObj(itemObj, searchText);

      expect(result).toBe(true);
    });
  });

  describe('searchInArray', () => {
    it('should return false for empty array', () => {
      const arr: any[] = [];
      const searchText = 'John';

      const result = KeepsUtils.searchInArray(arr, searchText);

      expect(result).toBe(false);
    });

    it('should return true if search text is found in array', () => {
      const arr = ['John', 'Doe'];
      const searchText = 'John';

      const result = KeepsUtils.searchInArray(arr, searchText);

      expect(result).toBe(true);
    });
  });

  describe('searchInString', () => {
    it('should return true if search text is found in string', () => {
      const value = 'John Doe';
      const searchText = 'John';

      const result = KeepsUtils.searchInString(value, searchText);

      expect(result).toBe(true);
    });
  });

  describe('generateGUID', () => {
    it('should generate a non-empty string', () => {
      const result = KeepsUtils.generateGUID();

      expect(result).toBeTruthy();
    });
  });

  describe('queryToObject', () => {
    it('should return null for null url', () => {
      const result = KeepsUtils.queryToObject(null);

      expect(result).toBeNull();
    });

    it('should convert query string to object', () => {
      const url = 'http://test.com?key1=value1&key2=value2';

      const result = KeepsUtils.queryToObject(url);

      expect(result).toEqual({ key1: 'value1', key2: 'value2' });
    });
  });

  describe('buildSort', () => {
    it('should build sort string for ascending order', () => {
      const params: SortParams = { field: 'name', direction: 'asc' };

      const result = KeepsUtils.buildSort(params);

      expect(result).toBe('name');
    });

    it('should build sort string for descending order', () => {
      const params: SortParams = { field: 'name', direction: 'desc' };

      const result = KeepsUtils.buildSort(params);

      expect(result).toBe('-name');
    });
  });

  describe('objectKeyValidator', () => {
    it('should mark a form control as valid if its value does have a truthy value in the provided key and is not required', () => {
      const control = new UntypedFormControl({ id: 'mock_id' }, KeepsUtils.objectKeyValidator('id'));
      control.updateValueAndValidity();

      expect(control.valid).toBe(true);
    });

    it('should mark a form control as valid if its value does have a truthy value in the provided key and is required', () => {
      const control = new UntypedFormControl({ id: 'mock_id' }, KeepsUtils.objectKeyValidator('id', true));
      control.updateValueAndValidity();

      expect(control.valid).toBe(true);
    });

    it('should mark a form control as invalid if its value does not have a truthy value in the provided key or does not includes it', () => {
      const control = new UntypedFormControl({ name: 'mock_name' }, KeepsUtils.objectKeyValidator('id'));
      control.updateValueAndValidity();

      expect(control.invalid).toBe(true);
    });

    it('should mark a form control as valid if its value does not have a value and is not required', () => {
      const control = new UntypedFormControl(undefined, KeepsUtils.objectKeyValidator('id'));
      control.updateValueAndValidity();

      expect(control.valid).toBe(true);
    });

    it('should mark a form control as invalid if its value does not have a truthy value in the provided key and is required', () => {
      const control = new UntypedFormControl({ name: 'mock_name' }, KeepsUtils.objectKeyValidator('id', true));
      control.updateValueAndValidity();

      expect(control.invalid).toBe(true);
    });
  });

  describe('orderBy', () => {
    it('should order an array of elements by its keys', () => {
      interface User {
        name: string;
        age: number;
      }

      const users: User[] = [
        { name: 'fred', age: 48 },
        { name: 'barney', age: 34 },
        { name: 'fred', age: 40 },
        { name: 'barney', age: 36 },
      ];

      const expectedResult: User[] = [
        { name: 'barney', age: 36 },
        { name: 'barney', age: 34 },
        { name: 'fred', age: 48 },
        { name: 'fred', age: 40 },
      ];

      const result = KeepsUtils.orderBy(users, ['name', 'age'], ['asc', 'desc']);
      expect(result).toMatchObject(expectedResult);
    });
  });

  describe('isNil', () => {
    it('should check if a value is null or undefined', () => {
      expect(KeepsUtils.isNil(undefined)).toBe(true);
      expect(KeepsUtils.isNil(null)).toBe(true);
      expect(KeepsUtils.isNil(0)).toBe(false);
      expect(KeepsUtils.isNil('')).toBe(false);
      expect(KeepsUtils.isNil([])).toBe(false);
    });
  });

  describe('areObjectEqual', () => {
    it('should return whether two objects are equal or not', () => {
      const obj1 = { a: 1, b: { c: 2 } };
      const obj2 = { a: 1, b: { c: 2 } };
      const obj3 = { a: 1, b: { c: 3 } };
      const obj4 = { a: 1, b: { d: 2 } };
      expect(KeepsUtils.areObjectEqual(obj1, obj2)).toBe(true);
      expect(KeepsUtils.areObjectEqual(obj1, obj3)).toBe(false);
      expect(KeepsUtils.areObjectEqual(obj1, obj4)).toBe(false);
    });
  });

  describe('removeNullAndUndefined', () => {
    it('should remove null and undefined properties from an object', () => {
      const initial: Record<string, any> = { name: 'test-course', duration: null, expiration: undefined };
      const expected: Record<string, any> = { name: 'test-course' };
      expect(KeepsUtils.removeNullAndUndefined(initial)).toMatchObject(expected);
    });

    it('should handle invalid objects', () => {
      expect(KeepsUtils.removeNullAndUndefined(undefined)).toMatchObject({});
      expect(KeepsUtils.removeNullAndUndefined(null)).toMatchObject({});
    });
  });
});
