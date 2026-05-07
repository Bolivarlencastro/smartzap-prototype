export const apps = {
  konquest: {
    id: '0abf08ea-d252-4d7c-ab45-ab3f9135c288',
    api: 'https://learning-platform-api.keepsdev.com/konquest',
    url: 'https://konquest.keepsdev.com/',
    icon: 'desktop_windows',
    name: 'Konquest',
    services: {
      mission: {
        id: '0d3752f0-15d7-402a-8628-04ed47bcbf41',
        name: 'Mission',
      },
      event: {
        id: '8064f5d7-e9cb-4bb8-8cb5-09030a14bf52',
        name: 'Event',
      },
      pulse: {
        id: 'f19a1f71-82fb-46df-ab88-bdd3700da124',
        name: 'PULSE',
      },
      learning_trail: {
        id: '0d3752f0-15d7-402a-8628-04ed47bcbf42',
        name: 'LEARNING_TRAIL',
      },
      gamification: {
        id: '786f7dc6-5b82-4834-a7a4-6a938ed7dafc',
        name: 'Gamification',
      },
      regulatory_compliance: {
        id: '6064f5d7-e9cb-4bb8-8cb5-09030a14bf5f',
        name: 'Regulatory Compliance',
      },
      dashboard: {
        id: '0d3752f0-15d7-402a-8628-04ed47bcbf43',
        name: 'Dashboard',
      },
      customSections: {
        id: '8d572fd1-cca9-4979-9e72-f3871ac8ee97',
        name: 'Custom Sections',
      },
    },
  },
  myAccount: {
    id: 'ad7e5ad2-1552-43ab-a471-710954f0e66a',
    apiV2: 'https://learning-platform-api.keepsdev.com/myaccount-v2/api',
    url: 'https://myaccount.keepsdev.com/',
    icon: 'assignment_ind',
    name: 'My Account',
  },
  smartzap: {
    id: '84d6715e-9b75-436d-ad44-b74c5a7f6729',
    api: 'https://learning-platform-api.keepsdev.com/smartzap/api/v1',
    url: 'http://smartzap.keepsdev.com/',
    services: {
      id: 'f9743ebc-c159-4dec-9600-cf1f9f0537b3',
      name: 'Smartzap',
    },
    icon: 'done_all',
    name: 'Smartzap',
  },
  learnAnalytics: {
    id: 'c2928f23-a5a6-4f59-94a7-7e409cf1d4f4',
    api: 'https://learning-platform-api.keepsdev.com/analytics/api',
    ai_api: 'https://learning-platform-api-stage.keepsdev.com/analytics-ai',
    url: 'http://analytics.keepsdev.com/',
    services: {
      id: '525e39e2-8054-45f4-93c5-2f132fa4d73a',
      name: 'LearnAnalytics',
    },
    icon: 'analytics',
    name: 'Learn Analytics',
  },
  regulatoryCompliance: {
    api: 'https://learning-platform-api.keepsdev.com/regulatory-compliance/api',
  },
  notification: {
    api: 'https://learning-platform-api.keepsdev.com/notification',
  },
  search: {
    api: 'https://learning-platform-api.keepsdev.com/search',
  },
  kontent: {
    api: 'https://learning-platform-api.keepsdev.com/kontent',
  },
  aluraIntegration: {
    api: 'https://learning-platform-api.keepsdev.com/integration-gateway-alura/api',
  },
  scormWrapper: {
    url: 'https://contents.keepsdev.com/scorm-wrapper/index.html',
  },
  certificateManager: {
    api: 'https://learning-platform-api.keepsdev.com/certificate-manager/api',
  },
  smartzapPortal: {
    api: 'https://portal-smartzap.keepsdev.com/api',
  },
  sisyphus: {
    api: 'https://learning-platform-api.keepsdev.com/sisyphus/api',
  },
  chatbotAnalytics: {
    api: 'https://learning-platform-api.keepsdev.com/analytics-ai/api',
  },
  customSections: {
    api: 'https://learning-platform-api.keepsdev.com/custom-sections',
  },
  imageGenerator: {
    api: 'https://learning-platform-api.keepsdev.com/gateway/image-generator',
  },
  pushManager: {
    api: 'https://learning-platform-api.keepsdev.com/gateway/push-campaign',
  },
  checkpoint: {
    id: '',
    url: 'https://checkpoint.keepsdev.com/',
    authUrl:
      'https://iam.keepsdev.com/auth/realms/keeps/protocol/openid-connect/auth?client_id=checkpoint-frontend&response_mode=fragment&response_type=code&scope=openid&state=81da23dc-45cb-45f0-9873-c5ebd6698713',
  },
};
