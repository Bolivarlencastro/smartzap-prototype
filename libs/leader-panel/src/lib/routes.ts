import { Routes } from '@angular/router';
import { ChannelsComponent } from './containers/channels/channels.component';
import { CoursesComponent } from './containers/courses/courses.component';
import { EventsComponent } from './containers/events/events.component';
import { LeaderPanelComponent } from './containers/leader-panel/leader-panel.component';
import { LedComponent } from './containers/led/led.component';
import { OverviewComponent } from './containers/overview/overview.component';
import { PulsesComponent } from './containers/pulses/pulses.component';
import { TrailsComponent } from './containers/trails/trails.component';
import { LEADER_PANEL_PROVIDERS } from './leader-pannel.providers';

export const leaderPanelRoutes: Routes = [
  {
    path: '',
    component: LeaderPanelComponent,
    providers: LEADER_PANEL_PROVIDERS,
    children: [
      { path: '', redirectTo: 'overview', pathMatch: 'full' },
      {
        path: 'overview',
        component: OverviewComponent,
      },
      {
        path: 'led',
        component: LedComponent,
      },
      {
        path: 'courses',
        component: CoursesComponent,
      },
      {
        path: 'trails',
        component: TrailsComponent,
      },
      {
        path: 'pulses',
        component: PulsesComponent,
      },
      {
        path: 'channels',
        component: ChannelsComponent,
      },
      {
        path: 'events',
        component: EventsComponent,
      },
    ],
  },
] as Routes;
