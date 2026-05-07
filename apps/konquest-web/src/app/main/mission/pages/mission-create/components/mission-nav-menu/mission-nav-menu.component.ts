import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { MissionModel } from 'app/main/mission/mission.model';
import { BehaviorSubject } from 'rxjs';
import { getNavItems, MissionNavItem } from '../mission-nav-menu/mission-nav-items';
import { AsyncPipe } from '@angular/common';
import { MissionNavMenuItemComponent } from '../mission-nav-menu-item/mission-nav-menu-item.component';
import { TranslocoPipe } from '@jsverse/transloco';

@Component({
  selector: 'app-mission-nav-menu',
  templateUrl: './mission-nav-menu.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MissionNavMenuItemComponent, AsyncPipe, TranslocoPipe],
})
export class MissionNavMenuComponent {
  @Input() missionDefined = false;

  @Input()
  set missionModel(missionModel: MissionModel) {
    if (missionModel && missionModel !== this.missionModel) {
      this.navItems$.next(getNavItems(missionModel));
      this._missionModel = missionModel;
    }
  }

  navItems$ = new BehaviorSubject<MissionNavItem[]>([]);
  private _missionModel: MissionModel;
}
