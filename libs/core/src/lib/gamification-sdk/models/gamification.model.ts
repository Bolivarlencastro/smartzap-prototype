import { FormControl } from '@angular/forms';
import { GamificationSubModule } from '../../my-account-sdk';

export interface GamificationListDto {
  id?: string;
  user_id?: string;
  content?: string;
  content_type?: string;
  user?: string;
  avatar?: string;
  job_position?: string;
  leader_name?: string;
  performance?: string;
  total_points?: number;
  points_acquired?: number;
  acquire_date?: Date;
  area_of_activity?: string;
  director?: string;
  manager?: string;
  num_users?: number;
  points_avg?: number;
  position?: number;
  points?: number;
  leader?: string;
}

export interface RankingTab {
  label: string;
  path: string;
}

export interface GamificationListFilterDto {
  search?: string;
  page?: number;
  per_page?: number;
  start_date?: Date;
  end_date?: Date;
}

export interface GamificationPagination {
  totalItems: number;
  perPage: number;
  currentPage: number;
}

export interface GamificationViewModel {
  items: GamificationListDto[];
  currentSearch: string;
  currentDateRange: KpDateRange;
  isLoading: boolean;
  pagination: GamificationPagination;
  hasScore: boolean;
  hasAppliedFilter: boolean;
}

export interface GamificationListConfig {
  headerTitle: string;
  headerIconTooltip?: string;
}

export interface PartialRankingUser {
  id: string;
  position: number;
  avatar: string;
  user: string;
  points: number;
}

export interface GamificationStatistics {
  position: number;
  completed_trails: number;
  completed_missions: number;
  consumed_pulses: number;
  learn_hours: number;
  performance_avg: string;
  conclusion_rate: string;
  total_points: number;
}

export interface GamificationMenuResponse {
  partialRanking: Partial<GamificationListDto>[];
  statistics: GamificationStatistics;
}

export interface Gamification {
  gamification: Partial<GamificationItem>;
  subModules: GamificationSubModule[];
}

export interface GamificationItem extends GamificationSubModule {
  field: string;
  label: string;
  tooltip: string;
}

export enum GamificationField {
  ranking_general = 'GENERAL_RANKING',
  ranking_multiplier = 'MULTIPLIER_RANKING',
  ranking_director = 'RANKING_BY_BOARD',
  ranking_manager = 'RANKING_BY_SUB_DIRECTORATE',
  ranking_activity_area = 'RANKING_BY_AREA',
  ranking_leader = 'RANKING_BY_LEADERSHIP',
}

export type GamificationListType =
  | 'points-statement'
  | 'general'
  | 'leadership'
  | 'multipliers'
  | 'directorates'
  | 'subdirectorates'
  | 'area';

export type EarningType = 'mission' | 'pulse';
export type KpDateRange = DateRange<Date>;
export type KpDateRangeForm = DateRange<FormControl<Date>>;

interface DateRange<T> {
  startDate: T;
  endDate: T;
}

export const podiumColors = new Map<number, string>([
  [1, '#fec700'],
  [2, '#484e4e'],
  [3, '#b76930'],
]);

export const MANAGER_RANKING = 'manager';
export const DIRECTOR_RANKING = 'director';
export const LEADER_RANKING = 'leader';
export const AREA_RANKING = 'activity_area';
export const MULTIPLIER_RANKING = 'multiplier';
