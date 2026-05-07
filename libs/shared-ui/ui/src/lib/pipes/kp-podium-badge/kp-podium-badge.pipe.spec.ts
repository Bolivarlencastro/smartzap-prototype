import { KpPodiumBadgePipe } from './kp-podium-badge.pipe';

describe('KpPodiumBadgePipe', () => {
  it('create an instance', () => {
    const pipe = new KpPodiumBadgePipe();
    expect(pipe).toBeTruthy();
  });

  describe('transform', () => {
    const pipe = new KpPodiumBadgePipe();
    const cases: any[] = [
      [1, 'background-color: #fec700; color: black'],
      [2, 'background-color: #484e4e; color: white'],
      [3, 'background-color: #b76930; color: white'],
    ];

    test.each(cases)('for position " %p " should return this value: %p', (position, expectedValue) => {
      expect(pipe.transform(position)).toBe(expectedValue);
    });
  });
});
