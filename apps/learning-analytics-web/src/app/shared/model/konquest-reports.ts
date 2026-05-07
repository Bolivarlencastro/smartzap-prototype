import { ReportType } from 'app/main/report/enums/report';
import { ReportListType } from 'app/main/report/interfaces';

export const pdfReports: ReportListType[] = [
  { reportType: ReportType.WORKSPACE_OVERVIEW, icon: 'analytics' },
  { reportType: ReportType.COURSE_OVERVIEW, icon: 'mission' },
  { reportType: ReportType.USER_OVERVIEW, icon: 'people_black' },
  { reportType: ReportType.MISSION_ENROLLMENTS_QUIZZES, icon: 'quiz_outlined' },
];

export const xlsxMissionReports: ReportListType[] = [
  { reportType: ReportType.WORKSPACE_MISSION, icon: 'dvr' },
  { reportType: ReportType.MISSION_ENROLLMENTS, icon: 'featured_play_list' },
  { reportType: ReportType.MISSION_QUIZ, icon: 'quiz_outlined' },
  { reportType: ReportType.GROUP_MISSION_USER, icon: 'table_chart' },
  { reportType: ReportType.MISSION_EVALUATIONS, icon: 'fact_check' },
  { reportType: ReportType.MISSION_EVALUATION_ANALYSIS, icon: 'receipt_long' },
];

export const xlsxPulsesReports: ReportListType[] = [
  { reportType: ReportType.PULSE_CHANNELS, icon: 'dvr' },
  { reportType: ReportType.PULSES_ACTIVITIES, icon: 'subscriptions' },
  { reportType: ReportType.PULSES_QUIZ, icon: 'quiz_outlined' },
  { reportType: ReportType.GROUP_CHANNEL_USER, icon: 'table_chart' },
];

export const xlsxUserReports: ReportListType[] = [
  { reportType: ReportType.ALL_USERS, icon: 'contacts' },
  { reportType: ReportType.USERS_ACCESS, icon: 'person_pin' },
  { reportType: ReportType.USER_GENERAL_STATISTICS, icon: 'fingerprint' },
  { reportType: ReportType.USERS_GENERAL_CONSUMPTION, icon: 'contact-page' },
  { reportType: ReportType.USER_PERMISSIONS, icon: 'manage_accounts' },
];

export const xlsxTrailReports: ReportListType[] = [
  { reportType: ReportType.TRAIL_LIST, icon: 'dvr' },
  { reportType: ReportType.TRAIL_ENROLLMENTS, icon: 'featured_play_list' },
  { reportType: ReportType.TRAIL_CONCLUSION_RATE, icon: 'fact_check' },
];
