import { KpPhonePipe } from './kp-phone.pipe';

describe('KpPhonePipe', () => {
  let pipe: KpPhonePipe;

  beforeEach(() => {
    pipe = new KpPhonePipe();
  });

  describe('transform', () => {
    it('should return formatted international phone number', () => {
      const phone = '+351999999999';
      const expectedResult = '+351 999 999 999';

      const result = pipe.transform(phone);

      expect(result).toEqual(expectedResult);
    });

    it('should return formatted international phone number and add prefix if phone does not starts with +', () => {
      const phone = '351999999999';
      const expectedResult = '+351 999 999 999';

      const result = pipe.transform(phone);

      expect(result).toEqual(expectedResult);
    });

    it('should return the value unchanged if it is empty', () => {
      const phone = '';

      const result = pipe.transform(phone);

      expect(result).toEqual(phone);
    });

    it('should return the value unchanged if it is undefined', () => {
      const phone = undefined;

      const result = pipe.transform(phone);

      expect(result).toEqual(phone);
    });

    it('should return brazilian format if it is brazilian number', () => {
      const phone = '+5511999999999';
      const expectedResult = '(11) 99999-9999';

      const result = pipe.transform(phone);

      expect(result).toEqual(expectedResult);
    });
  });

  describe('formatInternationalPhone', () => {
    it('should return a phone in international format', () => {
      const phone = '+351999999999';
      const expectedResult = '+351 999 999 999';

      const result = KpPhonePipe.formatInternationalPhone(phone);

      expect(result).toEqual(expectedResult);
    });

    it('should not format text when it is not a valid phone', () => {
      const phone = 'not valid';

      const result = KpPhonePipe.formatInternationalPhone(phone);

      expect(result).toEqual(phone);
    });
  });

  describe('isBrazilianPhone', () => {
    it('should return true when is brazilian number', () => {
      const phone = '+5511999999999';

      const result = KpPhonePipe.isBrazilianPhone(phone);

      expect(result).toBe(true);
    });

    it('should return false when is not brazilian number', () => {
      const phone = '+351999999999';

      const result = KpPhonePipe.isBrazilianPhone(phone);

      expect(result).toBe(false);
    });
  });

  describe('formatBrazilianPhone', () => {
    it('should return a phone in brazilian format', () => {
      const phone = '+5511999999999';

      const result = KpPhonePipe.formatBrazilianPhone(phone);

      expect(result).toBe('(11) 99999-9999');
    });

    it('should return false when is not brazilian number', () => {
      const phone = 'not valid';

      const result = KpPhonePipe.formatBrazilianPhone(phone);

      expect(result).toBe('not valid');
    });
  });
});
