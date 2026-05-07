import { PodiumBorderPipe } from './podium-border.pipe';

describe('PodiumBorderPipe', () => {
  it('create an instance', () => {
    const pipe = new PodiumBorderPipe();
    expect(pipe).toBeTruthy();
  });

  describe('transform', () => {
    const pipe = new PodiumBorderPipe();
    const cases: any[] = [
      [1, '3px solid #fec700'],
      [2, '3px solid #484e4e'],
      [3, '3px solid #b76930'],
      [4, 'none'],
    ];

    test.each(cases)('for position " %p " should return this value: %p', (position, expectedValue) => {
      expect(pipe.transform(position)).toBe(expectedValue);
    });
  });
});
