import { maskCpf } from './helpers';

describe('maskCpf', () => {
  it('masks a valid CPF showing only the last 2 digits', () => {
    expect(maskCpf('123.456.789-09')).toBe('***.***.***-09');
  });

  it('handles a CPF with no formatting', () => {
    expect(maskCpf('12345678909')).toBe('***.***.***-09');
  });

  it('returns the original value when CPF has fewer than 11 digits', () => {
    expect(maskCpf('1234567890')).toBe('1234567890');
  });

  it('returns the original value when CPF has more than 11 digits', () => {
    expect(maskCpf('123456789012')).toBe('123456789012');
  });

  it('returns the input when it is an empty string', () => {
    expect(maskCpf('')).toBe('');
  });
});
