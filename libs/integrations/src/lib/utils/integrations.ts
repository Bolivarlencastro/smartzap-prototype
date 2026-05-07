import { marker } from '@jsverse/transloco-keys-manager/marker';
import { IntegrationGroup } from '../models/integrations-model';

export const getIntegrations = (environment: any): IntegrationGroup[] => [
  {
    label: marker('INTEGRATIONS.INTEGRATION_LIST.GROUPS.COURSES'),
    items: [
      {
        id: 'alura',
        type: 'toggle',
        disabled: environment.production,
        name: 'Alura',
        workspaceKey: 'alura_integration_active',
        description: marker('INTEGRATIONS.INTEGRATION_LIST.DESCRIPTIONS.ALURA'),
        integrationHireLink: environment.production ? null : 'https://empresas.alura.com.br/selforder/keeps',
      },
    ],
  },
  {
    label: marker('INTEGRATIONS.INTEGRATION_LIST.GROUPS.COMMUNICATION'),
    items: [
      {
        id: 'teams',
        type: 'toggle',
        link: environment.integrationsUrls.teams,
        name: 'Teams',
        workspaceKey: 'notify_teams',
        description: marker('INTEGRATIONS.INTEGRATION_LIST.DESCRIPTIONS.TEAMS'),
        hasInstallInstructions: true,
      },
      {
        id: 'slack',
        type: 'toggle',
        link: environment.integrationsUrls.slack,
        name: 'Slack',
        workspaceKey: 'notify_slack',
        description: marker('INTEGRATIONS.INTEGRATION_LIST.DESCRIPTIONS.SLACK'),
      },
    ],
  },
  {
    label: marker('INTEGRATIONS.INTEGRATION_LIST.GROUPS.PEOPLE_MANAGEMENT'),
    items: [
      {
        id: 'senior',
        type: 'request-form',
        name: 'Senior',
        description: marker('INTEGRATIONS.INTEGRATION_LIST.DESCRIPTIONS.SENIOR'),
      },
      {
        id: 'adp',
        type: 'request-form',
        name: 'ADP',
        description: marker('INTEGRATIONS.INTEGRATION_LIST.DESCRIPTIONS.ADP'),
      },
      {
        id: 'gupy',
        type: 'request-form',
        name: 'GUPY',
        description: marker('INTEGRATIONS.INTEGRATION_LIST.DESCRIPTIONS.GUPY'),
      },
      {
        id: 'solides',
        type: 'request-form',
        name: 'Solides',
        description: marker('INTEGRATIONS.INTEGRATION_LIST.DESCRIPTIONS.SOLIDES'),
      },
      {
        id: 'convenia',
        type: 'request-form',
        name: 'Convenia',
        description: marker('INTEGRATIONS.INTEGRATION_LIST.DESCRIPTIONS.CONVENIA'),
      },
      {
        id: 'dominio',
        type: 'request-form',
        name: 'Domínio',
        description: marker('INTEGRATIONS.INTEGRATION_LIST.DESCRIPTIONS.DOMINIO'),
      },
      {
        id: 'feedz',
        type: 'request-form',
        name: 'Feedz',
        description: marker('INTEGRATIONS.INTEGRATION_LIST.DESCRIPTIONS.FEEDZ'),
      },
      {
        id: 'totvs',
        type: 'request-form',
        name: 'Totvs RM',
        description: marker('INTEGRATIONS.INTEGRATION_LIST.DESCRIPTIONS.TOTVS'),
      },
    ],
  },
  {
    label: marker('INTEGRATIONS.INTEGRATION_LIST.GROUPS.SSO'),
    items: [
      {
        id: 'google',
        type: 'request-form',
        name: 'Google',
        description: marker('INTEGRATIONS.INTEGRATION_LIST.DESCRIPTIONS.GOOGLE'),
      },
      {
        id: 'azure',
        type: 'request-form',
        name: 'Azure / Adfs',
        description: marker('INTEGRATIONS.INTEGRATION_LIST.DESCRIPTIONS.AZURE'),
      },
    ],
  },
];
