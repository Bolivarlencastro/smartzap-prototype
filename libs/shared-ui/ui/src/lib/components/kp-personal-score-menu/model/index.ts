export type GamificationMenuTabType = 'ranking' | 'statistics';

export interface GamificationMenuTab {
  title: string;
  value: GamificationMenuTabType;
}

export interface BuildedStatistic {
  label: string;
  value: number | string;
  icon?: string;
  svgIcon?: string;
  pluralize?: boolean;
}
