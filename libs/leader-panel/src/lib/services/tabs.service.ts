import { Inject, Injectable } from '@angular/core';
import { KEEPS_APP_SERVICES, KeepsAppServices, WorkspaceService } from '@keeps-platform-frontend-workspace/kp-keeps';
import { LeaderPanelTab } from '../models/tabs';

@Injectable()
export class TabsService {
  constructor(
    private readonly workspaceService: WorkspaceService,
    @Inject(KEEPS_APP_SERVICES) private readonly keepsAppServices: KeepsAppServices,
  ) {}

  getLeaderPanelTabs(): LeaderPanelTab[] {
    const services = this.keepsAppServices;

    const tabs: LeaderPanelTab[] = [
      {
        path: 'overview',
        label: 'LEADER_PANEL.ROUTES.OVERVIEW',
        icon: 'dashboard',
      },
      {
        path: 'led',
        label: 'LEADER_PANEL.ROUTES.LED',
        icon: 'group',
      },
      {
        path: 'courses',
        label: 'LEADER_PANEL.ROUTES.COURSES',
        icon: 'rocket_launch',
        serviceId: services?.['mission']?.id,
      },
      {
        path: 'trails',
        label: 'LEADER_PANEL.ROUTES.TRAILS',
        icon: 'route',
        serviceId: services?.['learning_trail']?.id,
      },
      {
        path: 'pulses',
        label: 'LEADER_PANEL.ROUTES.PULSES',
        icon: 'track_changes',
        serviceId: services?.['pulse']?.id,
      },
      {
        path: 'channels',
        label: 'LEADER_PANEL.ROUTES.CHANNELS',
        icon: 'hub',
        serviceId: services?.['pulse']?.id,
      },
      {
        path: 'events',
        label: 'LEADER_PANEL.ROUTES.EVENTS',
        icon: 'event',
        serviceId: services?.['event']?.id,
      },
    ];

    return this.verifyActivatedService(tabs);
  }

  private verifyActivatedService(tabs: LeaderPanelTab[]): LeaderPanelTab[] {
    return tabs.filter((tab) => {
      if (!tab.serviceId) {
        return true;
      }

      return this.workspaceService.isServiceActive(tab.serviceId);
    });
  }
}
