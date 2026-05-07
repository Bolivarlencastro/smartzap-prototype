export interface AppServicesConfig {
  KONQUEST_MISSION: boolean;
  KONQUEST_EVENT: boolean;
  KONQUEST_PULSE: boolean;
  KONQUEST_LEARNING_TRAIL: boolean;
  KONQUEST_REGULATORY_COMPLIANCE: boolean;
  KONQUEST_DASHBOARD: boolean;
  KONQUEST_GAMIFICATION: boolean;
  SMARTZAP: boolean;
  LEARN_ANALYTICS: boolean;
}

export interface AppServicesConfigStatus {
  checked: boolean;
  service: string;
  workspaceId: string;
}
