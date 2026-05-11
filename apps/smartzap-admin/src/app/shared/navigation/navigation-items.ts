import { KeepsNavigationItem } from '@keeps-platform-frontend-workspace/layout';

export const NAVIGATION_ITEMS: KeepsNavigationItem[] = [
  {
    id: 'courses',
    title: 'NAVIGATION.COURSES',
    type: 'basic',
    icon: 'rocket_launch',
    link: '/courses',
  },
  {
    id: 'users',
    title: 'NAVIGATION.USERS',
    type: 'basic',
    icon: 'people',
    link: '/users',
  },
  {
    id: 'enrollments',
    title: 'NAVIGATION.ENROLLMENTS',
    type: 'basic',
    icon: 'school',
    link: '/settings/enrollments',
  },
  {
    id: 'push-manager',
    title: 'NAVIGATION.PUSH_MANAGER',
    type: 'basic',
    icon: 'send',
    link: '/push-manager',
    servicesIds: ['f3986e26-1d86-465b-9864-4c572526f0e5'],
  },
  { id: 'spacer', type: 'spacer' },
  {
    id: 'admin-settings',
    title: 'NAVIGATION.ADMIN',
    type: 'aside',
    icon: 'settings',
    classes: { wrapper: 'mt-auto hidden xxs:block' },
    children: [
      {
        id: 'admin-configuration',
        title: 'NAVIGATION.CONFIGURATION',
        type: 'group',
        classes: { wrapper: 'pointer-events-none' },
        children: [
          {
            id: 'settings',
            title: 'NAVIGATION.GENERAL',
            type: 'basic',
            link: '/settings/configurations',
            exactMatch: true,
          },
          {
            id: 'custom-certificates',
            title: 'NAVIGATION.CERTIFICATES',
            type: 'basic',
            link: '/certificates',
            exactMatch: true,
          },
        ],
      },
    ],
  },
  {
    id: 'help',
    title: 'NAVIGATION.HELP',
    type: 'basic',
    icon: 'help',
    function: () => window.dispatchEvent(new CustomEvent('kp-chatbot-open')),
    classes: { wrapper: 'hidden xxs:block' },
  },
];
