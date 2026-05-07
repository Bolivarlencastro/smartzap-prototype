import { Keyof } from '@amcharts/amcharts4/.internal/core/utils/Type';
import { Workspace } from '@keeps-platform-frontend-workspace/kp-keeps';

export type IntegrationType = 'toggle' | 'request-form';

export type Integration = {
  id: string;
  name: string;
  description: string;
  type: IntegrationType;
  link?: string;
  active?: boolean;
  disabled?: boolean;
  workspaceKey?: Keyof<Workspace>;
  integrationHireLink?: string;
  error?: 'internal' | 'external';
  hasInstallInstructions?: boolean;
};

export type IntegrationGroup = {
  label: string;
  items: Integration[];
};

export type IntegrationToggleEvent = {
  integration: Integration;
  enabled: boolean;
};
