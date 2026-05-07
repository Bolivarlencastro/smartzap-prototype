import { LearnContentManagementType } from './models/learn-content-list-filter';
import { environment } from 'environments/environment';

export type ManagementRoute = {
  path: string;
  contentType: LearnContentManagementType;
  label: string;
  icon: string;
  serviceId?: string;
};

export const CONTENT_MANAGEMENT_ROUTES: Record<LearnContentManagementType, ManagementRoute> = {
  courses: {
    path: 'courses',
    contentType: 'courses',
    label: 'CONTENT_MANAGEMENT.ROUTES.COURSES',
    icon: 'rocket_launch',
    serviceId: environment.apps.konquest.services.mission.id,
  },
  events: {
    path: 'events',
    contentType: 'events',
    label: 'CONTENT_MANAGEMENT.ROUTES.EVENTS',
    icon: 'calendar_month',
    serviceId: environment.apps.konquest.services.event.id,
  },
  trails: {
    path: 'trails',
    contentType: 'trails',
    label: 'CONTENT_MANAGEMENT.ROUTES.TRAILS',
    icon: 'conversion_path',
    serviceId: environment.apps.konquest.services.learning_trail.id,
  },
  channels: {
    path: 'channels',
    contentType: 'channels',
    label: 'CONTENT_MANAGEMENT.ROUTES.CHANNELS',
    icon: 'hub',
    serviceId: environment.apps.konquest.services.pulse.id,
  },
};
