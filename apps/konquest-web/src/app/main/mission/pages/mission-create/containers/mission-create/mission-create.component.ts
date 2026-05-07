import { ChangeDetectionStrategy, Component, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { MissionModel } from 'app/main/mission/mission.model';
import { Observable } from 'rxjs';
import { MissionActions, MissionSelectors } from '../../store';
import { MatDrawerContainer, MatDrawer, MatDrawerContent } from '@angular/material/sidenav';
import { MissionNavMenuComponent } from '../../components/mission-nav-menu/mission-nav-menu.component';
import { RouterOutlet } from '@angular/router';
import { AsyncPipe } from '@angular/common';
import { TranslocoPipe } from '@jsverse/transloco';

@Component({
  selector: 'app-mission-create',
  templateUrl: './mission-create.component.html',
  styleUrls: ['mission-create.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatDrawerContainer,
    MatDrawer,
    MissionNavMenuComponent,
    MatDrawerContent,
    RouterOutlet,
    AsyncPipe,
    TranslocoPipe,
  ],
})
export class MissionCreateComponent implements OnDestroy {
  protected readonly missionModel$: Observable<MissionModel>;
  protected readonly navTitle$: Observable<string>;
  protected readonly missionDefined$: Observable<boolean>;

  constructor(private store: Store) {
    this.missionModel$ = this.store.select(MissionSelectors.selectMissionModel);
    this.missionDefined$ = this.store.select(MissionSelectors.selectMissionLoaded);
    this.navTitle$ = this.store.select(MissionSelectors.selectNavTitle);
  }

  ngOnDestroy() {
    this.store.dispatch(MissionActions.resetStore());
  }
}
