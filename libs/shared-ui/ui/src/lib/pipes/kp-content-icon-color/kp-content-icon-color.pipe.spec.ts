import { KpContentIconColorPipe, ICONS_COLOR_MAP } from './kp-content-icon-color.pipe';

describe('KpContentIconColorPipe', () => {
  describe('transform', () => {
    const pipe = new KpContentIconColorPipe();

    const cases = [
      [ICONS_COLOR_MAP['pdf'], 'pdf'],
      [ICONS_COLOR_MAP['image'], 'image'],
      [ICONS_COLOR_MAP['video'], 'video'],
      [ICONS_COLOR_MAP['spreadsheet'], 'spreadsheet'],
      [ICONS_COLOR_MAP['podcast'], 'podcast'],
      [ICONS_COLOR_MAP['question'], 'question'],
      [ICONS_COLOR_MAP['presentation'], 'presentation'],
      [ICONS_COLOR_MAP['text'], 'text'],
      [ICONS_COLOR_MAP['blog'], 'blog'],
      [ICONS_COLOR_MAP['html'], 'html'],
      [ICONS_COLOR_MAP['html file'], 'html file'],
      [ICONS_COLOR_MAP['scorm'], 'scorm'],
      [ICONS_COLOR_MAP['pdf'], 'PDF'],
      [ICONS_COLOR_MAP['image'], 'Image'],
      [ICONS_COLOR_MAP['video'], 'VIDEO'],
      ['', 'unknown'],
      ['', null],
      ['', undefined],
      ['', ''],
    ];

    test.each(cases)('should return "%s" when the value "%s" is passed', (expectedValue, value) => {
      const result = pipe.transform(value);
      expect(result).toBe(expectedValue);
    });
  });
});
