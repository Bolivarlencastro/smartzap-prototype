import { GamificationListConfig, GamificationListType } from '@keeps-platform-frontend-workspace/kp-keeps';
import { marker } from '@jsverse/transloco-keys-manager/marker';

export class GamificationHelper {
  static buildHeaderTitle(path: GamificationListType): GamificationListConfig {
    const config = new Map<GamificationListType, Pick<GamificationListConfig, 'headerTitle' | 'headerIconTooltip'>>([
      [
        'points-statement',
        {
          headerTitle: marker('GAMIFICATION.POINTS_STATEMENT.HEADER.TITLE'),
          headerIconTooltip: marker('GAMIFICATION.POINTS_STATEMENT.HEADER.HELP_TOOLTIP'),
        },
      ],
      ['general', { headerTitle: marker('GAMIFICATION.GENERAL_RANKING.HEADER.TITLE') }],
      ['leadership', { headerTitle: marker('GAMIFICATION.LEADERSHIP_RANKING.HEADER.TITLE') }],
      ['directorates', { headerTitle: marker('GAMIFICATION.BOARD_RANKING.HEADER.TITLE') }],
      ['subdirectorates', { headerTitle: marker('GAMIFICATION.SUB_DIRECTORATE_RANKING.HEADER.TITLE') }],
      ['area', { headerTitle: marker('GAMIFICATION.AREA_RANKING.HEADER.TITLE') }],
    ]);

    return config.get(path);
  }

  static buildNameColumnTitle(path: GamificationListType): string {
    const config = new Map<GamificationListType, string>([
      ['leadership', marker('GAMIFICATION.LIST.COLUMNS.LEADER')],
      ['directorates', marker('GAMIFICATION.LIST.COLUMNS.BOARD')],
      ['subdirectorates', marker('GAMIFICATION.LIST.COLUMNS.SUB_DIRECTORATE')],
      ['area', marker('GAMIFICATION.LIST.COLUMNS.AREA')],
    ]);
    return config.get(path);
  }

  static buildTextMessageNoData(path: GamificationListType): string {
    const config = new Map<GamificationListType, string>([
      ['leadership', marker('GAMIFICATION.LIST.NO_DATA.LEADERSHIP')],
      ['directorates', marker('GAMIFICATION.LIST.NO_DATA.BOARD')],
      ['subdirectorates', marker('GAMIFICATION.LIST.NO_DATA.SUB_DIRECTORATE')],
      ['area', marker('GAMIFICATION.LIST.NO_DATA.AREA')],
    ]);
    return config.get(path);
  }
}
