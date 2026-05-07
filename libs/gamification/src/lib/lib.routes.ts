import { Route } from '@angular/router';
import { GamificationComponent } from './containers/gamification/gamification.component';
import { RankingsComponent } from './containers/rankings/rankings.component';

export const gamificationRoutes: Route[] = [
  {
    path: '',
    children: [
      { path: 'points-statement', component: GamificationComponent },
      {
        path: 'rankings',
        component: RankingsComponent,
        children: [
          { path: '', redirectTo: 'general', pathMatch: 'full' },
          { path: 'general', component: GamificationComponent },
          { path: 'leadership', component: GamificationComponent },
          { path: 'directorates', component: GamificationComponent },
          { path: 'subdirectorates', component: GamificationComponent },
          { path: 'area', component: GamificationComponent },
        ],
      },
    ],
  },
];
