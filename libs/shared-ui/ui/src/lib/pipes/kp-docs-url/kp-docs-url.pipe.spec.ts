import { KpDocsUrlPipe } from './kp-docs-url.pipe';

describe('KpDocsUrlPipe', () => {
  describe('transform', () => {
    const pipe = new KpDocsUrlPipe();

    const cases = [
      ['https://docs.google.com/document/d/1A2B3C', 'https://docs.google.com/document/d/1A2B3C/preview'],
      ['https://drive.google.com/file/d/1A2B3C', 'https://drive.google.com/file/d/1A2B3C/preview'],
      [
        'https://www.keepsdev.com/file.pdf',
        'https://view.officeapps.live.com/op/embed.aspx?src=https://www.keepsdev.com/file.pdf',
      ],
      [
        'https://keepsdev.com/file.pdf',
        'https://view.officeapps.live.com/op/embed.aspx?src=https://keepsdev.com/file.pdf',
      ],
      ['www.keepsdev.com/file.pdf', 'https://view.officeapps.live.com/op/embed.aspx?src=www.keepsdev.com/file.pdf'],
      ['https://example.com/file.pdf', 'https://example.com/file.pdf'],
      [null, null],
      [undefined, undefined],
      ['', ''],
    ];

    test.each(cases)('should transform "%s" into "%s" based on the matching conditions', (value, expectedValue) => {
      const result = pipe.transform(value);
      expect(result).toBe(expectedValue);
    });
  });
});
