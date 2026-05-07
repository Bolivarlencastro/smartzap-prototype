import { Injectable } from '@angular/core';
import { marker } from '@jsverse/transloco-keys-manager/marker';
import { WorkspaceService } from '@keeps-platform-frontend-workspace/kp-keeps';
import { EnrollmentNavItem } from '../models/enrollment-list';
import { environment } from 'environments/environment';

const KONQUEST_SERVICES = environment.apps.konquest.services;

@Injectable()
export class EnrollmentsService {
  constructor(private workspaceService: WorkspaceService) {}

  getNavLinks(navLinks: EnrollmentNavItem[] = []): EnrollmentNavItem[] {
    const hasLearningTrails = this.hasService('learningTrail');
    const hasMissions = this.hasService('mission');
    const hasEvents = this.hasService('events');

    if (hasLearningTrails) {
      navLinks.push({
        label: marker('SETTING.TAB.LEARNING_TRAIL_ENROLLMENTS'),
        mobileLabel: 'NAVIGATION.TRAILS',
        path: 'learning-trails',
      });
    }

    if (hasMissions) {
      navLinks.push({
        label: marker('SETTING.TAB.MISSION_ENROLLMENTS'),
        mobileLabel: 'NAVIGATION.MISSIONS',
        path: 'missions',
      });
    }

    if (hasEvents) {
      navLinks.push({
        label: marker('SETTING.TAB.EVENT_ENROLLMENTS'),
        mobileLabel: 'NAVIGATION.EVENTS',
        path: 'events',
      });
    }

    return navLinks;
  }

  hasService(service: 'mission' | 'learningTrail' | 'events'): boolean {
    if (service === 'mission') {
      return this.workspaceService.isServiceActive(KONQUEST_SERVICES.mission.id);
    }

    if (service === 'events') {
      return this.workspaceService.isServiceActive(KONQUEST_SERVICES.event.id);
    }

    return this.workspaceService.isServiceActive(KONQUEST_SERVICES.learning_trail.id);
  }
}
