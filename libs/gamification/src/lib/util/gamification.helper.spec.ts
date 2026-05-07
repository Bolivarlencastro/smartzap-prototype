import { GamificationHelper } from './gamification.helper';

describe('GamificationHelper', () => {
  it('should create an instance', () => {
    expect(new GamificationHelper()).toBeTruthy();
  });

  describe('buildHeaderTitle', () => {
    const cases: any[] = [
      [
        'points-statement',
        {
          headerTitle: 'GAMIFICATION.POINTS_STATEMENT.HEADER.TITLE',
          headerIconTooltip: 'GAMIFICATION.POINTS_STATEMENT.HEADER.HELP_TOOLTIP',
        },
      ],
      [
        'general',
        {
          headerTitle: 'GAMIFICATION.GENERAL_RANKING.HEADER.TITLE',
        },
      ],
    ];

    test.each(cases)('for path " %p " should return this configuration: %p', (path, expectedValue) => {
      expect(GamificationHelper.buildHeaderTitle(path)).toEqual(expectedValue);
    });
  });

  describe('buildNameColumnTitle', () => {
    const cases: any[] = [
      ['leadership', 'GAMIFICATION.LIST.COLUMNS.LEADER'],
      ['directorates', 'GAMIFICATION.LIST.COLUMNS.BOARD'],
      ['subdirectorates', 'GAMIFICATION.LIST.COLUMNS.SUB_DIRECTORATE'],
      ['area', 'GAMIFICATION.LIST.COLUMNS.AREA'],
    ];

    test.each(cases)('for path " %p " should return this title: %p', (path, expectedValue) => {
      expect(GamificationHelper.buildNameColumnTitle(path)).toEqual(expectedValue);
    });
  });

  describe('buildNameColumnTitle', () => {
    const cases: any[] = [
      ['leadership', 'GAMIFICATION.LIST.NO_DATA.LEADERSHIP'],
      ['directorates', 'GAMIFICATION.LIST.NO_DATA.BOARD'],
      ['subdirectorates', 'GAMIFICATION.LIST.NO_DATA.SUB_DIRECTORATE'],
      ['area', 'GAMIFICATION.LIST.NO_DATA.AREA'],
    ];

    test.each(cases)('for path " %p " should return this message: %p', (path, expectedValue) => {
      expect(GamificationHelper.buildTextMessageNoData(path)).toEqual(expectedValue);
    });
  });
});
