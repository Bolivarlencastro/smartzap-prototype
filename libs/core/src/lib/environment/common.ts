export const commonEnvConfig = {
  bearerExcludedUrls: [
    '/assets',
    'https://s3.amazonaws.com',
    'http://soundcloud.com/oembed',
    'https://vimeo.com/api/oembed.json',
    'https://assets.keepsdev.com',
    'https://learning-platform-api-stage.keepsdev.com/myaccount-v2/api/workspaces/hash-login-url',
    'https://learning-platform-api.keepsdev.com/myaccount-v2/api/workspaces/hash-login-url',
    'http://localhost:3000/api/workspaces/hash-login-url',
  ],
  link: {
    xmlGroupUsers: 'https://assets.keepsdev.com/files/group-users.xlsx',
    xmlGroupMissions: 'https://assets.keepsdev.com/files/group-missions.xlsx',
    xmlGroupChannels: 'https://assets.keepsdev.com/files/group-channels.xlsx',
    xmlGroupLearningTrails: 'https://assets.keepsdev.com/files/group-learning-trails.xlsx',
  },
  defaultUserAvatar: 'https://assets.keepsdev.com/images/avatars/avatar-placeholder.png',
  defaultCompanyLogo: 'https://assets.keepsdev.com/images/avatars/company_blue.png',
  apmServerUrl: 'https://keeps.apm.us-east-1.aws.cloud.es.io',
  apiDomainPattern: '^https:\\/\\/learning-platform-api(-stage)?\\.keepsdev\\.com(\\/.*)?$',
};
