import { KeepsNavigationItem } from '@keeps-platform-frontend-workspace/layout';

export const NAVIGATION_ITEMS: KeepsNavigationItem[] = [
  {
    id: 'dashboard',
    title: 'NAVIGATION.DASHBOARD',
    type: 'basic',
    icon: 'dashboard',
    link: '/dashboard',
    roles: ['basic_analytics_admin'],
  },
  {
    id: 'course-dashboard',
    title: 'NAVIGATION.COURSE',
    type: 'basic',
    icon: 'school',
    link: '/course',
    roles: ['basic_analytics_admin'],
  },
  {
    id: 'user-dashboard',
    title: 'NAVIGATION.USERS_DASHBOARD',
    type: 'basic',
    icon: 'people',
    link: '/user',
  },
  {
    id: 'report',
    title: 'NAVIGATION.REPORT',
    type: 'basic',
    icon: 'assessment',
    link: '/report',
    roles: ['basic_analytics_admin', 'basic_analytics_leader'],
  },
];
